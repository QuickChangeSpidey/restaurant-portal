"use client";

import Head from "next/head";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import { useState } from "react";

interface UserInfo {
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  password: string;
  address: string;
  email: string;
}

const AccountPage: React.FC = () => {
  // Dummy user data (you might fetch this from your API or context)
  const userInfo: UserInfo = {
    firstName: "John",
    lastName: "Doe",
    dob: "1990-01-01",
    phone: "123-456-7890",
    password: "********",
    address: "123 Main Street, City, Country",
    email: "akshay.pandey.ca@gmail.com",
  };

  // Modal state management for editing fields
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState<keyof UserInfo | "">("");
  const [fieldValue, setFieldValue] = useState("");

  // Phone verification state management
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [phoneInput, setPhoneInput] = useState(userInfo.phone); // prefill with current phone
  const [verificationCode, setVerificationCode] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  // Handle edit button click
  const handleEdit = (field: keyof UserInfo, currentValue: string) => {
    setEditingField(field);
    setFieldValue(currentValue);
    setShowModal(true);
  };

  // Dummy save handler (replace with your update logic)
  const handleSave = () => {
    console.log(`Saving ${editingField}: ${fieldValue}`);
    // Save the new value here
    setShowModal(false);
  };

  // Function to request sending the verification code to the phone number
  const getVerificationCode = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/verify-attribute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({
          attributeName: "phone_number",
          phone: phoneInput, // if your API requires the phone number
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to send verification code");
      }
      alert("Verification code sent to your phone!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Function to verify the phone using the entered code
  const handleVerifyPhone = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/auth/confirm-phone-or-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          attributeName: "phone_number",
          code: verificationCode,
        }),
      });
      if (!response.ok) {
        throw new Error("Phone verification failed");
      }
      localStorage.setItem("phoneVerified", "true");
      setPhoneVerified(true);
      setShowPhoneDialog(false);
      localStorage.setItem("phone_verified", "true");
      alert("Phone verification successful!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>My Account - Restaurant App</title>
      </Head>
      
        {/* Main Content Area: scrollable */}
        <main className="flex-1 p-6 overflow-y-auto">
          <section className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl text-gray-800 font-semibold mb-6">My Account</h2>
            <div className="space-y-4">
              {/* First Name */}
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="text-gray-600">First Name</p>
                  <p className="text-gray-800 font-medium">{userInfo.firstName}</p>
                </div>
                <button onClick={() => handleEdit("firstName", userInfo.firstName)}>
                  <PencilIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              {/* Last Name */}
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="text-gray-600">Last Name</p>
                  <p className="text-gray-800 font-medium">{userInfo.lastName}</p>
                </div>
                <button onClick={() => handleEdit("lastName", userInfo.lastName)}>
                  <PencilIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              {/* Date of Birth */}
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="text-gray-600">Date of Birth</p>
                  <p className="text-gray-800 font-medium">{userInfo.dob}</p>
                </div>
                <button onClick={() => handleEdit("dob", userInfo.dob)}>
                  <PencilIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              {/* Phone */}
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="text-gray-800 font-medium">{userInfo.phone}</p>
                  {phoneVerified && <span className="text-green-600 text-sm">Verified</span>}
                </div>
                <div className="flex space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => setShowPhoneDialog(true)}
                  >
                    Verify
                  </button>
                  <button onClick={() => handleEdit("phone", userInfo.phone)}>
                    <PencilIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              {/* Password */}
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="text-gray-600">Password</p>
                  <p className="text-gray-800 font-medium">{userInfo.password}</p>
                </div>
                <button onClick={() => handleEdit("password", userInfo.password)}>
                  <PencilIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              {/* Email */}
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="text-gray-800 font-medium">{userInfo.email}</p>
                </div>
                <button onClick={() => handleEdit("email", userInfo.email)}>
                  <PencilIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              {/* Address */}
              <div className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="text-gray-600">Address</p>
                  <p className="text-gray-800 font-medium">{userInfo.address}</p>
                </div>
                <button onClick={() => handleEdit("address", userInfo.address)}>
                  <PencilIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
            {/* Delete Account Button */}
            <div className="mt-6">
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Delete Account
              </button>
            </div>
          </section>
        </main>

      {/* Modal Dialog for Editing Fields */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowModal(false)}
          ></div>
          {/* Modal Content */}
          <div className="bg-white rounded-lg shadow-lg p-6 z-50 w-96">
            <h3 className="text-xl font-semibold mb-4">
              Edit {editingField.charAt(0).toUpperCase() + editingField.slice(1)}
            </h3>
            <input
              type="text"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dialog for Phone Verification */}
      {showPhoneDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowPhoneDialog(false)}
          ></div>
          {/* Modal Content */}
          <div className="bg-white rounded-lg shadow-lg p-6 z-50 w-96">
            <h3 className="text-xl font-semibold mb-4">Verify Phone Number</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <button
                onClick={getVerificationCode}
                className="w-full bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
              >
                Send Verification Code
              </button>
              <div>
                <label className="block text-gray-600 mb-1">Verification Code</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <button
                onClick={handleVerifyPhone}
                className="w-full bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
              >
                Verify Phone
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccountPage;
