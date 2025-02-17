"use client";

import Head from "next/head";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import { useEffect, useState } from "react";
import { deleteUser, getUserInfo, updateUserAttribute } from "@/app/lib/auth";

interface UserInfo {
  family_name: string;
  given_name: string;
  birthdate: string;
  phone_number: string;
  phone_number_verified: boolean;
  address: string;
  email: string;
  email_verified: boolean;
  username: string;
}

interface UserDetailProps {
  label: string;
  value: string;
  onEdit?: () => void;
  onVerify?: () => void;
}

const AccountPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState<keyof UserInfo | null>(null);
  const [fieldValue, setFieldValue] = useState("");

  // Delete Account state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");

    // Verification modal state for phone/email
    const [showVerifyDialog, setShowVerifyDialog] = useState(false);
    const [verifyField, setVerifyField] = useState<"email" | "phone_number" | null>(null);
    const [verifyValue, setVerifyValue] = useState("");
    const [verificationCode, setVerificationCode] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const data = await getUserInfo();

      if (data) {
        const mappedUser: UserInfo = {
          given_name: data.UserAttributes?.find(attr => attr.Name === "given_name")?.Value || "N/A",
          family_name: data.UserAttributes?.find(attr => attr.Name === "family_name")?.Value || "N/A",
          birthdate: data.UserAttributes?.find(attr => attr.Name === "birthdate")?.Value || "N/A",
          phone_number: data.UserAttributes?.find(attr => attr.Name === "phone_number")?.Value || "N/A",
          phone_number_verified: data.UserAttributes?.find(attr => attr.Name === "phone_number_verified")?.Value === "true",
          address: data.UserAttributes?.find(attr => attr.Name === "address")?.Value || "N/A",
          email: data.UserAttributes?.find(attr => attr.Name === "email")?.Value || "N/A",
          email_verified: data.UserAttributes?.find(attr => attr.Name === "email_verified")?.Value === "true",
          username: data.Username || "",
        };
        setUserInfo(mappedUser);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

    // Open verification dialog for email or phone
    const handleVerify = (field: "email" | "phone_number") => {
      setVerifyField(field);
      // Pre-fill the field with the current value from userInfo if available
      setVerifyValue(userInfo ? userInfo[field] : "");
      setShowVerifyDialog(true);
    };

  // Open edit modal
  const handleEdit = (field: keyof UserInfo) => {
    setEditingField(field);
    setFieldValue(userInfo ? userInfo[field] : "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editingField && userInfo) {
      const success = await updateUserAttribute(editingField, fieldValue);
      if (success) {
        setUserInfo({ ...userInfo, [editingField]: fieldValue });
        alert(`${editingField} updated successfully!`);
      } else {
        alert(`Failed to update ${editingField}. Please try again.`);
      }
    }
    setIsEditing(false);
  };

  // Delete Account Function
  const handleDeleteAccount = async () => {
    if (confirmText !== "I confirm" || !userInfo?.username) return;
    deleteUser()
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading user data...</p>;
  }

  if (!userInfo) {
    return <p className="text-center text-red-500">Failed to load user data.</p>;
  }

  return (
    <>
      <Head>
        <title>My Account - Restaurant App</title>
      </Head>

      <main className="flex-1 p-6 overflow-y-auto">
        <section className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl text-gray-800 font-semibold mb-6">My Account</h2>
          <div className="space-y-4">
            {/* User Details */}
            <UserDetail label="Family Name" value={userInfo.family_name} onEdit={() => handleEdit("family_name")} />
            <UserDetail label="Given Name" value={userInfo.given_name} onEdit={() => handleEdit("given_name")} />
            <UserDetail label="Date of Birth" value={userInfo.birthdate} onEdit={() => handleEdit("birthdate")} />

            {/* Phone with Verified/Unverified Badge */}
            <UserDetail
              label="Phone"
              value={`${userInfo.phone_number} (${userInfo.phone_number_verified ? "Verified" : "Unverified"})`}
              onEdit={() => handleEdit("phone_number")}
              onVerify={!userInfo.phone_number_verified ? () => handleVerify("phone_number") : undefined}
            />

            {/* Email with Verified/Unverified Badge */}
            <UserDetail
              label="Email"
              value={`${userInfo.email} (${userInfo.email_verified ? "Verified" : "Unverified"})`}
              onEdit={() => handleEdit("email")}
            />

            <UserDetail label="Address" value={userInfo.address} onEdit={() => handleEdit("address")} />
          </div>

          {/* Delete Account Button */}
          <div className="mt-6">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete Account
            </button>
          </div>
        </section>
      </main>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Edit Field</h3>
            <input
              type="text"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setIsEditing(false)}>Cancel</button>
              <button className="px-4 py-2 bg-green-500 text-white rounded" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      )}

       {/* Verify Modal */}
       {showVerifyDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              Verify {verifyField === "phone_number" ? "Phone Number" : "Email"}
            </h3>
            <input
              type="text"
              placeholder={`Enter new ${verifyField}`}
              value={verifyValue}
              onChange={(e) => setVerifyValue(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <button onClick={()=>{}} className="w-full bg-blue-500 text-white px-3 py-2 rounded">
              Send Code
            </button>
            <input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mt-4"
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowVerifyDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={()=>{}}              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4 text-red-600">Confirm Account Deletion</h3>
            <p className="text-gray-700 mb-4">Type <b>"I confirm"</b> to delete your account.</p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowDeleteDialog(false)}>Cancel</button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleDeleteAccount}
                disabled={confirmText !== "I confirm"}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


const UserDetail: React.FC<UserDetailProps> = ({ label, value, onEdit, onVerify }) => {
  // Check if "unverified" exists anywhere in the value (case-insensitive)
  const isUnverified = /unverified/i.test(value);

  return (
    <div className="flex justify-between items-center border-b pb-2">
      <div>
        <p className="text-gray-600">{label}</p>
        <p className="text-gray-800 font-medium">{value}</p>
      </div>
      {isUnverified && (
        <button onClick={onVerify} className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Verify
        </button>
      )}
      <button onClick={onEdit}>
        <PencilIcon className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  );
};

export default AccountPage;
