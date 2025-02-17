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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

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

  const menuItems = [
    { name: "Locations", icon: <MapPinIcon className="w-7 h-7 mr-3" />, href: "/dashboard/locations" },
    { name: "Customers", icon: <UserGroupIcon className="w-7 h-7 mr-3" />, href: "/dashboard/customers" },
    // { name: "Analytics", icon: <ChartBarIcon className="w-7 h-7 mr-3" />, href: "/dashboard/analytics" },
    { name: "Coupons", icon: <TicketIcon className="w-7 h-7 mr-3" />, href: "/dashboard/coupons" },
    { name: "Menu", icon: <ClipboardDocumentListIcon className="w-7 h-7 mr-3" />, href: "/dashboard/menu-items" },
    // { name: "Ads", icon: <VideoCameraIcon className="w-7 h-7 mr-3" />, href: "/dashboard/ads" },
    // { name: "Payment", icon: <CreditCardIcon className="w-7 h-7 mr-3" />, href: "/dashboard/payment" },
    { name: "FAQ", icon: <BookOpenIcon className="w-7 h-7 mr-3" />, href: "/dashboard/faq" },
    { name: "Support", icon: <LifebuoyIcon className="w-7 h-7 mr-3" />, href: "/dashboard/support" },
    { name: "Account", icon: <UserIcon className="w-7 h-7 mr-3" />, href: "/dashboard/accounts" },
    { name: "Logout", icon: <ArrowLeftOnRectangleIcon className="w-7 h-7 mr-3" />, action: "logout" },
  ];

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar */}
      <div className="w-64 bg-green-500 text-white p-5">
        <h2 className="text-3xl font-bold mb-5">BOGO NINJA</h2>
        <ul>
          {menuItems.map(({ name, icon, href, action }) =>
            action === "logout" ? (
              <li
                key={name}
                className="flex items-center py-3 px-5 hover:bg-green-600 rounded cursor-pointer text-xl"
                onClick={handleLogout}
              >
                {icon} {name}
              </li>
            ) : (
              <li key={name} className="py-3">
                <Link href={href}>
                  <div className="flex items-center px-5 hover:bg-green-600 rounded cursor-pointer text-xl">
                    {icon} {name}
                  </div>
                </Link>
              </li>
            )
          )}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-10">{children}</div>
    </div>
  );
}
