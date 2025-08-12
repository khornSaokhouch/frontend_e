"use client";
import React from "react";

export default function PaymentMethodSelector({
  methods,
  selectedMethodId,
  onSelectMethod,
  onManageClick,
}) {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 border-b pb-4 mb-6">
        Payment Method
      </h2>
      <div className="space-y-4">
        {methods.map((method) => (
          <label
            key={method.id}
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
              selectedMethodId === method.id
                ? "border-orange-500 ring-2 ring-orange-200"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethodId === method.id}
              onChange={(e) => onSelectMethod(Number(e.target.value))}
              className="hidden"
            />
            <span className="font-medium text-gray-800">
              {method.provider} ending in {method.card_number?.slice(-4)}
            </span>
          </label>
        ))}
      </div>
      <button
        type="button"
        onClick={onManageClick}
        className="mt-6 text-sm font-semibold text-orange-600 hover:text-orange-500"
      >
        + Add or Manage Payment Methods
      </button>
    </section>
  );
}