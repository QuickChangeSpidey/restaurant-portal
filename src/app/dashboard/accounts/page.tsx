"use client"

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
  };

  // Modal state management
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState<keyof UserInfo | "">("");
  const [fieldValue, setFieldValue] = useState("");

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

  return (
    <>
      <Head>
        <title>My Account - Restaurant App</title>
      </Head>
      <div className="flex min-h-screen">
        {/* Main Content Area */}
        <main className="flex-1 bg-white p-6 relative overflow-y-auto">
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
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit("phone", userInfo.phone)}>
                    <PencilIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                    Verify
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
      </div>

      {/* Modal Dialog for Editing Fields */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
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
    </>
  );
};

export default AccountPage;
