"use client";
import React from "react";

export default function ShippingAddressForm({ shippingAddress, onAddressChange }) {
  const addressFields = {
    Address: "address",
    City: "city",
    "Postal Code": "postalCode",
    Country: "country",
  };

  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-4 mb-6">
        Shipping Address
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(addressFields).map(([label, name]) => (
          <div key={name}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <input
              type="text"
              id={name}
              name={name}
              value={shippingAddress[name]}
              onChange={onAddressChange}
              required
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        ))}
      </div>
    </section>
  );
}