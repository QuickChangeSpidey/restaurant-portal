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
interface Location {
  _id: string;
  name: string;
  address: string;
}

type CouponType =
  | "BOGO"
  | "FreeItem"
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
import AddCouponModal from "@/app/components/AddCouponModal";
import EditCouponModal from "@/app/components/EditCouponModal";
import DeleteCouponModal from "@/app/components/DeleteCouponModal";

export default function CouponsPage() {
  // Locations
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Add Coupon Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit Coupon Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [couponToEdit, setCouponToEdit] = useState<Coupon | null>(null);

  // Delete Coupon Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);

  // Fetch Locations on mount
  useEffect(() => {
    fetchLocations();
  }, []);

  // ----- Fetch Locations -----
  async function fetchLocations() {
    const token = localStorage.getItem("authToken");
    try {
      // Adjust this to match your location endpoint:
      // e.g., GET /api/auth/getRestaurantLocations
      const data: Location[] = await apiFetch("/api/auth/getRestaurantLocations", {
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
      // GET /api/coupons/:locationId
      const data: Coupon[] = await apiFetch(`/api/coupons/${locationId}`, {
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
      const createdCoupon: Coupon = await apiFetch("/api/coupons", {
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
      await apiFetch(`/api/coupons/${couponToDelete._id}`, {
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
      const endpoint = isActive
        ? `/api/coupons/${_id}/deactivate`
        : `/api/coupons/${_id}/activate`;

      // PATCH /api/coupons/:id/activate or /deactivate
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

      {/* Coupons Table */}
      {selectedLocation && (
        <div>
          <table className="min-w-full table-auto border-collapse shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Code</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Discount</th>
                <th className="px-4 py-3 text-left">Expiration</th>
                <th className="px-4 py-3 text-left">Active?</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="border-t px-4 py-3">{coupon.code}</td>
                  <td className="border-t px-4 py-3">{coupon.type}</td>
                  <td className="border-t px-4 py-3">
                    {coupon.discountValue ?? 0}%
                  </td>
                  <td className="border-t px-4 py-3">
                    {new Date(coupon.expirationDate).toLocaleDateString()}
                  </td>
                  <td className="border-t px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-sm ${
                        coupon.isActive
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="border-t px-4 py-3">
                    <div className="flex space-x-4 items-center">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className="text-sm text-gray-500 underline"
                      >
                        {coupon.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <PencilSquareIcon
                        className="h-5 w-5 text-blue-500 cursor-pointer"
                        onClick={() => handleEditCouponClick(coupon)}
                      />
                      <TrashIcon
                        className="h-5 w-5 text-red-500 cursor-pointer"
                        onClick={() => handleDeleteCouponClick(coupon)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ----- Modals ----- */}
      <AddCouponModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCoupon}
      />

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
