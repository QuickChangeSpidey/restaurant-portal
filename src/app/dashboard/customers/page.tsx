"use client";

import React, { useState, useMemo } from "react";
import { Dialog, Menu } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  TrashIcon,
  EnvelopeIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  BellAlertIcon,
  ChevronDownIcon,
  ChevronUpDownIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";

/** ----- Mock Data ----- */
interface RedeemedCoupon {
  code: string;
  type: string;         // e.g. "BOGO", "FreeItem", "Discount", etc.
  locationName: string;
  redeemedAt: string;   // ISO date string
}

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  couponsRedeemed: RedeemedCoupon[];
}

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "111-111-1111",
    couponsRedeemed: [
      {
        code: "BOGO123",
        type: "BOGO",
        locationName: "Main Street",
        redeemedAt: "2023-09-14T15:00:00Z",
      },
    ],
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    phone: "222-222-2222",
    couponsRedeemed: [
      {
        code: "FREEDRINK",
        type: "FreeItem",
        locationName: "Downtown",
        redeemedAt: "2023-09-20T12:00:00Z",
      },
      {
        code: "DISCOUNT50",
        type: "Discount",
        locationName: "Uptown",
        redeemedAt: "2023-09-18T19:30:00Z",
      },
    ],
  },
  {
    id: "3",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice@example.com",
    phone: "333-333-3333",
    couponsRedeemed: [],
  },
  {
    id: "4",
    firstName: "Bob",
    lastName: "Marley",
    email: "bob@example.com",
    phone: "444-444-4444",
    couponsRedeemed: [
      {
        code: "B1G1PIZZA",
        type: "BOGO",
        locationName: "Broadway",
        redeemedAt: "2023-09-21T18:45:00Z",
      },
      {
        code: "25OFF",
        type: "Discount",
        locationName: "East Side",
        redeemedAt: "2023-09-22T14:15:00Z",
      },
    ],
  },
  {
    id: "5",
    firstName: "Susan",
    lastName: "Green",
    email: "susan@example.com",
    phone: "555-555-1234",
    couponsRedeemed: [
      {
        code: "WELCOME10",
        type: "Discount",
        locationName: "Market",
        redeemedAt: "2023-09-10T10:00:00Z",
      },
    ],
  },
  {
    id: "6",
    firstName: "Tom",
    lastName: "Hardy",
    email: "tom@example.com",
    phone: "666-666-4321",
    couponsRedeemed: [
      {
        code: "SUMMER20",
        type: "Discount",
        locationName: "West End",
        redeemedAt: "2023-09-05T18:00:00Z",
      },
    ],
  },
  {
    id: "7",
    firstName: "Mia",
    lastName: "Fox",
    email: "mia@example.com",
    phone: "777-111-2222",
    couponsRedeemed: [
      {
        code: "FLASHSALE",
        type: "Discount",
        locationName: "South Park",
        redeemedAt: "2023-09-25T09:15:00Z",
      },
    ],
  },
  {
    id: "8",
    firstName: "David",
    lastName: "Kim",
    email: "david@example.com",
    phone: "888-999-0000",
    couponsRedeemed: [
      {
        code: "FREESHIP",
        type: "FreeItem",
        locationName: "North Outlet",
        redeemedAt: "2023-09-07T13:20:00Z",
      },
    ],
  },
  {
    id: "9",
    firstName: "Karen",
    lastName: "Baker",
    email: "karen@example.com",
    phone: "999-888-7777",
    couponsRedeemed: [],
  },
  {
    id: "10",
    firstName: "Leo",
    lastName: "White",
    email: "leo@example.com",
    phone: "123-321-4567",
    couponsRedeemed: [
      {
        code: "BOGOHOTDOG",
        type: "BOGO",
        locationName: "Ballpark",
        redeemedAt: "2023-09-15T17:00:00Z",
      },
    ],
  },
  {
    id: "11",
    firstName: "Zoe",
    lastName: "Adams",
    email: "zoe@example.com",
    phone: "111-222-3333",
    couponsRedeemed: [
      {
        code: "HALFOFF",
        type: "Discount",
        locationName: "Central Station",
        redeemedAt: "2023-09-16T20:00:00Z",
      },
    ],
  },
  {
    id: "12",
    firstName: "Olivia",
    lastName: "Brown",
    email: "olivia@example.com",
    phone: "444-555-6666",
    couponsRedeemed: [],
  },
  {
    id: "13",
    firstName: "Ethan",
    lastName: "Martinez",
    email: "ethan@example.com",
    phone: "999-111-0000",
    couponsRedeemed: [
      {
        code: "WELCOME10",
        type: "Discount",
        locationName: "Market",
        redeemedAt: "2023-09-09T09:30:00Z",
      },
      {
        code: "20OFF",
        type: "Discount",
        locationName: "Uptown",
        redeemedAt: "2023-09-19T15:45:00Z",
      },
    ],
  },
  {
    id: "14",
    firstName: "Paula",
    lastName: "Wang",
    email: "paula@example.com",
    phone: "222-333-4444",
    couponsRedeemed: [
      {
        code: "FREEDRINK",
        type: "FreeItem",
        locationName: "Downtown",
        redeemedAt: "2023-09-11T12:30:00Z",
      },
    ],
  },
  {
    id: "15",
    firstName: "Nick",
    lastName: "Thomas",
    email: "nick@example.com",
    phone: "555-444-9999",
    couponsRedeemed: [
      {
        code: "SEPTSALE",
        type: "Discount",
        locationName: "Uptown",
        redeemedAt: "2023-09-29T21:10:00Z",
      },
    ],
  },
];

