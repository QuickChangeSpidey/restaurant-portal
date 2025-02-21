"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isAvailable: boolean;
}

interface EditMenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
  item: MenuItem | null;
}

export default function EditMenuItemModal({
  isOpen,
  onClose,
  onSave,
  item,
}: EditMenuItemModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  /**
   * Whenever `item` changes, initialize local form states
   */
  useEffect(() => {
    if (item) {
      setName(item.name || "");
      setDescription(item.description || "");
      setPrice(item.price || 0);
      setImage(item.image || "");
      setIsAvailable(item.isAvailable ?? true);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!item) return; // If there's no item, do nothing

    const updatedItem = {
      ...item,
      name,
      description,
      price: Number(price),
      image,
      isAvailable,
    };

    onSave(updatedItem);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="translate-y-4 opacity-0"
              enterTo="translate-y-0 opacity-100"
              leave="ease-in duration-200"
              leaveFrom="translate-y-0 opacity-100"
              leaveTo="translate-y-4 opacity-0"
            >
              <Dialog.Panel className="mx-auto w-full max-w-md rounded bg-white p-6">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
                  Edit Menu Item
                </Dialog.Title>
                <div className="mt-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="mt-1 block w-full rounded text-black border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        className="mt-1 block w-full rounded text-black border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Price
                      </label>
                      <input
                        id="price"
                        type="number"
                        className="mt-1 block w-full rounded text-black border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    {/* <div>
                      <label
                        htmlFor="image"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Image URL
                      </label>
                      <input
                        id="image"
                        type="text"
                        className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 text-sm"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                      />
                    </div> */}

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isAvailable"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                      />
                      <label
                        htmlFor="isAvailable"
                        className="text-sm font-medium text-gray-700"
                      >
                        Is Available?
                      </label>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        className="mr-2 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
