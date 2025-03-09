"use client";

import { useState, useEffect } from "react";
import { apiFetch, apiFileUpload } from "@/app/lib/api";
import {
  PlusCircleIcon,
  ChevronDownIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import AddMenuItemModal from "@/app/components/AddMenuModal";
import EditMenuItemModal from "@/app/components/EditMenuItemModal";
import DeleteMenuItemModal from "@/app/components/DeleteMenuItemModal";
import Modal from "@/app/components/Modal";
import { Plus } from "lucide-react";
import { image } from "framer-motion/client";

export interface Location {
  _id: string;
  name: string;
  address: string;
}

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isAvailable: boolean;
  locationId: string;
}

export default function MenuItemsPage() {
  // Location data
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  // Menu items for the selected location
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Add Menu Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit Menu Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<MenuItem | null>(null);

  // Delete Menu Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedFile(null);
    setItemToEdit(null);
    setPreviewImage(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

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

  // ----- ADD -----
  const handleAddMenuItem = async (menuItem: { name: string; description: string; price: number; image: string; }, selectedFile: File | null) => {
    const token = localStorage.getItem("authToken");
    try {
      // Example endpoint for adding an item
      const addedItem: any = await apiFetch("/api/auth/addMenuItem", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...menuItem, locationId: selectedLocation?._id }),
      });
      if (selectedFile) {
        handleUpload(addedItem, selectedFile);
      }
      setMenuItems((prev) => [...prev, addedItem as MenuItem]);
    } catch (error) {
      console.error("Error adding menu item", error);
    }
  };

  const handleEditImageUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await apiFileUpload(`/api/auth/menu-item/${itemToEdit?._id}/upload`, {
        method: "POST",
        body: formData,
      }, selectedFile);

      if (!response) {
        throw new Error(`HTTP error! Status: ${response}`);
      }
      closeUploadModal();
      if (selectedLocation?._id) {
        fetchMenuItems(selectedLocation._id);
      }
    } catch (error) {
      console.error("Error uploading image", error);
    }
  }; 

  const handleUpload = async (menuItem: MenuItem, selectedFile: File) => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await apiFileUpload(`/api/auth/menu-item/${menuItem._id}/upload`, {
        method: "POST",
        body: formData,
      }, selectedFile);

      if (!response) {
        throw new Error(`HTTP error! Status: ${response}`);
      }
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  // ----- EDIT -----
  const handleEditMenuItem = (item: MenuItem) => {
    setItemToEdit(item);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedMenuItem = async (editedItem: MenuItem) => {
    if (!editedItem._id) return;

    const token = localStorage.getItem("authToken");
    try {
      // Example endpoint for updating an item
      const updatedItem = await apiFetch(
        `/api/auth/menuItems/${editedItem._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedItem),
        }
      );

      // Update local list
      setMenuItems((prev) =>
        prev.map((item) => (item._id === editedItem._id ? updatedItem as MenuItem : item))
      );
    } catch (error) {
      console.error("Error updating menu item:", error);
    }
  };

  // ----- DELETE -----
  // Step 1: Open the confirmation modal and store the item to delete
  const handleDeleteMenuItemClick = (item: MenuItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Step 2: If user confirms, delete the item
  const handleConfirmDeleteMenuItem = async () => {
    if (!itemToDelete) return;

    const token = localStorage.getItem("authToken");
    try {
      // Endpoint: /api/auth/deleteItem/:id
      await apiFetch(`/api/auth/menuItems/${itemToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Remove from local state
      setMenuItems((prev) =>
        prev.filter((item) => item._id !== itemToDelete._id)
      );

      // Close the modal
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        {/* Locations Dropdown */}
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

        {/* Add Menu Item Button */}
        <button
          className={`px-4 py-2 rounded flex items-center transition-colors ${selectedLocation
            ? "bg-green-500 text-white hover:bg-green-600"
            : "bg-gray-400 text-white opacity-50 cursor-not-allowed"
            }`}
          onClick={() => setIsAddModalOpen(true)}
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
                           <div className="relative">
                           <img
                             src={item.image}
                             alt={item.name}
                             className="h-12 w-12 object-cover rounded"
                             onClick={() => {
                               setUploadModalOpen(true);
                               setItemToEdit(item);
                              }}
                           />
                           <Plus
                             className="absolute top-0 center-0 bg-white p-1 rounded-full shadow-md cursor-pointer"
                             size={18}
                             onClick={() => {
                               setUploadModalOpen(true);
                                setItemToEdit(item);
                             }}
                           />
                         </div>
                    ) : (
                      <button
                        className="text-blue-600 hover:text-red-800"
                        onClick={() => {
                          setUploadModalOpen(true);
                          setItemToEdit(item);
                        }}
                      >
                        <PlusCircleIcon className="h-5 w-5" />
                      </button>
                    )}

                  </td>
                  <td className="border-t px-4 py-3">{item.name}</td>
                  <td className="border-t px-4 py-3">{item.description}</td>
                  <td className="border-t px-4 py-3">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="border-t px-4 py-3">
                    <div className="flex space-x-4">
                      <PencilSquareIcon
                        className="h-5 w-5 text-blue-500 cursor-pointer"
                        onClick={() => handleEditMenuItem(item)}
                      />
                      <TrashIcon
                        className="h-5 w-5 text-red-500 cursor-pointer"
                        onClick={() => handleDeleteMenuItemClick(item)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Menu Modal */}
      <AddMenuItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddMenuItem}
      />

      {/* Edit Menu Modal */}
      <EditMenuItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={itemToEdit}
        onSave={(editedItem) => {
          handleSaveEditedMenuItem(editedItem as MenuItem);
          setIsEditModalOpen(false);
        }}
      />

      {/* ---------- Upload Image Modal ---------- */}
      {uploadModalOpen && (
        <Modal onClose={closeUploadModal}>
          <div className="p-4">
            <h2 className="text-black font-bold mb-4">Upload Image</h2>
            <input
              type="file"
              onChange={handleFileChange}
              className="text-black mb-4"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="h-24 w-24 object-cover rounded mb-4"
              />
            )}
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleEditImageUpload}
              disabled={!selectedFile}
            >
              Upload
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Menu Modal */}
      <DeleteMenuItemModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        item={itemToDelete}
        onConfirmDelete={handleConfirmDeleteMenuItem}
      />
    </div>
  );
}
