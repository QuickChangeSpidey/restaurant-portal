"use client";

import { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { apiFetch } from "@/app/lib/api";
import { PencilIcon, TrashIcon, PlusCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

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
  const [newMenuItem, setNewMenuItem] = useState({ name: "", description: "", price: 0, image: null });

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    const token = localStorage.getItem("authToken");

    try {
      // `apiFetch` already processes errors, so we assume a successful response here
      const data: Location[] = await apiFetch("/api/auth/getRestaurantLocations", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      // Process the data
      setLocations(data.map((loc: any) => ({
        ...loc,
        hours: loc.hours || "Not Available",
      })));
      setSelectedLocation(data[0]);
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  }

  async function fetchMenuItems(locationId: string) {
    // Mock Data
    const mockMenuItems: MenuItem[] = [
      {
        _id: "1",
        name: "Margherita Pizza",
        description: "Classic pizza with tomato, mozzarella, and basil",
        price: 12.99,
        image: "https://via.placeholder.com/50", // Placeholder image
        isAvailable: true,
      },
      {
        _id: "2",
        name: "Caesar Salad",
        description: "Fresh romaine lettuce, croutons, and Caesar dressing",
        price: 8.99,
        image: "https://via.placeholder.com/50",
        isAvailable: true,
      },
      {
        _id: "3",
        name: "Spaghetti Carbonara",
        description: "Pasta with creamy egg sauce, pancetta, and cheese",
        price: 14.99,
        image: "https://via.placeholder.com/50",
        isAvailable: true,
      },
    ];

    setMenuItems(mockMenuItems);
  }


  return (
    <div className="p-8">

      {/* Menu Items Table */}
      {selectedLocation && (
        <div>
          <h2 className="text-2xl font-semibold">Manage Menu Items</h2>
          <br />
          <div className="flex items-center justify-between mb-4">
            {/* Styled Locations Dropdown */}
            <div className="relative w-64 mb-4">
              <select
                className="appearance-none bg-green-500 text-white text-sm px-4 py-2 w-full rounded-lg cursor-pointer focus:outline-none pr-10"
                onChange={(e) => {
                  const location = locations.find((loc) => loc._id === e.target.value);
                  if (location) {
                    setSelectedLocation(location);
                    fetchMenuItems(location._id);
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

            <button
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Add Menu Item
            </button>
          </div>

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
              {menuItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-100 transition-colors">
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
    </div>
  );
}
