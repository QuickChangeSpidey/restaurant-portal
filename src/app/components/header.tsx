// components/Header.tsx
"use client";

import React, { JSX } from "react";

interface HeaderProps {
  username: string;
  selectedLocation: string;
  locations: string[];
  setSelectedLocation: (value: string) => void;
  phoneVerified: boolean;
  showPhoneDialog: boolean;
  setShowPhoneDialog: (value: boolean) => void;
  verificationCode: string;
  setVerificationCode: (value: string) => void;
  handleVerifyPhone: () => void;
  getVerificationCode: () => void;
}

export function Header({
  username,
  selectedLocation,
  locations,
  setSelectedLocation,
  phoneVerified,
  showPhoneDialog,
  setShowPhoneDialog,
  verificationCode,
  setVerificationCode,
  handleVerifyPhone,
  getVerificationCode,
}: HeaderProps): JSX.Element {
  return (
    <div className="flex flex-col space-y-3">
      {/* Top Bar */}
      <div className="flex justify-between items-center w-full bg-green-500 text-white px-4 py-3 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold">Hello, {username}</h1>
        <div>
          <p className="text-sm">
            {new Date().toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })}
          </p>
          <p className="text-sm">
            {new Date().toLocaleDateString("en-US", { weekday: "long" })},{" "}
            {new Date().toLocaleTimeString("en-US", { hour12: false })}
          </p>
        </div>
        <select
          className="p-2 bg-white text-black border rounded"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Confirmation Alerts */}
      <div className="space-y-2 w-1/3">
        {!phoneVerified && (
          <div
            className="flex items-center justify-start bg-green-500 text-white px-4 py-3 rounded-lg shadow-md cursor-pointer"
            onClick={() => {
              setShowPhoneDialog(true);
              getVerificationCode();
            }}
          >
            <svg
              className="w-6 h-6 mr-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M4.93 19.07a10 10 0 1114.14 0M12 3v.01"
              ></path>
            </svg>
            Confirm your phone
          </div>
        )}
      </div>

      {/* Phone Verification Dialog */}
      {showPhoneDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-2">Verify Phone</h2>
            <input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full p-2 mb-2 border rounded"
            />
            <button
              className="w-full p-2 bg-green-500 text-white rounded"
              onClick={handleVerifyPhone}
            >
              Verify
            </button>
            <button
              className="w-full p-2 bg-red-500 text-white rounded mt-2"
              onClick={() => setShowPhoneDialog(false)}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
