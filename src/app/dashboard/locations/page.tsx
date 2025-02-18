"use client";

import { useState, useEffect, FormEvent } from "react";
import Modal from "../../components/Modal";
import { GoogleMap, LoadScript, Autocomplete, Marker } from "@react-google-maps/api";
import HoursOfOperation from "@/app/components/HoursOfOperation";

const googleMapsApiKey = "AIzaSyBxeae0ftXUhPZ8bZWE1-xgaWEkJFKGjek";

export default function LocationsPage() {
  const [locations, setLocations] = useState<{ _id: string; name: string; address: string; geolocation: { coordinates: [number, number] } }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);

  // Form fields
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [geo, setGeo] = useState({ lat: 0, lng: 0 });

  const handleHoursChange = (hours: string) => {
    setHours(hours); // Update the parent state with the selected hours
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  async function fetchLocations() {
    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch("/api/auth/getRestaurantLocations", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
      }
    } catch (error) {
      console.error("Error fetching locations", error);
    }
  }

  // Handler for deleting a location
  async function handleDeleteLocation(id: string) {
    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(`/api/auth/deletelocation/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (res.ok) {
        fetchLocations();
      }
    } catch (error) {
      console.error("Error deleting location", error);
    }
  }

  // Handler for adding a new location
  async function handleAddLocation() {
    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch("/api/auth/Addlocations", {
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
      if (res.status === 201) {
        fetchLocations();
        resetForm();
      }
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold">Locations</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setIsModalOpen(true)}
        >
          Add Location
        </button>
      </div>

      {/* Locations Table */}
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Address</th>
            <th className="border p-2">Latitude</th>
            <th className="border p-2">Longitude</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) => (
            <tr key={loc._id}>
              <td className="border p-2">{loc.name}</td>
              <td className="border p-2">{loc.address}</td>
              <td className="border p-2">{loc.geolocation.coordinates[1]}</td>
              <td className="border p-2">{loc.geolocation.coordinates[0]}</td>
              <td className="border p-2">
                <button className="text-blue-600 mr-2">Edit</button>
                <button className="text-red-600" onClick={() => handleDeleteLocation(loc._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
                <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
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
                </LoadScript>
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
                <HoursOfOperation onHoursChange={handleHoursChange}/>
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
  );
}
