"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/app/lib/api";
import {
  PlusCircleIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
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
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    const token = localStorage.getItem("authToken");
    try {
      const data: Location[] = await apiFetch(
        "/api/auth/getRestaurantLocations",
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      setLocations(data);
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  }

  async function fetchMenuItems(locationId: string) {
    const res = await apiFetch(`/api/auth/locations/${locationId}/menu-items`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        "Content-Type": "application/json",
      },
    });
    setMenuItems(res as MenuItem[]);
  }

  const handleAddMenuItem = async (menuItem: MenuItem) => {
    const token = localStorage.getItem("authToken");
    const res = await apiFetch("/api/auth/addMenuItem", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...menuItem, locationId: selectedLocation?._id }),
    });
    console.log("MenuItem added", res);
    // Update local state if needed
    setMenuItems((prev) => [...prev, menuItem]);
  };

  const handleEditMenuItem = async (item: MenuItem) => {
    // **TODO**: Add your logic to open an edit modal or inline form.
    // You could use the same modal with some additional props for editing.
    console.log("Edit clicked for:", item._id);
    // Example:
    // setEditItem(item);
    // setIsEditModalOpen(true);
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    // **TODO**: Replace with your actual endpoint for deleting menu items.
    try {
      const token = localStorage.getItem("authToken");
      await apiFetch(`/api/auth/menuItems/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Remove the item from local state
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

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
              const location = locations.find(
                (loc) => loc._id === e.target.value
              );
              if (location) {
                setSelectedLocation(location);
                fetchMenuItems(location._id);
              } else {
                setSelectedLocation(null);
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
          <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
        </div>

        {/* Add Menu Item Button - Disabled when no location is selected */}
        <button
          className={`px-4 py-2 rounded flex items-center transition-colors ${
            selectedLocation
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-400 text-white opacity-50 cursor-not-allowed"
          }`}
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedLocation}
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
                {/* Actions Column */}
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((item, i) => (
                <tr
                  key={item._id + `${i}`}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="border-t px-4 py-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="border-t px-4 py-3">{item.name}</td>
                  <td className="border-t px-4 py-3">{item.description}</td>
                  <td className="border-t px-4 py-3">
                    ${item.price.toFixed(2)}
                  </td>
                  {/* Actions */}
                  <td className="border-t px-4 py-3">
                    <div className="flex space-x-4">
                      <PencilSquareIcon
                        className="h-5 w-5 text-blue-500 cursor-pointer"
                        onClick={() => handleEditMenuItem(item)}
                      />
                      <TrashIcon
                        className="h-5 w-5 text-red-500 cursor-pointer"
                        onClick={() => handleDeleteMenuItem(item._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AddMenuItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMenuItem}
      />
    </div>
  );
}
