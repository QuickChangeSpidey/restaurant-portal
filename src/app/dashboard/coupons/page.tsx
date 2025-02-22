"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";
import {
  PlusCircleIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

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
  | "Discount"
  | "SpendMoreSaveMore"
  | "FlatDiscount"
  | "ComboDeal"
  | "FamilyPack"
  | "LimitedTime"
  | "HappyHour";

interface Coupon {
  _id: string;
  locationId: string;
  type: CouponType;
  code: string;
  discountValue?: number;
  expirationDate: string; // store as ISO string for display
  isActive: boolean;
  // ... other fields (freeItemId, comboItems, etc.)
}

// ----- Modals -----
import EditCouponModal from "@/app/components/EditCouponModal";
import DeleteCouponModal from "@/app/components/DeleteCouponModal";
import AddCouponModal from "@/app/components/AddCouponModal";

export default function CouponsPage() {
  // ----------------- 1) Locations -----------------
  const [locations, setLocations] = useState<RestaurantLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<RestaurantLocation | null>(
    null
  );

  // ----------------- 2) Coupons -----------------
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // ----------------- 3) Add Coupon Modal -----------------
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ----------------- 4) Edit Coupon Modal -----------------
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState<Coupon | null>(null);

  // ----------------- 5) Delete Coupon Modal -----------------
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  // ===================== useEffect: Fetch Locations on mount =====================
  useEffect(() => {
    fetchLocations();
  }, []);

  // ----- Fetch Locations -----
  async function fetchLocations() {
    const token = localStorage.getItem("authToken");
    try {
      // e.g., GET /api/auth/getRestaurantLocations
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
      // e.g., GET /api/coupons/:locationId
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
  async function handleAddCoupon(newCoupon: Partial<Coupon>) {
    const token = localStorage.getItem("authToken");
    if (!selectedLocation) return;

    try {
      // POST /api/coupons
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
      setCoupons((prev) => [...prev, createdCoupon]);
    } catch (error) {
      console.error("Error generating coupon", error);
    }
  }

  // ----- EDIT an Existing Coupon -----
  function handleEditCouponClick(coupon: Coupon) {
    setCouponToEdit(coupon);
    setIsEditModalOpen(true);
  }

  async function handleSaveEditedCoupon(updatedData: Coupon) {
    const token = localStorage.getItem("authToken");
    if (!updatedData._id) return;

    try {
      // PUT /api/coupons/:id
      const updatedCoupon: Coupon = await apiFetch(
        `/api/coupons/${updatedData._id}`,
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
      setIsEditModalOpen(false);
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
      // DELETE /api/coupons/:id
      await apiFetch(`/api/auth/coupons/${couponToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Remove locally
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
      // PATCH /api/coupons/:id/activate or /deactivate
      const endpoint = isActive
        ? `/api/auth/coupons/${_id}/deactivate`
        : `/api/auth/coupons/${_id}/activate`;

      const updatedCoupon: Coupon = await apiFetch(endpoint, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Update in state
      setCoupons((prev) =>
        prev.map((c) => (c._id === updatedCoupon._id ? updatedCoupon : c))
      );
    } catch (error) {
      console.error("Error toggling active state", error);
    }
  }

  // ===================== Render the Page =====================
  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold">Manage Coupons</h2>
      <br />

      {/* Location Selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-64">
          <select
            className="appearance-none bg-green-500 text-white text-sm px-4 py-2 w-full rounded-lg cursor-pointer focus:outline-none pr-10"
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
          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
        </div>

        {/* Add Coupon Button */}
        <button
          className={`px-4 py-2 rounded flex items-center transition-colors ${
            selectedLocation
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-400 text-white opacity-50 cursor-not-allowed"
          }`}
          onClick={() => setIsAddModalOpen(true)}
          disabled={!selectedLocation}
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Generate Coupon
        </button>
      </div>

      {/* If location is selected, show the coupons as tiles */}
      {selectedLocation && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
            >
              {/* Coupon Info */}
              <div>
                <p className="text-xl font-bold mb-2">{coupon.code}</p>
                <p className="text-black">Type: {coupon.type}</p>
                <p className="text-black">
                  Discount: {coupon.discountValue ?? 0}%
                </p>
                <p className="text-black">
                  Expires:{" "}
                  {new Date(coupon.expirationDate).toLocaleDateString()}
                </p>
                <span
                  className={`inline-block px-2 py-1 mt-2 rounded text-sm ${
                    coupon.isActive
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {coupon.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => handleToggleActive(coupon)}
                  className="text-sm text-gray-600 underline"
                >
                  {coupon.isActive ? "Deactivate" : "Activate"}
                </button>
                <div className="flex space-x-4">
                  <PencilSquareIcon
                    className="h-5 w-5 text-blue-500 cursor-pointer"
                    onClick={() => handleEditCouponClick(coupon)}
                  />
                  <TrashIcon
                    className="h-5 w-5 text-red-500 cursor-pointer"
                    onClick={() => handleDeleteCouponClick(coupon)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ----- Modals ----- */}
      {selectedLocation && (
        <AddCouponModal
          location={selectedLocation}
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddCoupon}
        />
      )}

      <EditCouponModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        coupon={couponToEdit}
        onSave={handleSaveEditedCoupon}
      />

      <DeleteCouponModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        coupon={couponToDelete}
        onConfirmDelete={handleConfirmDeleteCoupon}
      />
    </div>
  );
}