export default function CustomersPage() {
  // ------------------ Data ------------------
  const [customers] = useState<Customer[]>(MOCK_CUSTOMERS);

  // For multi-select checkboxes
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);

  // For the "View Coupons" modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ------------------ Filters ------------------
  const [filterLocation, setFilterLocation] = useState("");
  const [filterCouponCode, setFilterCouponCode] = useState("");
  const [filterCouponType, setFilterCouponType] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // Gather unique location names
  const locationOptions = useMemo(() => {
    const allLocations = customers.flatMap((c) =>
      c.couponsRedeemed.map((r) => r.locationName)
    );
    const unique = Array.from(new Set(allLocations));
    return unique;
  }, [customers]);

  // Gather unique coupon types
  const couponTypeOptions = useMemo(() => {
    const allTypes = customers.flatMap((c) =>
      c.couponsRedeemed.map((r) => r.type)
    );
    const unique = Array.from(new Set(allTypes));
    return unique;
  }, [customers]);

  // -------------- Filtered Customers --------------
  const filteredCustomers = useMemo(() => {
    if (
      !filterLocation &&
      !filterCouponCode &&
      !filterCouponType &&
      !filterStartDate &&
      !filterEndDate
    ) {
      return customers;
    }

    return customers.filter((customer) => {
      if (customer.couponsRedeemed.length === 0) {
        if (filterLocation || filterCouponCode || filterCouponType || filterStartDate || filterEndDate) {
          return false;
        }
        return true;
      }

      // At least one coupon matches all filters
      const doesMatch = customer.couponsRedeemed.some((coupon) => {
        if (filterLocation && coupon.locationName !== filterLocation) {
          return false;
        }
        if (
          filterCouponCode &&
          !coupon.code.toLowerCase().includes(filterCouponCode.toLowerCase())
        ) {
          return false;
        }
        if (filterCouponType && coupon.type !== filterCouponType) {
          return false;
        }
        if (filterStartDate) {
          const start = new Date(filterStartDate).getTime();
          const redeemedAt = new Date(coupon.redeemedAt).getTime();
          if (redeemedAt < start) {
            return false;
          }
        }
        if (filterEndDate) {
          const end = new Date(filterEndDate).getTime();
          const redeemedAt = new Date(coupon.redeemedAt).getTime();
          if (redeemedAt > end) {
            return false;
          }
        }

        return true;
      });

      return doesMatch;
    });
  }, [
    customers,
    filterLocation,
    filterCouponCode,
    filterCouponType,
    filterStartDate,
    filterEndDate,
  ]);

  // ------------------ Functions for Row + Bulk Actions ------------------
  function toggleSelectCustomer(customerId: string) {
    setSelectedCustomerIds((prev) => {
      if (prev.includes(customerId)) {
        return prev.filter((id) => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  }

  function isCustomerSelected(customerId: string) {
    return selectedCustomerIds.includes(customerId);
  }

  function selectAll() {
    // If all filtered are already selected, unselect all
    if (selectedCustomerIds.length === filteredCustomers.length) {
      setSelectedCustomerIds([]);
    } else {
      setSelectedCustomerIds(filteredCustomers.map((c) => c.id));
    }
  }

  // Row-level actions
  function handleRowDelete(customer: Customer) {
    console.log("Delete customer:", customer.id);
    // real API call here
  }
  function handleRowSendEmail(customer: Customer) {
    console.log("Send email to:", customer.id);
  }
  function handleRowSendText(customer: Customer) {
    console.log("Send text to:", customer.id);
  }
  function handleRowSendPush(customer: Customer) {
    console.log("Send push to:", customer.id);
  }

  // Bulk actions
  function handleMassDelete() {
    console.log("Mass delete these IDs:", selectedCustomerIds);
  }
  function handleMassSendEmail() {
    console.log("Mass send email to:", selectedCustomerIds);
  }
  function handleMassSendText() {
    console.log("Mass send text to:", selectedCustomerIds);
  }
  function handleMassSendPush() {
    console.log("Mass send push to:", selectedCustomerIds);
  }

  // Modal - view coupons
  function openCustomerCoupons(customer: Customer) {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  }
  function closeModal() {
    setSelectedCustomer(null);
    setIsModalOpen(false);
  }

  // ------------------ Render ------------------
  return (
    <div className="p-8">
      {/* Title & Bulk Actions */}
      <div className="flex items-center justify-between mb-4">
        {/* If any customers are selected, show Bulk Action dropdown */}
        {selectedCustomerIds.length > 0 && (
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="bg-green-500 text-white px-4 py-2 rounded-lg inline-flex items-center">
              Bulk Actions
              <ChevronDownIcon className="h-5 w-5 ml-2 text-white" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md focus:outline-none z-50">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleMassDelete}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex w-full px-3 py-2 text-sm text-left`}
                  >
                    <TrashIcon className="h-4 w-4 mr-2 text-red-500" />
                    Delete
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleMassSendEmail}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex w-full px-3 py-2 text-sm text-left`}
                  >
                    <EnvelopeIcon className="h-4 w-4 mr-2 text-blue-500" />
                    Send Email
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleMassSendText}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex w-full px-3 py-2 text-sm text-left`}
                  >
                    <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4 mr-2 text-green-500" />
                    Send Text
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleMassSendPush}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } flex w-full px-3 py-2 text-sm text-left`}
                  >
                    <BellAlertIcon className="h-4 w-4 mr-2 text-yellow-500" />
                    Send Push
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        )}
      </div>

      {/* Filters Section */}
      <div className="p-4 mb-4 bg-gray-100 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Filter: Location */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Location:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          >
            <option value="">All</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Filter: Coupon Code */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Coupon Code:</label>
          <input
            type="text"
            className="border rounded px-2 py-1 text-sm"
            placeholder="e.g. FREE"
            value={filterCouponCode}
            onChange={(e) => setFilterCouponCode(e.target.value)}
          />
        </div>

        {/* Filter: Coupon Type */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Type:</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={filterCouponType}
            onChange={(e) => setFilterCouponType(e.target.value)}
          >
            <option value="">All</option>
            {couponTypeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Filter: Date Range */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">From:</label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
          <label className="text-sm text-gray-600">To:</label>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* ----- SCROLLABLE CONTAINER with custom green scrollbar ----- */}
      <div className="h-96 overflow-y-auto relative">
        {/* Inline styles for the green scrollbar */}
        <style jsx>{`
          /* For Chrome, Edge, Safari */
          div::-webkit-scrollbar {
            width: 8px;
          }
          div::-webkit-scrollbar-track {
            background: #ecfdf5; /* a lighter greenish background */
          }
          div::-webkit-scrollbar-thumb {
            background-color: #10b981; /* Tailwind's green-500 */
            border-radius: 9999px; /* fully rounded */
            border: 2px solid #ecfdf5;
          }

          /* For Firefox - set scrollbar-color */
          div {
            scrollbar-color: #10b981 #ecfdf5;
            scrollbar-width: thin;
          }
        `}</style>

        {/* TABLE of Filtered Customers */}
        <table className="min-w-full border-collapse">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  onChange={selectAll}
                  // check if all FILTERED customers are selected
                  checked={
                    filteredCustomers.length > 0 &&
                    selectedCustomerIds.length === filteredCustomers.length
                  }
                />
              </th>
              <th className="px-4 py-3 text-left">First Name</th>
              <th className="px-4 py-3 text-left">Last Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => {
              const isChecked = isCustomerSelected(customer.id);

              return (
                <tr
                  key={customer.id}
                  className="border-b hover:bg-gray-100 transition-colors"
                  onClick={(e) => {
                    // If user clicked the checkbox or the actions dropdown, don’t open the modal
                    const tagName = (e.target as HTMLElement).tagName.toLowerCase();
                    if (
                      tagName === "input" ||
                      tagName === "button" ||
                      tagName === "svg" ||
                      tagName === "path"
                    ) {
                      return;
                    }
                    // Otherwise, open modal
                    openCustomerCoupons(customer);
                  }}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelectCustomer(customer.id);
                      }}
                      checked={isChecked}
                    />
                  </td>
                  <td className="px-4 py-3">{customer.firstName}</td>
                  <td className="px-4 py-3">{customer.lastName}</td>
                  <td className="px-4 py-3">{customer.email}</td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">
                    {/* Row Actions Dropdown */}
                    <Menu as="div" className="relative inline-block text-left">
                      <Menu.Button
                        onClick={(e) => {
                          e.stopPropagation(); // Don’t trigger row click
                        }}
                        className="inline-flex justify-center w-8 h-8 rounded-full text-gray-600 hover:bg-gray-200"
                      >
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </Menu.Button>
                      <Menu.Items className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md focus:outline-none z-50">
                      <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => openCustomerCoupons(customer)}
                              className={`${
                                active ? "bg-gray-100" : ""
                              } flex w-full px-3 py-2 text-sm text-left items-center`}
                            >
                              <TicketIcon className="h-4 w-4 mr-2 text-orange-500" />
                              View Coupons
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleRowDelete(customer)}
                              className={`${
                                active ? "bg-gray-100" : ""
                              } flex w-full px-3 py-2 text-sm text-left items-center`}
                            >
                              <TrashIcon className="h-4 w-4 mr-2 text-red-500" />
                              Delete
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleRowSendEmail(customer)}
                              className={`${
                                active ? "bg-gray-100" : ""
                              } flex w-full px-3 py-2 text-sm text-left items-center`}
                            >
                              <EnvelopeIcon className="h-4 w-4 mr-2 text-blue-500" />
                              Send Email
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleRowSendText(customer)}
                              className={`${
                                active ? "bg-gray-100" : ""
                              } flex w-full px-3 py-2 text-sm text-left items-center`}
                            >
                              <ChatBubbleOvalLeftEllipsisIcon className="h-4 w-4 mr-2 text-green-500" />
                              Send Text
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => handleRowSendPush(customer)}
                              className={`${
                                active ? "bg-gray-100" : ""
                              } flex w-full px-3 py-2 text-sm text-left items-center`}
                            >
                              <BellAlertIcon className="h-4 w-4 mr-2 text-yellow-500" />
                              Send Push
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ----- Modal: Redeemed Coupons for the Selected Customer ----- */}
      <Dialog open={isModalOpen} onClose={closeModal} className="relative z-50">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        {/* Dialog Panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white w-full max-w-lg rounded shadow-lg p-6 text-black">
            <Dialog.Title className="text-xl font-semibold mb-4">
              {selectedCustomer
                ? `Coupons Redeemed by ${selectedCustomer.firstName} ${selectedCustomer.lastName}`
                : "Customer Coupons"}
            </Dialog.Title>

            {selectedCustomer && (
              <div className="overflow-y-auto max-h-60">
                {selectedCustomer.couponsRedeemed.length === 0 ? (
                  <p className="text-sm text-gray-500">No coupons redeemed.</p>
                ) : (
                  <table className="min-w-full border-collapse">
                    <thead className="bg-green-100 text-black">
                      <tr>
                        <th className="px-4 py-2 text-left">Coupon Code</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Location</th>
                        <th className="px-4 py-2 text-left">Date / Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCustomer.couponsRedeemed.map((coupon, idx) => (
                        <tr
                          key={idx}
                          className="border-b last:border-0 hover:bg-gray-50"
                        >
                          <td className="px-4 py-2">{coupon.code}</td>
                          <td className="px-4 py-2">{coupon.type}</td>
                          <td className="px-4 py-2">{coupon.locationName}</td>
                          <td className="px-4 py-2">
                            {new Date(coupon.redeemedAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-200 text-black hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
