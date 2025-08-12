"use client";

import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import { toast } from "react-hot-toast";

export default function CartCard({ cart, userId, onQuantityChange, onDeleteItem, onDeleteCart }) {
  const cartTotal = cart.items.reduce((total, item) => {
    const price = item.product_item?.product?.price || 0;
    return total + price * item.qty;
  }, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Card Header */}
      <div className="p-6 sm:p-8 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-800">Shopping Cart</h2>
          {cart.items.length > 0 && (
            <button
              onClick={onDeleteCart}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="divide-y divide-slate-100 p-4 sm:p-6">
        {cart.items.map((item) => (
          <CartItem
            key={item.product_item_id}
            item={item}
            onQuantityChange={onQuantityChange}
            onDeleteItem={onDeleteItem} // Correctly passing the item delete handler
          />
        ))}
      </div>

      {/* Card Footer with Summary */}
      <div className="p-6 sm:p-8 bg-slate-50/50">
        <CartSummary total={cartTotal} userId={userId} />
      </div>
    </div>
  );
}