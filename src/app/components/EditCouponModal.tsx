"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { apiFetch } from "../lib/api"; // Adjust path if needed
import { MenuItem } from "../dashboard/menu-items/page";
import { RestaurantLocation } from "../dashboard/coupons/page";

// ----- Types -----
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

export interface Coupon {
  _id: string;
  locationId: string;
  type: CouponType;
  code: string;
  discountValue?: number;
  expirationDate: string;
  isActive: boolean;
  // Additional fields for each type as needed...
  purchasedItemIds?: string[];
  freeItemIds?: string[];
  minimumSpend?: number;
  comboItems?: string[];
  comboPrice?: number;
  portionSize?: string;
  familyPackItems?: string[];
  familyPackPrice?: number;
  startHour?: number;
  endHour?: number;
  startTime?: string;
  endTime?: string;
  // etc.
}

// ----- Modal Props -----
interface EditCouponModalProps {
  isOpen: boolean;
  onClose: () => void;

  // The coupon we're editing (null if none selected)
  coupon: Coupon | null;

  // The function to call when user saves changes
  onSave: (updatedCoupon: Partial<Coupon>) => void;

  // If we need location info for fetching menu items
  location?: RestaurantLocation | null;
}

export default function EditCouponModal({
  isOpen,
  onClose,
  coupon,
  onSave,
  location,
}: EditCouponModalProps) {
  // ------ Local form state ------
  const [couponType, setCouponType] = useState<CouponType | "">("");
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [expirationDate, setExpirationDate] = useState("");

  // BOGO or FreeItem or FreeItemWithPurchase: might need purchased/free item IDs
  const [purchasedItemIds, setPurchasedItemIds] = useState<string[]>([]);
  const [freeItemIds, setFreeItemIds] = useState<string[]>([]);

  // For “FreeItemWithPurchase” or “SpendMoreSaveMore”
  const [minimumSpend, setMinimumSpend] = useState<number>(0);

  // ComboDeal
  const [comboItems, setComboItems] = useState<string[]>([]);
  const [comboPrice, setComboPrice] = useState<number>(0);

  // FamilyPack
  const [familyPackItems, setFamilyPackItems] = useState<string[]>([]);
  const [familyPackPrice, setFamilyPackPrice] = useState<number>(0);
  const [portionSize, setPortionSize] = useState("");

  // HappyHour
  const [startHour, setStartHour] = useState<number>(0);
  const [endHour, setEndHour] = useState<number>(0);

  // LimitedTime
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  // ------ Menu Items (fetched from your API) ------
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // =================== 1) Fetch Menu Items if location is set ===================
  useEffect(() => {
    if (location) {
      fetchMenuItems(location._id);
    }
  }, [location]);

  async function fetchMenuItems(locationId: string) {
    const res = await apiFetch(`/api/auth/locations/${locationId}/menu-items`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });
    setMenuItems(res as MenuItem[]);
  }

  // =================== 2) Pre-fill form from `coupon` prop ===================
  useEffect(() => {
    if (coupon) {
      setCouponType(coupon.type || "");
      setCode(coupon.code || "");
      setDiscountValue(coupon.discountValue ?? 0);
      setExpirationDate(coupon.expirationDate || "");

      setPurchasedItemIds(coupon.purchasedItemIds || []);
      setFreeItemIds(coupon.freeItemIds || []);
      setMinimumSpend(coupon.minimumSpend ?? 0);

      setComboItems(coupon.comboItems || []);
      setComboPrice(coupon.comboPrice ?? 0);

      setFamilyPackItems(coupon.familyPackItems || []);
      setFamilyPackPrice(coupon.familyPackPrice ?? 0);
      setPortionSize(coupon.portionSize || "");

      setStartHour(coupon.startHour ?? 0);
      setEndHour(coupon.endHour ?? 0);
      setStartTime(coupon.startTime || "");
      setEndTime(coupon.endTime || "");
    }
  }, [coupon]);

  // ------ Helper: Multi-Select onChange ------
  function handleMultiSelectChange(
    e: React.ChangeEvent<HTMLSelectElement>,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    // Convert the <option> selections into an array of IDs
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map((option) => option.value);
    setter(selectedIds);
  }

  // =================== 3) Handle Save ===================
  function handleSave() {
    if (!coupon) {
      // If somehow coupon is null, do nothing
      return;
    }

    // Build the partial object with updated fields
    const updatedCoupon: Partial<Coupon> = {
      _id: coupon._id, // keep the original ID
      type: couponType as CouponType,
      code,
      discountValue,
      expirationDate,
    };

    // BOGO
    if (couponType === "BOGO") {
      updatedCoupon.purchasedItemIds = purchasedItemIds;
      updatedCoupon.freeItemIds = freeItemIds;
    }

    // FreeItem
    if (couponType === "FreeItem") {
      updatedCoupon.purchasedItemIds = purchasedItemIds;
      updatedCoupon.freeItemIds = freeItemIds;
    }

    // FreeItemWithPurchase
    if (couponType === "FreeItemWithPurchase") {
      updatedCoupon.minimumSpend = minimumSpend;
      updatedCoupon.freeItemIds = freeItemIds;
      updatedCoupon.purchasedItemIds = purchasedItemIds;
    }

    // Discount
    if (couponType === "Discount") {
      updatedCoupon.discountValue = discountValue;
      updatedCoupon.purchasedItemIds = purchasedItemIds;
    }

    // SpendMoreSaveMore
    if (couponType === "SpendMoreSaveMore") {
      updatedCoupon.minimumSpend = minimumSpend;
      updatedCoupon.discountValue = discountValue;
    }

    // FlatDiscount
    if (couponType === "FlatDiscount") {
      updatedCoupon.discountValue = discountValue;
    }

    // ComboDeal
    if (couponType === "ComboDeal") {
      updatedCoupon.comboItems = comboItems;
      updatedCoupon.comboPrice = comboPrice;
    }

    // FamilyPack
    if (couponType === "FamilyPack") {
      updatedCoupon.familyPackItems = familyPackItems;
      updatedCoupon.familyPackPrice = familyPackPrice;
      updatedCoupon.portionSize = portionSize;
    }

    // HappyHour
    if (couponType === "HappyHour") {
      updatedCoupon.startHour = startHour;
      updatedCoupon.endHour = endHour;
      updatedCoupon.discountValue = discountValue;
    }

    // LimitedTime
    if (couponType === "LimitedTime") {
      updatedCoupon.startTime = startTime;
      updatedCoupon.endTime = endTime;
    }

    // Call parent with the updated coupon
    onSave(updatedCoupon);

    // Close the modal
    onClose();
  }

  // ------ Optional: Reset all fields if user cancels ------
  function resetForm() {
    setCouponType("");
    setCode("");
    setDiscountValue(0);
    setExpirationDate("");
    setPurchasedItemIds([]);
    setFreeItemIds([]);
    setMinimumSpend(0);
    setComboItems([]);
    setComboPrice(0);
    setFamilyPackItems([]);
    setFamilyPackPrice(0);
    setPortionSize("");
    setStartHour(0);
    setEndHour(0);
    setStartTime("");
    setEndTime("");
  }

  // =================== 4) Render the Modal ===================
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* The backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* The actual modal dialog */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white w-full max-w-md rounded shadow-lg p-6 text-black">
          <Dialog.Title className="text-xl font-semibold mb-4 text-black">
            Edit Coupon
          </Dialog.Title>

          {/* Coupon Type */}
          <label className="block mb-2 text-black">
            Coupon Type
            <select
              className="block w-full mt-1 p-2 border rounded text-black"
              value={couponType}
              onChange={(e) => setCouponType(e.target.value as CouponType)}
            >
              <option value="">-- Select a Type --</option>
              <option value="BOGO">Buy 1 Get 1 (BOGO)</option>
              <option value="FreeItem">Buy 1 Get 1 Free (Specific Item)</option>
              <option value="FreeItemWithPurchase">Free Item with Purchase</option>
              <option value="Discount">Discount on Specific Items</option>
              <option value="SpendMoreSaveMore">Spend More Save More</option>
              <option value="FlatDiscount">Storewide Flat Discount</option>
              <option value="ComboDeal">Combo Deal</option>
              <option value="FamilyPack">Family Pack</option>
              <option value="LimitedTime">Limited Time</option>
              <option value="HappyHour">Happy Hour</option>
            </select>
          </label>

          {/* Code */}
          <label className="block mb-2 text-black">
            Code
            <input
              type="text"
              className="block w-full mt-1 p-2 border rounded text-black"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>

          {/* Expiration Date */}
          <label className="block mb-2 text-black">
            Expiration Date
            <input
              type="date"
              className="block w-full mt-1 p-2 border rounded text-black"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
            />
          </label>

          {/* -------------- Conditional Sections -------------- */}

          {couponType === "BOGO" && (
            <div className="mb-4">
              <label className="block mb-1 text-black font-medium">
                Purchased Items
              </label>
              <select
                multiple
                className="block w-full p-2 border rounded text-black"
                value={purchasedItemIds}
                onChange={(e) => handleMultiSelectChange(e, setPurchasedItemIds)}
              >
                {menuItems.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <label className="block mt-2 mb-1 text-black font-medium">
                Free Items
              </label>
              <select
                multiple
                className="block w-full p-2 border rounded text-black"
                value={freeItemIds}
                onChange={(e) => handleMultiSelectChange(e, setFreeItemIds)}
              >
                {menuItems.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Repeat for FreeItem, FreeItemWithPurchase, Discount, etc. */}
          {/* See your AddCouponModal for the exact blocks */}
          {/* The logic is the same, just pulling from local states. */}

          {couponType === "FreeItem" && (
            <div className="mb-4">
              {/* ... */}
            </div>
          )}

          {couponType === "SpendMoreSaveMore" && (
            <div className="mb-4">
              <label className="block mb-1 text-black font-medium">
                Minimum Spend
              </label>
              <input
                type="number"
                className="block w-full p-2 border rounded text-black"
                value={minimumSpend}
                onChange={(e) => setMinimumSpend(Number(e.target.value))}
              />
              <label className="block mt-2 mb-1 text-black font-medium">
                Discount Value
              </label>
              <input
                type="number"
                className="block w-full p-2 border rounded text-black"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
              />
            </div>
          )}

          {/* ... and so on for each type ... */}

          {/* Save & Cancel Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
