"use client";
import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Heart, ShoppingCart } from "lucide-react";
import { useShoppingCartStore } from "../../store/useShoppingCart";
import { useUserStore } from "../../store/userStore";

export default function ProductCard({ product, onAddFavourite, isFavourite }) {
  const userId = useUserStore(state => state.user?.id);
  const [favourited, setFavourited] = useState(isFavourite || false);
  const { createCart } = useShoppingCartStore();

  const handleFavouriteClick = async () => {
    if (!userId) {
      toast.error("You need to be logged in to add favourites.");
      return;
    }

    try {
      await onAddFavourite(product.id);
      setFavourited(true);
    } catch (err) {
      toast.error("Failed to add favourite: " + err.message);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("User ID not found");
      return;
    }

    if (!product?.id) {
      toast.error("Invalid product.");
      return;
    }

    try {
      toast.loading("Adding to cart...");
      await createCart({
        user_id: userId,
        items: [
          {
            product_item_id: product.id,
            qty: 1,
          },
        ],
      });
      toast.dismiss();
      toast.success("Added to cart!");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to add to cart: " + err.message);
    }
  };

  return (
    <div className="border border-slate-200 rounded-lg shadow-sm bg-white hover:shadow-md transition relative">
      <img
        src={product.product_image_url || product.product_image || "/placeholder.svg"}
        alt={product.name}
        className="h-48 w-full object-cover rounded-t-lg"
      />

      {/* Favourite Icon */}
      <button
        onClick={handleFavouriteClick}
        className="absolute top-3 right-3 text-red-500 hover:text-red-600"
        title="Add to Favourites"
      >
        <Heart
          className={`w-6 h-6 ${favourited ? "fill-red-500" : "fill-none"}`}
          strokeWidth={2}
        />
      </button>

      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold text-slate-800 line-clamp-1">
          {product.name}
        </h2>
        <p className="text-sm text-slate-500 line-clamp-2">
          {product.description || "No description"}
        </p>
        <p className="text-indigo-600 font-semibold text-sm">${product.price}</p>

        <Link
          href={userId ? `/user/${userId}/details/${product.id}` : `/details/${product.id}`}
          className="block text-sm text-indigo-500 hover:underline"
        >
          View Details
        </Link>

        <button
          className="mt-2 w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
