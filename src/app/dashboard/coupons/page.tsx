"use client";

import { useState, useEffect } from "react";
import { apiFetch, apiFileUpload } from "@/app/lib/api";
import {
  PlusCircleIcon,
  ChevronDownIcon,
  TrashIcon,
  QrCodeIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

import {Coupon as QRCoupon} from "@/app/components/QRCodeModal";

// ----- Types -----
export interface RestaurantLocation {
  _id: string;
  name: string;
  address: string;
}

export type CouponType =
  | "BOGO"
  | "FreeItem"
  | "FreeItemWithPurchase"
  | "DiscountOnSpecificItems"
  | "SpendMoreSaveMore"
  | "StorewideFlatDiscount"
  | "ComboDeal"
  | "FamilyPack"
  | "LimitedTime"
  | "HappyHour";

interface Coupon {
  _id: string;
  locationId: string;
  type: CouponType;
  code: string;
  discountPercentage?: number;
  image?: string;
  expirationDate: string; // store as ISO string for display
  isActive: boolean;
  quantity: number; // Add this line
}

// ----- Modals -----
import QRCouponModal from "@/app/components/QRCodeModal";
import DeleteCouponModal from "@/app/components/DeleteCouponModal";
import AddCouponModal from "@/app/components/AddCouponModal";
import { MenuItem } from "../menu-items/page";
import EditCouponQuantityModal from "@/app/components/EditCouponModal";

export default function CouponsPage() {
  // ----------------- 1) Locations -----------------
  const [locations, setLocations] = useState<RestaurantLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<RestaurantLocation | null>(
    null
  );

  const [isEditQuantityModalOpen, setIsEditQuantityModalOpen] = useState(false);

  // ----------------- 2) Coupons -----------------
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // ----------------- 3) Add Coupon Modal -----------------
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ----------------- 4) Edit Coupon Modal -----------------
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState<Coupon | null>(null);

  // ----------------- 5) Delete Coupon Modal -----------------
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  // ----------------- 6) Filter Coupons (Active / Inactive) -----------------
  const [couponFilter, setCouponFilter] = useState<"All" | "Active" | "Inactive">("All");

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // ----- Filter Coupons Based on Selection -----
  const filteredCoupons = coupons.filter((coupon) => {
    if (couponFilter === "Active") return coupon.isActive;
    if (couponFilter === "Inactive") return !coupon.isActive;
    return true; // Show all
  });

  // ===================== useEffect: Fetch Locations on mount =====================
  useEffect(() => {
    fetchLocations();
    fetchMenuItems();
  }, [selectedLocation]);

  const handleUpdateMenuItems = (newItems: MenuItem[]) => {
    setMenuItems(newItems);
  };

  async function fetchMenuItems() {
    if (!selectedLocation) return;
    const locationId = selectedLocation._id;
    const res = await apiFetch(`/api/auth/locations/${locationId}/menu-items`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });
    setMenuItems(res as MenuItem[]);
  }

  // ----- Fetch Locations -----
  async function fetchLocations() {
    const token = localStorage.getItem("authToken");
    try {
      const data: RestaurantLocation[] = await apiFetch("/api/auth/getRestaurantLocations", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  }

  // ----- Fetch Coupons for Selected Location -----
  async function fetchCoupons(locationId: string) {
    try {
      const data: Coupon[] = await apiFetch(`/api/auth/coupons/${locationId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });
      setCoupons(data);
    } catch (error) {
      console.error("Error fetching coupons", error);
    }
  }

  // ----- ADD (Generate) a New Coupon -----
  async function handleAddCoupon(newCoupon: Partial<Coupon>, selectedFile: File | null) {
    const token = localStorage.getItem("authToken");
    if (!selectedLocation) return;

    try {
      const createdCoupon: Coupon = await apiFetch("/api/auth/coupons", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newCoupon,
          locationId: selectedLocation._id,
        }),
      });



      // Update local state
      handleUpload(createdCoupon, selectedFile);
      setCoupons((prev) => [...prev, createdCoupon]);
    } catch (error) {
      console.error("Error generating coupon", error);
    }
  }

  const handleUpload = async (createdCoupon: Coupon, selectedFile: File | null) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await apiFileUpload(`/api/auth/coupon/${createdCoupon._id}/upload`, {
        method: "POST",
        body: formData,
      }, selectedFile);

      if (!response) {
        throw new Error(`HTTP error! Status: ${response}`);
      }
      if (selectedLocation?._id) {
        fetchCoupons(selectedLocation._id);
      }
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  // ----- EDIT an Existing Coupon -----
  function handleQRCouponClick(coupon: Coupon) {
    setCouponToEdit(coupon);
    setIsQRCodeModalOpen(true);
  }

  function handleEditCouponClick(coupon: Coupon) {
    setCouponToEdit(coupon);
    setIsEditQuantityModalOpen(true);
  }

  async function handleSaveEditedCoupon(updatedData: QRCoupon): Promise<void> {
    const token = localStorage.getItem("authToken");
    if (!updatedData._id) return;

    try {
      const updatedCoupon: Coupon = await apiFetch(
        `/api/auth/coupons/${updatedData._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      // Update local state
      setCoupons((prev) =>
        prev.map((c) => (c._id === updatedCoupon._id ? updatedCoupon : c))
      );
      setIsQRCodeModalOpen(false);
      setCouponToEdit(null);
    } catch (error) {
      console.error("Error updating coupon", error);
    }
  }

  // ----- DELETE a Coupon -----
  function handleDeleteCouponClick(coupon: Coupon) {
    setCouponToDelete(coupon);
    setIsDeleteModalOpen(true);
  }

  async function handleConfirmDeleteCoupon() {
    const token = localStorage.getItem("authToken");
    if (!couponToDelete?._id) return;

    try {
      await apiFetch(`/api/auth/coupons/${couponToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setCoupons((prev) => prev.filter((c) => c._id !== couponToDelete._id));
    } catch (error) {
      console.error("Error deleting coupon", error);
    } finally {
      setIsDeleteModalOpen(false);
      setCouponToDelete(null);
    }
  }

  // ----- ACTIVATE / DEACTIVATE (optional) -----
  async function handleToggleActive(coupon: Coupon) {
    const token = localStorage.getItem("authToken");
    const { _id, isActive } = coupon;
    try {
      const endpoint = isActive
        ? `/api/auth/coupons/${_id}/deactivate`
        : `/api/auth/coupons/${_id}/activate`;

      const updatedCoupon: any = await apiFetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setCoupons((prev) =>
        prev.map((c) => (c._id === updatedCoupon.coupon._id ? updatedCoupon.coupon : c))
      );
    } catch (error) {
      console.error("Error toggling active state", error);
    }
  }

  // ===================== Render the Page =====================
  return (
    <div style={{ padding: '2rem' }}>

      {/* Location Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ position: 'relative', width: '16rem' }}>
          <select
            style={{
              appearance: 'none',
              backgroundColor: '#22c55e',
              color: 'white',
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
              width: '100%',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              outline: 'none',
              paddingRight: '2.5rem',
            }}
            onChange={(e) => {
              const location = locations.find(
                (loc) => loc._id === e.target.value
              );
              if (location) {
                setSelectedLocation(location);
                fetchCoupons(location._id);
              } else {
                setSelectedLocation(null);
                setCoupons([]);
              }
            }}
          >
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name}
              </option>
            ))}
          </select>
          <ChevronDownIcon style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: 'white', pointerEvents: 'none' }} />
        </div>

        {/* Filter Dropdown */}
        <div style={{ position: 'relative', width: '12rem' }}>
          <select
            style={{
              appearance: 'none',
              backgroundColor: '#22c55e',
              color: 'white',
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
              width: '100%',
              borderRadius: '0.75rem',
              cursor: 'pointer',
              outline: 'none',
            }}
            onChange={(e) => setCouponFilter(e.target.value as "All" | "Active" | "Inactive")}
            value={couponFilter}
          >
            <option value="All">All Coupons</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <ChevronDownIcon style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1.25rem', height: '1.25rem', color: 'white', pointerEvents: 'none' }} />
        </div>


        {/* Add Coupon Button */}
        <button
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: selectedLocation ? '#22c55e' : '#22c55e', // Tailwind's green-500 and gray-400
            color: 'white',
            cursor: selectedLocation ? 'pointer' : 'not-allowed',
            opacity: selectedLocation ? 1 : 0.5,
          }}
          onClick={() => setIsAddModalOpen(true)}
          disabled={!selectedLocation}
        >
          <PlusCircleIcon style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
          Generate Coupon
        </button>
      </div>

      {/* If location is selected, show the coupons as tiles */}
      {selectedLocation && (
        <div style={{ marginTop: '3rem', maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
          {/* Custom scrollbar styles (inline) */}
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 8px;
              height: 100%;
            }
            div::-webkit-scrollbar-track {
              background: #ecfdf5;
            }
            div::-webkit-scrollbar-thumb {
              background-color: #5ec26a;
              border-radius: 9999px;
              border: 2px solid #ecfdf5;
            }
            div {
              scrollbar-color: #5ec26a #ecfdf5;
              scrollbar-width: thin;
            }
          `}</style>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem',
            marginTop: '2rem'
          }}>
            {filteredCoupons.map((coupon) => (
              <div
                key={coupon._id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1rem',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                {/* Coupon Info */}
                <div>
                  <img
                    src={coupon.image ? coupon.image : "/food.avif"}
                    alt={coupon.code}
                    style={{ width: '100%', height: '8rem', objectFit: 'cover', borderRadius: '0.75rem' }}
                  />
                  <p style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {coupon.code}
                  </p>
                  {/* Dynamically Display Non-Zero, Non-Empty Fields (Excluding _id & locationId) */}
                  <div>
                    {Object.entries(coupon).map(([key, value]) => {
                      if (
                        ["_id", "locationId", "isActive", "code", "image"].includes(key) || // Exclude these keys
                        value === undefined ||
                        value === null ||
                        value === "" ||
                        (typeof value === "number" && (value === 0 && key !== 'startHour')) || // Skip zero values
                        (Array.isArray(value) && value.length === 0) // Skip empty arrays
                      ) {
                        return null;
                      }
                      let displayValue = value;
                      if (Array.isArray(value)) {
                        // Check if the key corresponds to menu item IDs
                        if (["purchasedItemIds", "comboItems", "freeItemIds"].includes(key)) {
                          displayValue = value
                            .map((id) => menuItems.find((item) => item._id === id)?.name || "Unknown Item")
                            .join(", ");
                        } else {
                          displayValue = value.join(", ");
                        }
                      } else if (typeof value === "boolean") {
                        displayValue = value ? "Yes" : "No";
                      } else if (["expirationDate", "createdAt", "updatedAt"].includes(key)) {
                        // Format Date as "12, May, 2023"
                        displayValue = new Date(value).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        }).replace(/ /g, ", ");
                      }
                      return (
                        <p key={key} style={{ color: "black" }}>
                          <strong>
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:
                          </strong>{" "}
                          {displayValue}
                        </p>
                      );
                    })}
                  </div>
                  {/* Status Badge */}
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.5rem',
                      marginTop: '0.5rem',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      backgroundColor: coupon.isActive ? '#DCFCE7' : '#FEE2E2',
                      color: coupon.isActive ? '#15803D' : '#B91C1C',
                    }}
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {/* Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <button
                    onClick={() => handleToggleActive(coupon)}
                    style={{ fontSize: '0.875rem', color: '#4B5563', textDecoration: 'underline' }}
                  >
                    {coupon.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <PencilIcon
                      style={{ width: '1.25rem', height: '1.25rem', color: '#3B82F6', cursor: 'pointer' }}
                      onClick={() => handleEditCouponClick(coupon)}
                    />
                    <QrCodeIcon
                      style={{ width: '1.25rem', height: '1.25rem', color: '#3B82F6', cursor: 'pointer' }}
                      onClick={() => handleQRCouponClick(coupon)}
                    />
                    <TrashIcon
                      style={{ width: '1.25rem', height: '1.25rem', color: '#EF4444', cursor: 'pointer' }}
                      onClick={() => handleDeleteCouponClick(coupon)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----- Modals ----- */}
      {selectedLocation && (
        <AddCouponModal
          location={selectedLocation}
          menuItems={menuItems}
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddCoupon}
          updateMenuItems={handleUpdateMenuItems}
        />
      )}

      <QRCouponModal
        isOpen={isQRCodeModalOpen}
        onClose={() => setIsQRCodeModalOpen(false)}
        coupon={couponToEdit}
      />

      <DeleteCouponModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        coupon={couponToDelete}
        onConfirmDelete={handleConfirmDeleteCoupon}
      />

      <EditCouponQuantityModal
        isOpen={isEditQuantityModalOpen}
        onClose={() => setIsEditQuantityModalOpen(false)}
        coupon={couponToEdit}
        onSave={handleSaveEditedCoupon}
      />
    </div>
  );
}
