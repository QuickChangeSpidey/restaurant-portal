"use client";

import Link from "next/link";
import {
  MapPinIcon,
  UserGroupIcon,
  ChartBarIcon,
  TicketIcon,
  ClipboardDocumentListIcon,
  VideoCameraIcon,
  CreditCardIcon,
  LifebuoyIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { LoadScript } from "@react-google-maps/api";
import packageJSON from "../../../package.json";
import { useEffect, useState } from "react";
import { UserInfo } from "./accounts/page";
import { getUserInfo } from "../lib/auth";
import { EditIcon } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const googleMapsApiKey = "AIzaSyBxeae0ftXUhPZ8bZWE1-xgaWEkJFKGjek";
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserInfo();

      // if (data?.UserAttributes?.find(attr => attr.Name === "sub")?.Value) {
      //   const result = await fetch(`/api/auth/${data?.UserAttributes?.find(attr => attr.Name === "sub")?.Value}/accept`, {
      //     method: "PUT",
      //     body: JSON.stringify({ isPolicyAccepted: localStorage.getItem("policyAccepted") === "true" }),
      //     headers: {
      //       "Content-Type": "application/json", 
      //       "Authorization": `Bearer ${localStorage.getItem("authToken")}`
      //     },
      //   });
      //   if (!result.ok) {
      //     const errorData: { message?: string } = await result.json();
      //     console.error("Policy acceptance error:", errorData.message
      //       ? errorData.message
      //       : "An error occurred while accepting the policy"); 
      //       localStorage.setItem("policyAccepted", "false");
      //     } else {
      //       console.log("Policy acceptance successful");
      //       localStorage.setItem("policyAccepted", "true");
      //     }
      // }

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
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    const token: any = localStorage.getItem("authToken");

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
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData: { message?: string } = await response.json();
        throw new Error(errorData.message || "Logout failed");
      }

      localStorage.removeItem("authToken");
      alert("Logout successful. Redirecting to login...");
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      alert((error as Error).message);
      localStorage.removeItem("authToken");
      router.push("/auth");
    }
  };

  const menuItems = [
    { name: "Locations", icon: <MapPinIcon className="w-7 h-7 mr-3" />, href: "/dashboard/locations" },
    { name: "Customers", icon: <UserGroupIcon className="w-7 h-7 mr-3" />, href: "/dashboard/customers" },
    { name: "Coupons", icon: <TicketIcon className="w-7 h-7 mr-3" />, href: "/dashboard/coupons" },
    { name: "Menu", icon: <ClipboardDocumentListIcon className="w-7 h-7 mr-3" />, href: "/dashboard/menu-items" },
    { name: "Ads", icon: <VideoCameraIcon className="w-7 h-7 mr-3" />, href: "/dashboard/ads", disabled: true },
    { name: "Payment", icon: <CreditCardIcon className="w-7 h-7 mr-3" />, href: "/dashboard/payment", disabled: true },
    { name: "Analytics", icon: <ChartBarIcon className="w-7 h-7 mr-3" />, href: "/dashboard/analytics", disabled: true },
    { name: "FAQ", icon: <BookOpenIcon className="w-7 h-7 mr-3" />, href: "/dashboard/faq" },
    { name: "Support", icon: <LifebuoyIcon className="w-7 h-7 mr-3" />, href: "/dashboard/support" },
    { name: "Account", icon: <UserIcon className="w-7 h-7 mr-3" />, href: "/dashboard/accounts" },
    { name: "Logout", icon: <ArrowLeftOnRectangleIcon className="w-7 h-7 mr-3" />, action: "logout" },
  ];

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-green-500 text-white fixed top-0 left-0 h-full p-5">
          <h2 className="text-3xl font-bold mb-1">BOGO NINJA</h2>
          <p className="text-s mb-5">v{packageJSON.version}</p>
          <ul>
            {menuItems.map(({ name, icon, href, action, disabled }) => (
              <li key={name} className={`py-3 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                {action === "logout" ? (
                  <div className="flex items-center px-5 hover:bg-green-600 rounded cursor-pointer text-xl" onClick={handleLogout}>
                    {icon} {name}
                  </div>
                ) : href ? (
                  <Link
                    href={disabled ? "#" : href}
                    onClick={(e) => disabled && e.preventDefault()}
                    className={`flex items-center px-5 rounded text-xl ${disabled ? "bg-green-500 text-gray-700 cursor-not-allowed" : "hover:bg-green-600 cursor-pointer"
                      }`}
                  >
                    {icon} {name}
                  </Link>

                ) : (
                  <div className="flex items-center px-5 rounded text-xl pointer-events-none">
                    {icon} {name}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 ml-64">
          {/* Top Header */}
          <div className="bg-green-500 text-white p-2 flex justify-between items-center fixed top-0 left-64 right-0 z-20">
            <div className="ml-auto text-xl">Hello, {userInfo?.given_name} {userInfo?.family_name}!</div>
            <button onClick={() => { router.push("/dashboard/accounts") }} className="bg-green-500 hover:bg-green-600 rounded p-2">
              <EditIcon className="text-white-1000" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-auto bg-white text-black p-10 mt-15">
            {children}
          </div>

          {/* Bottom Footer */}
          <div className="bg-green-500 text-white p-4 fixed bottom-0 left-64 right-0 z-10">
            <div className="flex justify-center space-x-5">
              <Link href="/dashboard/policy" className="hover:text-gray-200">Privacy Policy</Link>
              <Link href="/dashboard/support" className="hover:text-gray-200">Contact Us</Link>
              <Link href="https://docs.google.com/forms/d/e/1FAIpQLSc7oCGSIRYa4WzaGirYakgkVz-icu0J4lkQ74MsjH_93kS-Ww/viewform" className="hover:text-gray-200">Feedback</Link>
              <span>&copy; 2025 Bogo Ninja. All Rights Reserved.</span>
              <span>
                {new Intl.DateTimeFormat("en-US", {
                  weekday: "long",  // "Monday"
                  year: "numeric",  // "2025"
                  month: "long",    // "March"
                  day: "numeric",   // "9"
                  hour: "2-digit",  // "10" (12-hour format)
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: true,     // AM/PM format
                }).format(new Date())}
              </span>
            </div>
          </div>
        </div>
      </div>
    </LoadScript>
  );
}