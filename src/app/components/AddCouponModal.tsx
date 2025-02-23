"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { apiFetch } from "../lib/api";
import { MenuItem } from "../dashboard/menu-items/page";
import { RestaurantLocation } from "../dashboard/coupons/page";

// ----- Types -----
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

export interface Coupon {
  _id: string;
  locationId: string;
  type: CouponType;
  code: string;
  discountPercentage?: number;
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
  quantity: number;
  // etc.
}

// ----- Modal Props -----
interface AddCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newCoupon: Partial<Coupon>) => void;
  location: RestaurantLocation | null;
}

export default function AddCouponModal({
  isOpen,
  onClose,
  onSave,
  location,
}: AddCouponModalProps) {
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

  // Menu Items (fetched from your API)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Menu Items (fetched from your API)
  const [quantity, setQuantitiy] = useState<number>(0);

  // ------ Fetch Menu Items if location is set ------
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

  // ------ Reset all fields ------
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

  // ------ Handle Save ------
  function handleSave() {
    // Build the object you’ll POST to the server
    const newCoupon: Partial<Coupon> = {
      type: couponType as CouponType,
      code,
      discountPercentage: discountValue,
      expirationDate,
      quantity
    };

    // BOGO
    if (couponType === "BOGO") {
      newCoupon.purchasedItemIds = purchasedItemIds;
      newCoupon.freeItemIds = freeItemIds;
    }

    // FreeItem
    if (couponType === "FreeItem") {
      newCoupon.purchasedItemIds = purchasedItemIds;
      newCoupon.freeItemIds = freeItemIds;
    }

    // FreeItemWithPurchase
    if (couponType === "FreeItemWithPurchase") {
      newCoupon.minimumSpend = minimumSpend;
      newCoupon.freeItemIds = freeItemIds;
      newCoupon.purchasedItemIds = purchasedItemIds;
    }

    // Discount
    if (couponType === "DiscountOnSpecificItems") {
      newCoupon.discountPercentage = discountValue;
      newCoupon.purchasedItemIds = purchasedItemIds;
    }

    // SpendMoreSaveMore
    if (couponType === "SpendMoreSaveMore") {
      newCoupon.minimumSpend = minimumSpend;
      newCoupon.discountPercentage = discountValue;
    }

    // StorewideFlatDiscount
    if (couponType === "StorewideFlatDiscount") {
      newCoupon.discountPercentage = discountValue;
    }

    // ComboDeal
    if (couponType === "ComboDeal") {
      newCoupon.comboItems = comboItems;
      newCoupon.comboPrice = comboPrice;
    }

    // FamilyPack
    if (couponType === "FamilyPack") {
      newCoupon.familyPackItems = familyPackItems;
      newCoupon.familyPackPrice = familyPackPrice;
      newCoupon.portionSize = portionSize;
    }

    // HappyHour
    if (couponType === "HappyHour") {
      newCoupon.startHour = startHour;
      newCoupon.endHour = endHour;
      newCoupon.discountPercentage = discountValue;
    }

    // LimitedTime
    if (couponType === "LimitedTime") {
      newCoupon.startTime = startTime;
      newCoupon.endTime = endTime;
    }

    // Send to parent
    onSave(newCoupon);

    // Reset fields & close
    resetForm();
    onClose();
  }

  // ------ Render the modal ------
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Dialog Panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white w-full max-w-md rounded shadow-lg p-6 text-black">
          <Dialog.Title className="text-xl font-semibold mb-4 text-black">
            Generate New Coupon
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
              <option value="FreeItemWithPurchase">Free Item with Purchase</option>
              <option value="DiscountOnSpecificItems">Discount on Specific Items</option>
              <option value="SpendMoreSaveMore">Spend More Save More</option>
              <option value="StorewideFlatDiscount">Storewide Flat Discount</option>
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

          {/* Quantity */}
          <label className="block mb-2 text-black">
            Quantity
            <input
              type="number"
              className="block w-full mt-1 p-2 border rounded text-black"
              value={quantity}
              onChange={(e) => setQuantitiy(Number(e.target.value))}
            />
          </label>

          {/* ------ Conditional Sections for Each Type ------ */}

          {/* 1. BOGO */}
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

          {/* 2. FreeItem */}
          {couponType === "FreeItem" && (
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

          {/* 3. FreeItemWithPurchase */}
          {couponType === "FreeItemWithPurchase" && (
            <div className="mb-4">
              <p className="text-sm text-black">
                User must purchase certain items or spend a certain amount to get a free item.
              </p>
              <label className="block mt-2 mb-1 text-black font-medium">
                Minimum Spend (optional)
              </label>
              <input
                type="number"
                className="block w-full p-2 border rounded text-black"
                value={minimumSpend}
                onChange={(e) => setMinimumSpend(Number(e.target.value))}
              />

              <label className="block mt-2 mb-1 text-black font-medium">
                Purchased Items (optional)
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

          {/* 4. Discount on Specific Items */}
          {couponType === "DiscountOnSpecificItems" && (
            <div className="mb-4">
              <label className="block mb-1 text-black font-medium">
                Discount Value
              </label>
              <input
                type="number"
                className="block w-full p-2 border rounded text-black"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
              />
              <p className="text-sm text-black mt-1 italic">
                Could be a % off or $ off per your backend logic.
              </p>

              <label className="block mt-2 mb-1 text-black font-medium">
                Items to Discount
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
            </div>
          )}

          {/* 5. SpendMoreSaveMore */}
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
              <p className="text-sm text-black mt-1 italic">
                For multi-tier logic, adapt as needed.
              </p>
            </div>
          )}

          {/* 6. StorewideFlatDiscount (Storewide) */}
          {couponType === "StorewideFlatDiscount" && (
            <div className="mb-4">
              <label className="block mb-1 text-black font-medium">
                Discount Value
              </label>
              <input
                type="number"
                className="block w-full p-2 border rounded text-black"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
              />
              <p className="text-sm text-black mt-1 italic">
                E.g. 20 could mean 20% off or $20 off.
              </p>
            </div>
          )}

          {/* 7. ComboDeal */}
          {couponType === "ComboDeal" && (
            <div className="mb-4">
              <label className="block mb-1 text-black font-medium">
                Combo Items
              </label>
              <select
                multiple
                className="block w-full p-2 border rounded text-black"
                value={comboItems}
                onChange={(e) => handleMultiSelectChange(e, setComboItems)}
              >
                {menuItems.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <label className="block mt-2 mb-1 text-black font-medium">
                Combo Price
              </label>
              <input
                type="number"
                className="block w-full p-2 border rounded text-black"
                value={comboPrice}
                onChange={(e) => setComboPrice(Number(e.target.value))}
              />
            </div>
          )}

          {/* 8. FamilyPack */}
          {couponType === "FamilyPack" && (
            <div className="mb-4">
              <label className="block mb-1 text-black font-medium">
                Family Pack Items
              </label>
              <select
                multiple
                className="block w-full p-2 border rounded text-black"
                value={familyPackItems}
                onChange={(e) => handleMultiSelectChange(e, setFamilyPackItems)}
              >
                {menuItems.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>

              <label className="block mt-2 mb-1 text-black font-medium">
                Family Pack Price
              </label>
              <input
                type="number"
                className="block w-full p-2 border rounded text-black"
                value={familyPackPrice}
                onChange={(e) => setFamilyPackPrice(Number(e.target.value))}
              />
              <label className="block mt-2 mb-1 text-black font-medium">
                Portion Size
              </label>
              <input
                type="text"
                className="block w-full p-2 border rounded text-black"
                value={portionSize}
                onChange={(e) => setPortionSize(e.target.value)}
              />
            </div>
          )}

          {/* 9. LimitedTime */}
          {couponType === "LimitedTime" && (
            <div className="mb-4">
              <p className="text-sm text-black">
                Set a start and end date/time for the limited-time offer.
              </p>
              <label className="block mt-2 mb-1 text-black font-medium">
                Start Time
              </label>
              <input
                type="datetime-local"
                className="block w-full p-2 border rounded text-black"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <label className="block mt-2 mb-1 text-black font-medium">
                End Time
              </label>
              <input
                type="datetime-local"
                className="block w-full p-2 border rounded text-black"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          )}

          {/* 10. HappyHour */}
          {couponType === "HappyHour" && (
            <div className="mb-4">
              <p className="text-sm text-black">
                Provide start/end hours and discount percentage.
              </p>
              <label className="block mt-2 mb-1 text-black font-medium">
                Start Hour (0-23)
              </label>
              <input
                type="number"
                className="block w-full p-2 border rounded text-black"
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
              />
              <label className="block mt-2 mb-1 text-black font-medium">
                End Hour (0-23)
              </label>
              <input
                type="number"
                className="block w-full p-2 border rounded text-black"
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
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

          {/* ------ Action Buttons ------ */}
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
