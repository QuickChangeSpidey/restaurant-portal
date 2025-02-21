"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface Coupon {
  _id: string;
  code?: string;
  // etc...
}

interface DeleteCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: Coupon | null;
  onConfirmDelete: () => void;
}

export default function DeleteCouponModal({
  isOpen,
  onClose,
  coupon,
  onConfirmDelete,
}: DeleteCouponModalProps) {
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

        {/* Modal Panel */}
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
                  Delete Coupon
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete the coupon with code{" "}
                    <strong>{coupon?.code}</strong>? This action cannot be
                    undone.
                  </p>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="mr-2 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700"
                    onClick={() => {
                      onConfirmDelete();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
