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

  useEffect(() => {
    // Redirect to auth if not authenticated (Replace with real auth check)
    if (!localStorage.getItem("authToken")) {
      router.push("/auth");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove auth token
    router.push("/auth"); // Redirect to login page
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
        <h2 className="text-2xl font-bold mb-5">Dashboard</h2>
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
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-4xl font-bold">Hello, {username}</h1>
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
      </div>
    </div>
  );
}