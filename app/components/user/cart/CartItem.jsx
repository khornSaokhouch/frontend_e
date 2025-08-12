"use client";

import { Trash2 } from "lucide-react";
import QuantityControl from "./QuantityControl";
import { toast } from "react-hot-toast";

export default function CartItem({ item, onQuantityChange, onDeleteItem }) {
  const product = item.product_item?.product;
  const itemTotal = (product?.price || 0) * item.qty;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 rounded-xl transition-colors duration-200 hover:bg-slate-50">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={product?.product_image_url || "/placeholder.svg"}
          alt={product?.name || "Product"}
          className="w-24 h-24 object-cover rounded-lg shadow-sm"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <h3 className="text-lg font-semibold text-slate-800 truncate" title={product?.name}>
          {product?.name || "Unknown Product"}
        </h3>
        <p className="text-slate-500 text-sm">
          Price: ${product?.price?.toFixed(2) || "0.00"}
        </p>
      </div>

      {/* Actions & Price */}
      <div className="flex items-center gap-4 sm:gap-8">
        <QuantityControl
          quantity={item.qty}
          onIncrease={() => onQuantityChange(item.product_item_id, item.qty + 1)}
          onDecrease={() => onQuantityChange(item.product_item_id, item.qty - 1)}
        />
        
        <p className="text-lg font-bold text-slate-800 w-24 text-right">
          ${itemTotal.toFixed(2)}
        </p>

        {/* <button
          onClick={() => {
            toast((t) => (
              <div className="flex flex-col gap-3">
                <p className="font-semibold">Remove this item from your cart?</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      toast.dismiss(t.id);
                      onDeleteItem(item.product_item_id);
                    }}
                    className="px-4 py-1 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="px-4 py-1 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ));
          }}
          className="text-slate-400 p-2 rounded-full hover:bg-red-100 hover:text-red-500 transition-colors"
          aria-label="Remove item"
        >
          <Trash2 className="w-5 h-5" />
        </button> */}
      </div>
    </div>
  );
}