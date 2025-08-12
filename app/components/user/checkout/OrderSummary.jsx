"use client";
import React from "react";

// A simple SVG spinner component to show loading state on the button
const Spinner = () => (
  <svg
    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function OrderSummary({
  cartItems,
  selectedItemId,
  onItemSelect,
  selectedShippingMethod,
  isSubmitting,
  submitError,
  total,
}) {
  const selectedItem = cartItems.find((item) => item.product_item_id === selectedItemId);
  const subtotal = selectedItem
    ? (selectedItem.product_item.product.price ?? 0) * (selectedItem.qty ?? 0)
    : 0;

  return (
    <aside className="lg:col-span-1 mt-10 lg:mt-0">
      <div className="sticky top-6 bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-4 mb-6">
          Order Summary
        </h2>

        {/* Item Selection List */}
        <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-2">
          {cartItems.length > 0 ? (
            cartItems.map((item) => {
              const isSelected = selectedItemId === item.product_item_id;
              return (
                <label
                  key={item.product_item_id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "bg-orange-50 border-orange-400 ring-2 ring-orange-100"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {/* The actual radio button is hidden, but accessible */}
                  <input
                    type="radio"
                    name="selectedItem"
                    value={item.product_item_id}
                    checked={isSelected}
                    onChange={() => onItemSelect(item.product_item_id)}
                    className="sr-only" // Screen-reader only, hides visually
                  />
                  <img
                    src={item.product_item.product.product_image_url}
                    alt={item.product_item.product.name}
                    className="w-14 h-14 object-cover rounded-md"
                  />
                  <div className="ml-4 flex-1 text-sm">
                    <p className="font-semibold text-gray-800">
                      {item.product_item.product.name}
                    </p>
                    <p className="text-gray-500">Quantity: {item.qty}</p>
                  </div>
                  <p className="ml-4 font-semibold text-gray-900">
                    ${((item.product_item.product.price ?? 0) * (item.qty ?? 0)).toFixed(2)}
                  </p>
                </label>
              );
            })
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Your cart is empty.</p>
              <a href="/" className="text-orange-600 font-semibold hover:underline mt-2 inline-block">
                Continue Shopping
              </a>
            </div>
          )}
        </div>

        {/* Cost Breakdown */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-gray-900">
                ${(selectedShippingMethod?.price ?? 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-dashed">
              <span>Order Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}
        
        {/* Error and Action Button */}
        <div className="mt-6">
          {submitError && <p className="text-sm text-red-600 text-center mb-3">{submitError}</p>}
          {!selectedItem && cartItems.length > 0 && (
             <p className="text-sm text-center text-blue-600 bg-blue-50 p-3 rounded-md mb-3">
              Please select an item to checkout.
             </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !selectedItem}
            className={`w-full flex justify-center items-center bg-orange-500 text-white py-3 rounded-lg font-semibold transition-colors ${
              isSubmitting || !selectedItem
                ? "bg-gray-400 cursor-not-allowed"
                : "hover:bg-orange-600"
            }`}
          >
            {isSubmitting ? (
              <>
                <Spinner />
                Placing Order...
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}