// File: app/components/user/cart/CartFooter.js
"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";

export default function CartFooter({ total, userId }) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-3xl font-bold text-gray-800">
            ${total.toFixed(2)}
          </p>
        </div>
        <div className="flex space-x-4">
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
            Save for Later
          </button>
          <Link href={`/user/${userId}/checkout`}>
            <button className="px-8 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center space-x-2 shadow-lg shadow-orange-500/20">
              <CreditCard className="w-5 h-5" />
              <span>Checkout</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}