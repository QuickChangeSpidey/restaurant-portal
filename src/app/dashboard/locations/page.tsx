"use client";

import { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { GoogleMap, Autocomplete, Marker } from "@react-google-maps/api";
import HoursOfOperation from "@/app/components/HoursOfOperation";
import {
  PencilIcon,
  TrashIcon,
  ClockIcon,
  QrCodeIcon,
  UserPlusIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { QRCodeCanvas } from "qrcode.react";
import { apiFetch, apiFileUpload } from "@/app/lib/api";

interface Location {
  _id: string;
  name: string;
  address: string;
  geolocation: {
    type: string;
    coordinates: [number, number];
  };
  hours: string;
  logo: string;
  genre: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);

  // Create Location Modal (Stepper)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Edit Location Modal (Stepper)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editStep, setEditStep] = useState(1);

  // View Hours Modal
  const [viewHoursModalOpen, setViewHoursModalOpen] = useState(false);
  const [selectedLocationForHours, setSelectedLocationForHours] = useState<{
    name: string;
    hours: string;
  } | null>(null);

  // Delete Confirmation
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);
  const [locationToDelete, setLocationToDelete] = useState("");

  // QR Modal
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

  // Create location form fields
  const [name, setName] = useState("");
  const [genre, setGenre] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [geo, setGeo] = useState({ lat: 0, lng: 0 });
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  // Edit location form fields
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editGenre, setEditGenre] = useState("");
  const [editHours, setEditHours] = useState("");
  const [editGeo, setEditGeo] = useState({ lat: 0, lng: 0 });
  const [editAutocomplete, setEditAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  );

  // Image Upload Modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // ----------- IMAGE UPLOAD LOGIC -----------
  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setSelectedFile(null);
    setSelectedLocationId(null);
    setPreviewImage(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedLocationId) return;

    const formData = new FormData();
    formData.append("image", selectedFile);  // Ensure the key 'image' matches the server

    try {
      const response = await apiFileUpload(`/api/auth/location/${selectedLocationId}/upload`, {
        method: "POST",
        body: formData,
      }, selectedFile);

      if (!response) {
        throw new Error(`HTTP error! Status: ${response}`);
      }

      // After successful upload
      fetchLocations();
      closeUploadModal();
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };



  // ----------- HOURS SELECTOR CHANGE -----------
  const handleHoursChange = (hours: string) => {
    setHours(hours);
  };

  const handleEditHoursChange = (hours: string) => {
    setEditHours(hours);
  };

  // ----------- QR CODE LOGIC -----------
  const handleQrCodeClick = (locId: string): void => {
    setQrCodeData(locId); // Pass location ID to the QR code generation
    setQrModalOpen(true);
  };

  const closeQrModal = () => {
    setQrModalOpen(false);
    setQrCodeData(null);
  };

  // ----------- FETCH LOCATIONS -----------
  async function fetchLocations() {
    const token = localStorage.getItem("authToken");

    try {
      const data: Location[] = await apiFetch("/api/auth/getRestaurantLocations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      setLocations(
        data.map((loc: any) => ({
          ...loc,
          hours: loc.hours || "Not Available",
        }))
      );
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  }

  useEffect(() => {
    fetchLocations();
  }, []);

  // ----------- DELETE LOCATION -----------
  async function handleDeleteLocation(id: string) {
    const token = localStorage.getItem("authToken");

    try {
      await apiFetch(`/api/auth/deletelocation/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      fetchLocations();
      setDeleteConfirmationModalOpen(false);
    } catch (error) {
      console.error("Error deleting location", error);
    }
  }

  async function handleUpdateLocation(location: Location) {
    const token = localStorage.getItem("authToken");
    try {
      const res = await apiFetch(`/api/auth/location/${location._id}`, {
        method: "PUT",
        body: JSON.stringify(location),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (res) {
        setIsEditModalOpen(false);
        fetchLocations();
      }
    } catch (error) {
      console.error("Error updating location", error);
    }
  }

  // ----------- ADD LOCATION -----------
  async function handleAddLocation() {
    const token = localStorage.getItem("authToken");

    try {
      await apiFetch("/api/auth/Addlocations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          address,
          genre: [genre],
          geolocation: {
            type: "Point",
            coordinates: [geo.lng, geo.lat],
          },
          hours,
        }),
      });

      fetchLocations();
      resetForm();
    } catch (error) {
      console.error("Error adding location", error);
    }
  }

  // ----------- RESET CREATE FORM -----------
  function resetForm() {
    setName("");
    setAddress("");
    setHours("");
    setGeo({ lat: 0, lng: 0 });
    setStep(1);
    setIsModalOpen(false);
  }

  // ----------- AUTOCOMPLETE (CREATE) -----------
  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      setAddress(place.formatted_address || "");
      if (place.geometry && place.geometry.location) {
        setGeo({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  // ----------- AUTOCOMPLETE (EDIT) -----------
  const onEditLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setEditAutocomplete(autocompleteInstance);
  };

  const onEditPlaceChanged = () => {
    if (editAutocomplete !== null) {
      const place = editAutocomplete.getPlace();
      setEditAddress(place.formatted_address || "");
      if (place.geometry && place.geometry.location) {
        setEditGeo({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      }
    }
  };

  // ----------- DELETE CONFIRMATION -----------
  const closeDeleteConfirmationModal = () => {
    setDeleteConfirmationModalOpen(false);
    setLocationToDelete("");
  };

  // ----------- VIEW HOURS -----------
  const handleViewHours = (location: { name: string; hours: string }) => {
    setSelectedLocationForHours(location);
    setViewHoursModalOpen(true);
  };

  const closeViewHoursModal = () => {
    setViewHoursModalOpen(false);
    setSelectedLocationForHours(null);
  };

  // ----------- OPEN EDIT MODAL -----------
  const openEditModal = (loc: Location) => {
    setIsEditModalOpen(true);
    setEditStep(1);

    // Pre-fill existing data
    setEditName(loc.name);
    setEditAddress(loc.address);
    setEditHours(loc.hours || "");
    setEditGeo({
      lat: loc.geolocation.coordinates[1],
      lng: loc.geolocation.coordinates[0],
    });
    setSelectedLocationId(loc._id);
  };

  // ----------- SUBMIT EDITED LOCATION -----------
  const handleEditSubmit = () => {
    handleUpdateLocation({
      _id: selectedLocationId,
      name: editName,
      genre: editGenre,
      address: editAddress,
      geolocation: {
        type: "Point",
        coordinates: [editGeo.lng, editGeo.lat],
      },
      hours: editHours,
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Add Location
        </button>
      </div>

      {/* Locations Table */}
      <table className="min-w-full table-auto border-collapse shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-green-500 text-white">
          <tr>
            <th className="px-4 py-3 text-left">Image</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Address</th>
            <th className="px-4 py-3 text-left">Genre</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={loc._id} className="hover:bg-gray-100 transition-colors">
              <td className="border-t px-4 py-3">
                {loc.logo ? (
                  <img
                    src={loc.logo}
                    alt={loc.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                ) : (
                  <button
                    className="text-blue-600 hover:text-red-800"
                    onClick={() => {
                      setUploadModalOpen(true);
                      setSelectedLocationId(loc._id);
                    }}
                  >
                    <UserPlusIcon className="h-5 w-5" />
                  </button>
                )}

              </td>
              <td className="border-t px-4 py-3">{loc.name}</td>
              <td className="border-t px-4 py-3">{loc.address}</td>
              <td className="border-t px-4 py-3">{loc.genre}</td>
              <td className="border-t px-4 py-3 space-x-2">
                {/* EDIT LOCATION ICON */}
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => openEditModal(loc)}
                >
                  <PencilIcon className="h-5 w-5" />
                </button>

                {/* VIEW HOURS ICON */}
                <button
                  className="text-green-600 hover:text-green-800"
                  onClick={() =>
                    handleViewHours({ name: loc.name, hours: loc.hours })
                  }
                >
                  <ClockIcon className="h-5 w-5" />
                </button>

                {/* DELETE ICON */}
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={() => {
                    setDeleteConfirmationModalOpen(true);
                    setLocationToDelete(loc._id);
                  }}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>

                {/* QR ICON */}
                <button
                  className="text-black-600 hover:text-black-800"
                  onClick={() => handleQrCodeClick(loc._id)}
                >
                  <QrCodeIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------- QR Code Modal ---------- */}
      {qrModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">QR Code for Location</h2>
            <QRCodeCanvas value={qrCodeData || ""} size={256} />
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={closeQrModal}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ---------- Delete Confirmation Modal ---------- */}
      {deleteConfirmationModalOpen && locationToDelete && (
        <Modal onClose={closeDeleteConfirmationModal}>
          <div className="p-4">
            <h2 className="text-black font-bold mb-4">Confirm Deletion</h2>
            <p className="text-black">Please confirm deletion.</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={closeDeleteConfirmationModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded ml-2"
                onClick={() => handleDeleteLocation(locationToDelete)}
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ---------- View Hours Modal ---------- */}
      {viewHoursModalOpen && selectedLocationForHours && (
        <Modal onClose={closeViewHoursModal}>
          <div className="p-4">
            <h2 className="text-black font-bold mb-4">
              {selectedLocationForHours.name} - Hours of Operation
            </h2>
            <p className="text-black">{selectedLocationForHours.hours}</p>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded"
                onClick={closeViewHoursModal}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

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
              onClick={handleUpload}
              disabled={!selectedFile}
            >
              Upload
            </button>
          </div>
        </Modal>
      )}

      {/* ========== CREATE LOCATION MODAL (3-Step) ========== */}
      {isModalOpen && (
        <Modal onClose={resetForm}>
          <div className="p-4">
            <h2 className="text-black font-bold mb-4">Add New Location</h2>
            {step === 1 && (
              <div>
                <label className="text-black block mb-2">Location Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-2 w-full text-black mb-4"
                  placeholder="Enter location name"
                />
                <label className="text-black block mb-2">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="border p-2 w-full text-black mb-4"
                >
                  <option value="" disabled>Select Genre</option>
                  {[
                    'Italian', 'Chinese', 'Indian', 'American', 'Mexican', 'French', 'Japanese',
                    'Mediterranean', 'Vegetarian', 'Vegan', 'Fast Food', 'Seafood', 'Thai', 'Spanish',
                    'Korean', 'Greek', 'Turkish', 'Middle Eastern', 'Brazilian', 'Caribbean', 'African',
                    'Soul Food', 'Barbecue', 'Fusion', 'European', 'Cajun/Creole', 'Steakhouse', 'Diner',
                    'Pasta', 'Sushi', 'Burgers', 'Pizzeria', 'Ice Cream', 'Donuts', 'Dessert', 'Bakery',
                    'Food Truck', 'Farm-to-Table', 'Buffet', 'Brunch', 'Hot Pot', 'Dim Sum', 'Tapas', 'Bistro',
                    'Fondue', 'Raw Food', 'Juice Bar/Smoothies', 'Poke Bowl', 'Ramen', 'Café', 'Tea House',
                    'Wine Bar', 'Coffeehouse', 'Organic', 'Gluten-Free', 'Kosher', 'Halal', 'Low-Carb/Keto',
                    'Paleo', 'Health Food', 'Breakfast', 'Brasserie', 'Noodle Bar', 'Grill', 'Taproom',
                    'Pizza', 'Sweets', 'Asian Fusion', 'Modern European', 'Contemporary', 'Hawaiian',
                    'Latino', 'Poutine', 'Sandwiches', 'Wraps'
                  ].map((genre, index) => (
                    <option key={index} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => setStep(2)}
                  disabled={!name}
                >
                  Next
                </button>
              </div>
            )}
            {step === 2 && (
              <div>
                <label className="text-black block mb-2">Address</label>
                <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="text-black border p-2 w-full mb-4"
                    placeholder="Enter address"
                  />
                </Autocomplete>
                <div className="mb-4" style={{ height: "300px" }}>
                  <GoogleMap
                    center={
                      geo.lat && geo.lng ? geo : { lat: 37.7749, lng: -122.4194 }
                    }
                    zoom={geo.lat && geo.lng ? 15 : 10}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    onClick={(e) => {
                      if (e.latLng) {
                        setGeo({ lat: e.latLng.lat(), lng: e.latLng.lng() });
                      }
                    }}
                  >
                    {geo.lat && geo.lng && <Marker position={geo} />}
                  </GoogleMap>
                </div>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <span className="mx-5 text-black">Step 2 of 3</span>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => setStep(3)}
                  disabled={!address || !geo.lat || !geo.lng}
                >
                  Next
                </button>
              </div>
            )}
            {step === 3 && (
              <div>
                <HoursOfOperation onHoursChange={handleHoursChange} />
                <div className="flex justify-between">
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleAddLocation}
                  >
                    Save Location
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ========== EDIT LOCATION MODAL (3-Step) ========== */}
      {isEditModalOpen && (
        <Modal onClose={() => setIsEditModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-black font-bold mb-4">Edit Location</h2>
            {editStep === 1 && (
              <div>
                <label className="text-black block mb-2">Location Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border p-2 w-full text-black mb-4"
                  placeholder="Enter location name"
                />
                <label className="text-black block mb-2">Genre</label>
                <select
                  value={editGenre}
                  onChange={(e) => setEditGenre(e.target.value)}
                  className="border p-2 w-full text-black mb-4"
                >
                  <option value="" disabled>Select Genre</option>
                  {[
                    'Italian', 'Chinese', 'Indian', 'American', 'Mexican', 'French', 'Japanese',
                    'Mediterranean', 'Vegetarian', 'Vegan', 'Fast Food', 'Seafood', 'Thai', 'Spanish',
                    'Korean', 'Greek', 'Turkish', 'Middle Eastern', 'Brazilian', 'Caribbean', 'African',
                    'Soul Food', 'Barbecue', 'Fusion', 'European', 'Cajun/Creole', 'Steakhouse', 'Diner',
                    'Pasta', 'Sushi', 'Burgers', 'Pizzeria', 'Ice Cream', 'Donuts', 'Dessert', 'Bakery',
                    'Food Truck', 'Farm-to-Table', 'Buffet', 'Brunch', 'Hot Pot', 'Dim Sum', 'Tapas', 'Bistro',
                    'Fondue', 'Raw Food', 'Juice Bar/Smoothies', 'Poke Bowl', 'Ramen', 'Café', 'Tea House',
                    'Wine Bar', 'Coffeehouse', 'Organic', 'Gluten-Free', 'Kosher', 'Halal', 'Low-Carb/Keto',
                    'Paleo', 'Health Food', 'Breakfast', 'Brasserie', 'Noodle Bar', 'Grill', 'Taproom',
                    'Pizza', 'Sweets', 'Asian Fusion', 'Modern European', 'Contemporary', 'Hawaiian',
                    'Latino', 'Poutine', 'Sandwiches', 'Wraps'
                  ].map((genre, index) => (
                    <option key={index} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => setEditStep(2)}
                  disabled={!editName}
                >
                  Next
                </button>
              </div>
            )}
            {editStep === 2 && (
              <div>
                <label className="text-black block mb-2">Address</label>
                <Autocomplete onLoad={onEditLoad} onPlaceChanged={onEditPlaceChanged}>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="text-black border p-2 w-full mb-4"
                    placeholder="Enter address"
                  />
                </Autocomplete>
                <div className="mb-4" style={{ height: "300px" }}>
                  <GoogleMap
                    center={
                      editGeo.lat && editGeo.lng
                        ? editGeo
                        : { lat: 37.7749, lng: -122.4194 }
                    }
                    zoom={editGeo.lat && editGeo.lng ? 15 : 10}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    onClick={(e) => {
                      if (e.latLng) {
                        setEditGeo({
                          lat: e.latLng.lat(),
                          lng: e.latLng.lng(),
                        });
                      }
                    }}
                  >
                    {editGeo.lat && editGeo.lng && <Marker position={editGeo} />}
                  </GoogleMap>
                </div>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={() => setEditStep(1)}
                >
                  Back
                </button>
                <span className="mx-5 text-black">Step 2 of 3</span>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={() => setEditStep(3)}
                  disabled={!editAddress || !editGeo.lat || !editGeo.lng}
                >
                  Next
                </button>
              </div>
            )}
            {editStep === 3 && (
              <div>
                <HoursOfOperation onHoursChange={handleEditHoursChange} existingHours={editHours} />
                <div className="flex justify-between">
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                    onClick={() => setEditStep(2)}
                  >
                    Back
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded"
                    onClick={handleEditSubmit}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
