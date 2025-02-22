"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";

// ----- Types -----
export type CouponType =
  | "BOGO"
  | "FreeItem"
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
interface AddCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newCoupon: Partial<Coupon>) => void;
}

export default function AddCouponModal({
  isOpen,
  onClose,
  onSave,
}: AddCouponModalProps) {
  // ------ Local form state ------
  const [couponType, setCouponType] = useState<CouponType | "">("");
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [expirationDate, setExpirationDate] = useState("");

  // BOGO or FreeItem: might need purchased/free item IDs
  const [purchasedItemIds, setPurchasedItemIds] = useState<string[]>([]);
  const [freeItemIds, setFreeItemIds] = useState<string[]>([]);

  // SpendMoreSaveMore
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

  // ------ Helper to parse comma-separated values ------
  function parseCommaSeparatedIds(value: string): string[] {
    return value
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id !== "");
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
      discountValue,
      expirationDate,
    };

    // BOGO or FreeItem
    if (couponType === "BOGO" || couponType === "FreeItem") {
      newCoupon.purchasedItemIds = purchasedItemIds;
      newCoupon.freeItemIds = freeItemIds;
    }

    // “Discount” might be discount on specific items, or you might pass item IDs:
    if (couponType === "Discount") {
      newCoupon.discountValue = discountValue;
      // Possibly store purchasedItemIds for the specific items discounted
    }

    // “SpendMoreSaveMore”
    if (couponType === "SpendMoreSaveMore") {
      newCoupon.minimumSpend = minimumSpend;
      // Optionally handle multiple tiers if needed
      newCoupon.discountValue = discountValue;
    }

    // “FlatDiscount”
    if (couponType === "FlatDiscount") {
      newCoupon.discountValue = discountValue;
    }

    // “ComboDeal”
    if (couponType === "ComboDeal") {
      newCoupon.comboItems = comboItems;
      newCoupon.comboPrice = comboPrice;
    }

    // “FamilyPack”
    if (couponType === "FamilyPack") {
      newCoupon.familyPackItems = familyPackItems;
      newCoupon.familyPackPrice = familyPackPrice;
      newCoupon.portionSize = portionSize;
    }

    // “HappyHour”
    if (couponType === "HappyHour") {
      newCoupon.startHour = startHour;
      newCoupon.endHour = endHour;
      newCoupon.discountValue = discountValue;
    }

    // “LimitedTime”
    if (couponType === "LimitedTime") {
      newCoupon.startTime = startTime;
      newCoupon.endTime = endTime;
      // possibly discountValue if you want a discount for that limited period
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
              className="block w-full text-black mt-1 p-2 border rounded text-black"
              value={couponType}
              onChange={(e) => {
                console.log(e.target.value)
                setCouponType(e.target.value as CouponType)
            }}
            >
              <option value="">-- Select a Type --</option>
              <option value="BOGO">Buy 1 Get 1 (BOGO)</option>
              <option value="FreeItem">Buy 1 Get 1 Free (Specific Item)</option>
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

          {/* ------ Conditional Sections for Each Type ------ */}

          {/* BOGO */}
          {couponType === "BOGO" && (
            <div className="mb-4">
              <label className="block mb-1 text-black font-medium">
                Purchased Item IDs (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. 111,222"
                className="block w-full p-2 border rounded text-black"
                onChange={(e) => {
                  setPurchasedItemIds(parseCommaSeparatedIds(e.target.value));
                }}
              />
              <label className="block mt-2 mb-1 text-black font-medium">
                Free Item IDs (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. 333"
                className="block w-full p-2 border rounded text-black"
                onChange={(e) => {
                  setFreeItemIds(parseCommaSeparatedIds(e.target.value));
                }}
              />
            </div>
          )}

          {/* FreeItem (Buy 1 Get 1 Free Specific Item) */}
          {couponType === "FreeItem" && (
            <div className="mb-4">
              <label className="block mb-1 text-black font-medium">
                Purchased Item IDs (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. 111,222"
                className="block w-full p-2 border rounded text-black"
                onChange={(e) => {
                  setPurchasedItemIds(parseCommaSeparatedIds(e.target.value));
                }}
              />
              <label className="block mt-2 mb-1 text-black font-medium">
                Free Item IDs (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. 333"
                className="block w-full p-2 border rounded text-black"
                onChange={(e) => {
                  setFreeItemIds(parseCommaSeparatedIds(e.target.value));
                }}
              />
            </div>
          )}

          {/* Discount on Specific Items */}
          {couponType === "Discount" && (
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
              {/* If needed: item IDs for the discount */}
              <label className="block mt-2 mb-1 text-black font-medium">
                Specific Item IDs (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. 101,102"
                className="block w-full p-2 border rounded text-black"
                onChange={(e) => {
                  setPurchasedItemIds(parseCommaSeparatedIds(e.target.value));
                }}
              />
            </div>
          )}

          {/* SpendMoreSaveMore */}
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

          {/* FlatDiscount (Storewide) */}
          {couponType === "FlatDiscount" && (
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
                E.g. 20 could mean 20% off or $20 off, depending on the back end.
              </p>
            </div>
          )}

          {/* ComboDeal */}
          {couponType === "ComboDeal" && (
            <div className="mb-4">
              <label className="block mb-1 text-black font-medium">
                Combo Item IDs (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. 111,222"
                className="block w-full p-2 border rounded text-black"
                onChange={(e) => {
                  setComboItems(parseCommaSeparatedIds(e.target.value));
                }}
              />
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

          {/* FamilyPack */}
          {couponType === "FamilyPack" && (
            <div className="mb-4">
              <label className="block mb-1 text-black font-medium">
                Family Pack Items (comma-separated)
              </label>
              <input
                type="text"
                placeholder="e.g. pizza, salad, drinks"
                className="block w-full p-2 border rounded text-black"
                onChange={(e) => {
                  setFamilyPackItems(parseCommaSeparatedIds(e.target.value));
                }}
              />
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

          {/* LimitedTime */}
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

          {/* HappyHour */}
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
