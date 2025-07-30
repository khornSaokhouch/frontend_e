// File: app/components/user/cart/QuantityControl.js
"use client";
import { Plus, Minus } from "lucide-react";

export default function QuantityControl({ quantity, onIncrease, onDecrease }) {
  return (
    <div className="flex items-center space-x-2 bg-white rounded-full border border-gray-200 shadow-sm">
      <button
        className="p-2.5 hover:bg-gray-100 rounded-l-full transition-colors disabled:opacity-50"
        onClick={onDecrease}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4 text-gray-600" />
      </button>
      <span className="px-4 py-1 font-bold text-gray-800 text-lg min-w-[3rem] text-center">
        {quantity}
      </span>
      <button
        className="p-2.5 hover:bg-gray-100 rounded-r-full transition-colors"
        onClick={onIncrease}
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4 text-gray-600" />
      </button>
    </div>
  );
}