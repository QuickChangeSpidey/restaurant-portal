"use client";

import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { apiFetch } from "../lib/api";
import { MenuItem } from "../dashboard/menu-items/page";

interface AddMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (menuItem: MenuItem) => void;
  selectedLocationId?: string;
}

export default function AddMenuItemModal({
  isOpen,
  onClose,
  onAdd,
  selectedLocationId,
}: AddMenuItemModalProps) {
  // Local form state for new menu item fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState("");

  // Helper: Reset form fields
  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice(0);
    setImage("");
  };

  // Submit handler to call the API and notify the parent
  const handleSubmit = async () => {
    const token = localStorage.getItem("authToken");
    const newMenuItem: Partial<MenuItem> = {
      name,
      description,
      price,
      image,
      // Pass locationId if provided
      locationId: selectedLocationId || "",
    };

    try {
      const addedItem = await apiFetch("/api/auth/addMenuItem", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMenuItem),
      });
      // Notify parent with the added item (assumed to be returned by the API)
      onAdd(addedItem);
    } catch (error) {
      console.error("Failed to add menu item", error);
    }
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      {/* Dialog Panel */}
      <div className="fixed inset-0 flex text-black items-center justify-center p-4">
        <Dialog.Panel className="bg-white w-full max-w-md rounded shadow-lg p-6">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Add Custom Menu Item
          </Dialog.Title>
          {/* Name */}
          <label className="block mb-2">
            Name:
            <input
              type="text"
              className="block w-full mt-1 p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          {/* Description */}
          <label className="block mb-2">
            Description:
            <textarea
              className="block w-full mt-1 p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          {/* Price */}
          <label className="block mb-2">
            Price:
            <input
              type="number"
              className="block w-full mt-1 p-2 border rounded"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </label>
          {/* Image URL (optional) */}
          <label className="block mb-2">
            Image (optional):
            <input
              type="text"
              placeholder="Image URL"
              className="block w-full mt-1 p-2 border rounded"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </label>
          {/* Action Buttons */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Add Item
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
