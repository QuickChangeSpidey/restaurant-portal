"use client";

import Head from "next/head";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import { useEffect, useState } from "react";
import { deleteUser, getUserInfo } from "@/app/lib/auth";

interface UserInfo {
  firstName: string;
  lastName: string;
  dob: string;
  phone: string;
  phoneVerified: boolean;
  address: string;
  email: string;
  emailVerified: boolean;
  userType: string;
  username: string;
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

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const data = await getUserInfo();

      if (data) {
        const mappedUser: UserInfo = {
          firstName: data.UserAttributes?.find(attr => attr.Name === "given_name")?.Value || "N/A",
          lastName: data.UserAttributes?.find(attr => attr.Name === "family_name")?.Value || "N/A",
          dob: data.UserAttributes?.find(attr => attr.Name === "birthdate")?.Value || "N/A",
          phone: data.UserAttributes?.find(attr => attr.Name === "phone_number")?.Value || "N/A",
          phoneVerified: data.UserAttributes?.find(attr => attr.Name === "phone_number_verified")?.Value === "true",
          address: data.UserAttributes?.find(attr => attr.Name === "address")?.Value || "N/A",
          email: data.UserAttributes?.find(attr => attr.Name === "email")?.Value || "N/A",
          emailVerified: data.UserAttributes?.find(attr => attr.Name === "email_verified")?.Value === "true",
          userType: data.UserAttributes?.find(attr => attr.Name === "custom:user_type")?.Value || "N/A",
          username: data.Username || "",
        };
        setUserInfo(mappedUser);
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  // Open edit modal
  const handleEdit = (field: keyof UserInfo) => {
    setEditingField(field);
    setFieldValue(userInfo ? userInfo[field] : "");
    setIsEditing(true);
  };

  // Save edited value
  const handleSave = () => {
    if (editingField && userInfo) {
      setUserInfo({ ...userInfo, [editingField]: fieldValue });
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
            <UserDetail label="First Name" value={userInfo.firstName} onEdit={() => handleEdit("firstName")} />
            <UserDetail label="Last Name" value={userInfo.lastName} onEdit={() => handleEdit("lastName")} />
            <UserDetail label="Date of Birth" value={userInfo.dob} onEdit={() => handleEdit("dob")} />

            {/* Phone with Verified/Unverified Badge */}
            <UserDetail
              label="Phone"
              value={`${userInfo.phone} (${userInfo.phoneVerified ? "Verified" : "Unverified"})`}
              onEdit={() => handleEdit("phone")}
            />

            {/* Email with Verified/Unverified Badge */}
            <UserDetail
              label="Email"
              value={`${userInfo.email} (${userInfo.emailVerified ? "Verified" : "Unverified"})`}
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
            <h3 className="text-xl font-semibold mb-4">Edit {editingField}</h3>
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

const UserDetail: React.FC<{ label: string; value: string; onEdit: () => void }> = ({ label, value, onEdit }) => (
  <div className="flex justify-between items-center border-b pb-2">
    <div>
      <p className="text-gray-600">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
    </div>
    <button onClick={onEdit}>
      <PencilIcon className="h-5 w-5 text-gray-500" />
    </button>
  </div>
);

export default AccountPage;
