// File: app/components/user/cart/CartItem.js
"use client";
import { Trash2 } from "lucide-react";
import QuantityControl from "./QuantityControl";

export default function CartItem({ item, onQuantityChange, onDeleteItem }) {
    const product = item.product_item?.product;
    const itemTotal = (product?.price || 0) * item.qty;
  
    return (
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-4 rounded-xl transition-colors duration-200">
        {/* Product Image */}
        <img
          src={product?.product_image_url || "/placeholder.svg"}
          alt={product?.name || "Product"}
          className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl shadow-md flex-shrink-0"
        />
        
        {/* Product Details */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-gray-800 truncate">
            {product?.name || "Unknown Product"}
          </h3>
          <p className="text-gray-500 text-sm">
            ${product?.price?.toFixed(2) || "0.00"}
          </p>
        </div>
  
        {/* Quantity Controls */}
        <div className="flex-shrink-0">
          <QuantityControl
            quantity={item.qty}
            onIncrease={() => onQuantityChange(item.product_item_id, item.qty + 1)}
            onDecrease={() => onQuantityChange(item.product_item_id, item.qty - 1)}
          />
        </div>
  
        {/* Item Total & Delete */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <p className="text-xl font-bold text-gray-800 w-24 text-right">
            ${itemTotal.toFixed(2)}
          </p>
          <button
            onClick={() => onDeleteItem(item.product_item_id)}
            className="text-gray-400 p-2 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"
            aria-label="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }
  