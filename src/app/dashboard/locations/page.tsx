"use client";

import { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { GoogleMap, LoadScript, Autocomplete, Marker } from "@react-google-maps/api";
import HoursOfOperation from "@/app/components/HoursOfOperation";
import { PencilIcon, TrashIcon, ClockIcon, QrCodeIcon, UserPlusIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { QRCodeCanvas } from 'qrcode.react';
import { apiFetch } from "@/app/lib/api";

const googleMapsApiKey = "AIzaSyBxeae0ftXUhPZ8bZWE1-xgaWEkJFKGjek";

interface Location {
  _id: string;
  name: string;
  address: string;
  geolocation: {
    coordinates: [number, number];
  };
  hours: string;
  image: string;
}

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewHoursModalOpen, setViewHoursModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ name: string; hours: string } | null>(null);
  const [step, setStep] = useState(1);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState("");
  // Form fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [geo, setGeo] = useState({ lat: 0, lng: 0 });
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
    formData.append("image", selectedFile);

    try {
      await apiFetch(`/api/auth/uploadLocationImage/${selectedLocationId}`, {
        method: "POST",
        body: formData,
      });
      fetchLocations();
      closeUploadModal();
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  const handleHoursChange = (hours: string) => {
    setHours(hours); // Update the parent state with the selected hours
  };

  const handleQrCodeClick = (locId: string): void => {
    // Generate the QR code for the location ID
    setQrCodeData(locId); // Pass location ID to the QR code generation
    setQrModalOpen(true); // Open the modal
  };

  const closeQrModal = () => {
    setQrModalOpen(false);
    setQrCodeData(null); // Clear the QR code data when closing
  };

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
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  }

  // Handler for deleting a location
  async function handleDeleteLocation(id: string) {
    const token = localStorage.getItem("authToken");

    try {
      await apiFetch(`/api/auth/deletelocation/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });

      // If the request was successful, update the UI
      fetchLocations();
      setDeleteConfirmationModalOpen(false);
    } catch (error) {
      console.error("Error deleting location", error);
    }
  }

  // Handler for deleting a location
  async function handleUpdateLocation(id: string) {
    const token = localStorage.getItem("authToken");

    try {
      const res = await apiFetch(`/api/auth/location/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });
      if ((res as Response).ok) {
        fetchLocations();
        setDeleteConfirmationModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting location", error);
    }
  }

  // Handler for adding a new location
  async function handleAddLocation() {
    const token = localStorage.getItem("authToken");

    try {
      await apiFetch("/api/auth/Addlocations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          address,
          geolocation: {
            type: "Point",
            coordinates: [geo.lng, geo.lat],
          },
          hours, // Send the hours to the server
        }),
      });

      // If request is successful, update locations and reset the form
      fetchLocations();
      resetForm();
    } catch (error) {
      console.error("Error adding location", error);
    }
  }


  function resetForm() {
    setName("");
    setAddress("");
    setHours("");
    setGeo({ lat: 0, lng: 0 });
    setStep(1);
    setIsModalOpen(false);
  }

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

  // Close the delete confirmation modal
  const closeDeleteConfirmationModal = () => {
    setDeleteConfirmationModalOpen(false);
    setLocationToDelete("");
  };

  const handleViewHours = (location: { name: string; hours: string }) => {
    setSelectedLocation(location);
    setViewHoursModalOpen(true); // Open the View Hours modal
  };

  const closeViewHoursModal = () => {
    setViewHoursModalOpen(false);
    setSelectedLocation(null); // Clear the selected location
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>

      <div className="p-8">
      <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Manage Locations</h2>
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
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) => (
              <tr key={loc._id} className="hover:bg-gray-100 transition-colors">
                <td className="border-t px-4 py-3">
                  {loc.image ? <img src={loc.image} alt={loc.name} className="h-12 w-12 object-cover rounded" /> : <button
                    className="text-blue-600 hover:text-red-800"
                    onClick={() => {
                      setUploadModalOpen(true);
                      setSelectedLocationId(loc._id);
                    }}
                  >
                    <UserPlusIcon className="h-5 w-5" />
                  </button>}
                </td>
                <td className="border-t px-4 py-3">{loc.name}</td>
                <td className="border-t px-4 py-3">{loc.address}</td>
                <td className="border-t px-4 py-3">
                  <button
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    onClick={() => handleUpdateLocation(loc._id)}
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="text-green-600 hover:text-green-800 mr-2"
                    onClick={() => handleViewHours({ name: loc.name, hours: loc.hours })}
                  >
                    <ClockIcon className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      setDeleteConfirmationModalOpen(true);
                      setLocationToDelete(loc._id);
                    }}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
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

        {/* QR Code Modal */}
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

        {/* Delete Confirmation Modal */}
        {deleteConfirmationModalOpen && locationToDelete && (
          <Modal onClose={closeDeleteConfirmationModal}>
            <div className="p-4">
              <h2 className="text-black font-bold mb-4">Confirm Deletion</h2>
              <p className="text-black">Please confirm deletion.</p>
              <div className="flex justify-end mt-4">
                <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={closeDeleteConfirmationModal}>
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


        {/* View Hours Modal */}
        {viewHoursModalOpen && selectedLocation && (
          <Modal onClose={closeViewHoursModal}>
            <div className="p-4">
              <h2 className="text-black font-bold mb-4">{selectedLocation.name} - Hours of Operation</h2>
              <p className="text-black">{selectedLocation.hours}</p>
              <div className="flex justify-end mt-4">
                <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={closeViewHoursModal}>
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Upload Image Modal */}
        {uploadModalOpen && (
          <Modal onClose={closeUploadModal}>
            <div className="p-4">
              <h2 className="text-black font-bold mb-4">Upload Image</h2>
              <input type="file" onChange={handleFileChange} className="text-black mb-4" />
              {previewImage && <img src={previewImage} alt="Preview" className="h-24 w-24 object-cover rounded mb-4" />}
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleUpload} disabled={!selectedFile}>
                Upload
              </button>
            </div>
          </Modal>
        )}

        {/* Modal */}
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
                      center={geo.lat && geo.lng ? geo : { lat: 37.7749, lng: -122.4194 }}
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
      </div>
    </LoadScript>
  );
}
