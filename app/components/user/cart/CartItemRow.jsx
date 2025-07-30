// File: app/components/user/cart/CartItemRow.js
"use client";

import { motion } from "framer-motion";
import { Plus, Minus, Trash2 } from "lucide-react";

export default function CartItemRow({ item, cartId, handleQtyChange, confirmDelete }) {
  const product = item.product_item?.product;
  const itemTotal = (product?.price || 0) * item.qty;

  return (
    <motion.div
      className="flex items-center space-x-6 p-4 sm:p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex-shrink-0">
        <img
          src={product?.product_image_url || "/placeholder.svg"}
          alt={product?.name || "Product"}
          className="w-20 h-20 object-cover rounded-xl shadow-sm"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          {product?.name || "Unknown Product"}
        </h3>
        <p className="text-gray-500 text-sm mb-2">
          ${product?.price?.toFixed(2) || "0.00"} each
        </p>
        
        {/* Quantity Controls */}
        <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 w-fit">
          <button
            className="p-2 hover:bg-gray-50 rounded-l-lg transition-colors disabled:opacity-50"
            onClick={() => handleQtyChange(cartId, item.product_item_id, item.qty - 1)}
            disabled={item.qty <= 1}
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          <span className="px-4 py-1 font-medium text-gray-800 min-w-[3rem] text-center">
            {item.qty}
          </span>
          <button
            className="p-2 hover:bg-gray-50 rounded-r-lg transition-colors"
            onClick={() => handleQtyChange(cartId, item.product_item_id, item.qty + 1)}
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <p className="text-xl sm:text-2xl font-bold text-gray-800 w-28 text-right">
          ${itemTotal.toFixed(2)}
        </p>
        <button
          onClick={() => confirmDelete(cartId)} // Note: This still deletes the whole cart as per your logic
          className="text-gray-400 p-2 rounded-full hover:bg-red-100 hover:text-red-500 transition-all"
          aria-label="Delete Cart"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}