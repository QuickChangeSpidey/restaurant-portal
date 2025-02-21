"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface Coupon {
  _id: string;
  type?: string;
  code?: string;
  discountValue?: number;
  expirationDate?: string;
  isActive?: boolean;
  // other fields...
}

interface EditCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: Coupon | null;
  onSave: (updatedCoupon: Coupon) => void;
}

export default function EditCouponModal({
  isOpen,
  onClose,
  coupon,
  onSave,
}: EditCouponModalProps) {
  const [type, setType] = useState("Discount");
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [expirationDate, setExpirationDate] = useState("");

  useEffect(() => {
    if (coupon) {
      setType(coupon.type || "Discount");
      setCode(coupon.code || "");
      setDiscountValue(coupon.discountValue ?? 0);
      if (coupon.expirationDate) {
        // If it's an ISO string, parse it to yyyy-mm-dd for the input
        const date = new Date(coupon.expirationDate);
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        setExpirationDate(`${y}-${m}-${d}`);
      } else {
        setExpirationDate("");
      }
    }
  }, [coupon]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!coupon) return;

    onSave({
      ...coupon,
      type,
      code,
      discountValue,
      expirationDate,
    });
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        {/* Actual Modal */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-4 opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-4 opacity-0"
            >
              <Dialog.Panel className="mx-auto w-full max-w-md rounded bg-white p-6">
                <Dialog.Title className="text-lg font-medium text-gray-900">
                  Edit Coupon
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  {/* Type */}
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Type
                    </label>
                    <select
                      id="type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                    >
                      <option value="BOGO">BOGO</option>
                      <option value="FreeItem">FreeItem</option>
                      <option value="Discount">Discount</option>
                      <option value="SpendMoreSaveMore">
                        SpendMoreSaveMore
                      </option>
                      <option value="FlatDiscount">FlatDiscount</option>
                      <option value="ComboDeal">ComboDeal</option>
                      <option value="FamilyPack">FamilyPack</option>
                      <option value="LimitedTime">LimitedTime</option>
                      <option value="HappyHour">HappyHour</option>
                    </select>
                  </div>
                  {/* Code */}
                  <div>
                    <label
                      htmlFor="code"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Code
                    </label>
                    <input
                      id="code"
                      type="text"
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>
                  {/* Discount Value */}
                  <div>
                    <label
                      htmlFor="discountValue"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Discount Value (%)
                    </label>
                    <input
                      id="discountValue"
                      type="number"
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                      value={discountValue}
                      onChange={(e) =>
                        setDiscountValue(Number(e.target.value))
                      }
                      min="0"
                      max="100"
                    />
                  </div>
                  {/* Expiration Date */}
                  <div>
                    <label
                      htmlFor="expirationDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Expiration Date
                    </label>
                    <input
                      id="expirationDate"
                      type="date"
                      className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                      value={expirationDate}
                      onChange={(e) => setExpirationDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="mr-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
