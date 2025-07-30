// File: app/components/user/cart/CartSummary.js
"use client";
import Link from "next/link";
import { CreditCard } from "lucide-react";

export default function CartSummary({ total, userId }) {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-3xl font-extrabold text-gray-900">
            ${total.toFixed(2)}
          </p>
        </div>
        <Link href={`/user/${userId}/checkout`}>
          <button className="px-8 py-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center space-x-2 shadow-lg shadow-orange-500/30">
            <CreditCard className="w-5 h-5" />
            <span>Proceed to Checkout</span>
          </button>
        </Link>
      </div>
    </div>
  );
}