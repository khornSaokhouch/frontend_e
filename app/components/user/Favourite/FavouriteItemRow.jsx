// File: components/user/FavouriteItemRow.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useShoppingCartStore } from "../../../store/useShoppingCart";
import { useUserStore } from "../../../store/userStore";
import { toast } from "react-hot-toast";

export default function FavouriteItemRow({ favourite, onRemove }) {
  const { product } = favourite;
  const userId = useUserStore((state) => state.user?.id);
  const { createCart } = useShoppingCartStore();

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent navigation if the row is wrapped in a link
    if (!userId || !product?.id) return;

    await toast.promise(
      createCart({
        user_id: userId,
        items: [{ product_item_id: product.id, qty: 1 }],
      }),
      {
        loading: "Adding to cart...",
        success: `Added ${product.name} to cart!`,
        error: "Failed to add to cart.",
      }
    );
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
      {/* Image */}
      <Link href={`/details/${product.id}`} className="flex-shrink-0">
        <div className="relative w-32 h-32 rounded-lg overflow-hidden">
          <Image
            src={product?.product_image_url || "/placeholder.svg"}
            alt={product?.name || "Product"}
            layout="fill"
            className="object-cover"
          />
        </div>
      </Link>

      {/* Details */}
      <div className="flex-1 text-center sm:text-left">
        {product.category_name && (
          <p className="text-xs font-semibold text-orange-600 uppercase mb-1">{product.category_name}</p>
        )}
        <Link href={`/details/${product.id}`}>
          <h3 className="text-xl font-bold text-gray-800 hover:text-orange-700 transition-colors">
            {product.name || "Unknown Product"}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {product.description}
        </p>
        <p className="text-lg font-semibold text-gray-900 mt-3">
          ${product.price?.toFixed(2)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <button
          onClick={handleAddToCart}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
        <button
          onClick={onRemove}
          className="w-full sm:w-auto p-3 border border-gray-300 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
          title="Remove from Favourites"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}