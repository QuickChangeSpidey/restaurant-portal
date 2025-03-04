"use client";

import React from "react";
import { Dialog } from "@headlessui/react";
import { QRCodeCanvas } from "qrcode.react";

// ----- Types -----
export interface Coupon {
  _id: string;
  type: string;
  code: string;
  discountValue?: number;
  expirationDate: string;
  isActive: boolean;
  purchasedItemIds?: string[];
  freeItemIds?: string[];
  minimumSpend?: number;
  comboItems?: string[];
  comboPrice?: number;
  quantity: number;
  portionSize?: string;
  familyPackItems?: string[];
  familyPackPrice?: number;
  startHour?: number;
  endHour?: number;
  startTime?: string;
  endTime?: string;
}

// ----- Props -----
interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: Coupon | null;
}

export default function QRCodeModal({ isOpen, onClose, coupon }: QRCodeModalProps) {
  if (!coupon) return null; // Don't render if there's no coupon

  // Convert coupon data to JSON string for the QR code
  const qrData = JSON.stringify(coupon);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white w-full max-w-md rounded shadow-lg p-6 text-black">
          <Dialog.Title className="text-xl font-semibold mb-4 text-black">
            Coupon QR Code
          </Dialog.Title>

          {/* QR Code */}
          <div className="flex justify-center mb-4">
            <QRCodeCanvas value={qrData || ""} size={256} />
          </div>

          {/* Coupon Details */}
          <p className="text-center font-medium text-black">
            Scan this QR code to redeem the coupon.
          </p>

          {/* Close Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
