"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";
import { PlusCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import AddMenuItemModal from "@/app/components/AddMenuModal";

interface Location {
  _id: string;
  name: string;
  address: string;
}

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isAvailable: boolean;
}

export default function MenuItemsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAddMenuItem = async (menuItem: MenuItem) => {
    const token = localStorage.getItem("authToken");
    const res = await apiFetch("/api/auth/addMenuItem", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ...menuItem, locationId: selectedLocation?._id }),
    });
    console.log("MenuItem added", res);
    setMenuItems([...menuItems, menuItem]);
  };

  async function fetchLocations() {
    const token = localStorage.getItem("authToken");

    try {
      // Fetch locations with authentication
      const data: Location[] = await apiFetch("/api/auth/getRestaurantLocations", {
        headers: { "Authorization": `Bearer ${token}` },
        credentials: "include",
      });

      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  }

  async function fetchMenuItems(locationId: string) {

    const res = await apiFetch(`/api/auth/locations/${locationId}/menu-items`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });
    setMenuItems(res as MenuItem[]);
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold">Manage Menu Items</h2>
      <br />

      <div className="flex items-center justify-between mb-4">
        {/* Styled Locations Dropdown */}
        <div className="relative w-64">
          <select
            className="appearance-none bg-green-500 text-white text-sm px-4 py-2 w-full rounded-lg cursor-pointer focus:outline-none pr-10"
            onChange={(e) => {
              const location = locations.find((loc) => loc._id === e.target.value);
              if (location) {
                setSelectedLocation(location); // Set selected location
                fetchMenuItems(location._id); // Fetch menu items for the selected location
              } else {
                setSelectedLocation(null); // Reset if no valid location is selected
              }
            }}
          >
            <option value="">Select a location</option>
            {locations.map((location) => (
              <option key={location._id} value={location._id}>
                {location.name}
              </option>
            ))}
          </select>

          {/* Chevron Icon */}
          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
        </div>

        {/* Add Menu Item Button - Disabled when no location is selected */}
        <button
          className={`px-4 py-2 rounded flex items-center transition-colors ${selectedLocation
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-400 text-white opacity-50 cursor-not-allowed"
            }`}
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedLocation} // Button is disabled when no location is selected
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Menu Item
        </button>
      </div>

      {selectedLocation && (
        <div>
          <table className="min-w-full table-auto border-collapse shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item, i) => (
                <tr key={item._id + `${i}`} className="hover:bg-gray-100 transition-colors">
                  <td className="border-t px-4 py-3">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded" />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="border-t px-4 py-3">{item.name}</td>
                  <td className="border-t px-4 py-3">{item.description}</td>
                  <td className="border-t px-4 py-3">${item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddMenuItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddMenuItem} />
    </div>
  );
}
