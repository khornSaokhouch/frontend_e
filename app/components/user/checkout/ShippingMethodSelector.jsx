"use client";
import React from "react";

export default function ShippingMethodSelector({ methods, selectedMethodId, onSelectMethod }) {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-4 mb-6">
        Shipping Method
      </h2>
      <div className="space-y-4">
        {methods.map((method) => (
          <label
            key={method.id}
            className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer transition-all ${
              selectedMethodId === method.id
                ? "border-orange-500 ring-2 ring-orange-200"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="shippingMethod"
              value={method.id}
              checked={selectedMethodId === method.id}
              onChange={(e) => onSelectMethod(Number(e.target.value))}
              className="hidden"
            />
            <span className="font-medium text-gray-800">{method.name}</span>
            <span className="font-semibold text-gray-900">
              ${(method.price ?? 0).toFixed(2)}
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}