"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  ChartBarIcon as BarChartIcon,
  TicketIcon,
  ClipboardDocumentListIcon as ClipboardListIcon,
  MapPinIcon,
  PlayIcon as VideoIcon,
  CreditCardIcon,
  LifebuoyIcon as HeadsetIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon, // Logout icon
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  const router = useRouter();
  const [username, setUsername] = useState("User"); // Replace with real user data
  const [selectedLocation, setSelectedLocation] = useState("Location 1");
  const locations = ["Location 1", "Location 2", "Location 3"]; // Replace with real locations
  const [emailVerified, setEmailVerified] = useState(false); // Replace with real verification status
  const [phoneVerified, setPhoneVerified] = useState(false); // Replace with real verification status
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    // Redirect to auth if not authenticated (Replace with real auth check)
    if (!localStorage.getItem("authToken")) {
      router.push("/auth");
    }
  }, []);

  const handleLogout = async () => {
    const token:any = localStorage.getItem("authToken");

    if (!token) {
      alert("No authentication token found. Redirecting to login...");
      router.push("/auth");
      return;
    }

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Attach token
        },
      });

      if (!response.ok) {
        const errorData: { message?: string } = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      // Remove token from localStorage
      localStorage.removeItem("authToken");

      alert("Logout successful. Redirecting to login...");
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      alert((error as Error).message);

      // Ensure the token is cleared even if the API fails
      localStorage.removeItem("authToken");
      router.push("/auth");
    }
  };

  const handleVerifyEmail = () => {
    // Implement email verification logic
    setEmailVerified(true);
    setShowEmailDialog(false);
  };

  const handleVerifyPhone = () => {
    // Implement phone verification logic
    setPhoneVerified(true);
    setShowPhoneDialog(false);
  };

  const menuItems = [
    { name: "Home", icon: <HomeIcon className="w-5 h-5 mr-2" /> },
    { name: "Analytics", icon: <BarChartIcon className="w-5 h-5 mr-2" /> },
    { name: "Coupons", icon: <TicketIcon className="w-5 h-5 mr-2" /> },
    { name: "Menu", icon: <ClipboardListIcon className="w-5 h-5 mr-2" /> },
    { name: "Locations", icon: <MapPinIcon className="w-5 h-5 mr-2" /> },
    { name: "Ads", icon: <VideoIcon className="w-5 h-5 mr-2" /> },
    { name: "Payment", icon: <CreditCardIcon className="w-5 h-5 mr-2" /> },
    { name: "Support", icon: <HeadsetIcon className="w-5 h-5 mr-2" /> },
    { name: "Account", icon: <UserIcon className="w-5 h-5 mr-2" /> },
    { name: "Logout", icon: <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />, action: "logout" },
  ];

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar Menu */}
      <div className="w-64 bg-green-500 text-white p-5">
        <h2 className="text-2xl font-bold mb-5">BOGO NINJA</h2>
        <ul>
          {menuItems.map(({ name, icon, action }) => (
            <li
              key={name}
              className="flex items-center py-2 px-4 hover:bg-green-600 rounded cursor-pointer"
              onClick={() => {
                if (action === "logout") {
                  handleLogout();
                }
              }}
            >
              {icon} {name}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        {/* Top Bar */}
        <div className="flex flex-col space-y-3">
          {/* Greeting */}
          {/* Location Selector & Date/Time */}
          <div className="flex justify-between items-center w-full bg-green-500 text-white px-4 py-3 rounded-lg shadow-md">
            <h1 className="text-4xl font-bold">Hello, {username}</h1>
            <div>
              <p className="text-sm">{new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })}</p>
              <p className="text-sm">{new Date().toLocaleDateString("en-US", { weekday: "long" })}, {new Date().toLocaleTimeString("en-US", { hour12: false })}</p>
            </div>
            <select
              className="p-2 bg-white text-black border rounded"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Confirmation Alerts */}
          <div className="space-y-2 w-1/3">
            {!emailVerified && (
              <div className="flex items-center justify-start bg-green-500 text-white px-4 py-3 rounded-lg shadow-md cursor-pointer" onClick={() => setShowEmailDialog(true)}>
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M4.93 19.07a10 10 0 1114.14 0M12 3v.01"></path>
                </svg>
                Confirm your email
              </div>
            )}
            {!phoneVerified && (
              <div className="flex items-center justify-start bg-green-500 text-white px-4 py-3 rounded-lg shadow-md cursor-pointer" onClick={() => setShowPhoneDialog(true)}>
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M4.93 19.07a10 10 0 1114.14 0M12 3v.01"></path>
                </svg>
                Confirm your phone
              </div>
            )}
          </div>
        </div>
        {/* Email Verification Dialog */}
        {showEmailDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-2">Verify Email</h2>
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-2 mb-2 border rounded"
              />
              <button className="w-full p-2 bg-green-500 text-white rounded" onClick={handleVerifyEmail}>
                Verify
              </button>
            </div>
          </div>
        )}

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
              <button className="w-full p-2 bg-green-500 text-white rounded" onClick={handleVerifyPhone}>
                Verify
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
