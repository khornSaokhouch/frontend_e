"use client";
import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Heart, ShoppingCart } from "lucide-react";
import { useShoppingCartStore } from "../../store/useShoppingCart";
import { useUserStore } from "../../store/userStore";

export default function ProductCard({ product, onAddFavourite, isFavourite }) {
  // --- ALL YOUR ORIGINAL LOGIC IS PRESERVED ---
  const userId = useUserStore(state => state.user?.id);
  const [favourited, setFavourited] = useState(isFavourite || false);
  const { createCart } = useShoppingCartStore();

  const handleFavouriteClick = async (e) => {
    e.preventDefault(); // Prevent link navigation when clicking the heart
    e.stopPropagation();

    if (!userId) {
      toast.error("You need to be logged in to add favourites.");
      return;
    }
    try {
      // We toggle the favourite state visually immediately for better UX
      setFavourited(!favourited);
      await onAddFavourite(product.id);
      // If the API call succeeds, the state is already correct.
      // If it fails, we revert the visual state.
    } catch (err) {
      setFavourited(favourited); // Revert on failure
      toast.error("Failed to update favourite: " + err.message);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent link navigation when clicking the cart
    e.stopPropagation();

    if (!userId) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    if (!product?.id) {
      toast.error("Invalid product.");
      return;
    }

    // Use toast.promise for a cleaner UX
    await toast.promise(
      createCart({
        user_id: userId,
        items: [{ product_item_id: product.id, qty: 1 }],
      }),
      {
        loading: "Adding to cart...",
        success: "Added to cart!",
        error: (err) => err.message || "Failed to add to cart.",
      }
    );
  };
  // --- END OF ORIGINAL LOGIC ---

  // --- NEW DESIGNED JSX ---
  return (
    // The entire card is now a link and a "group" for hover effects
    <Link
      href={userId ? `/user/${userId}/details/${product.id}` : `/details/${product.id}`}
      className="group block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative">
        {/* Image Container with Zoom Effect */}
        <div className="overflow-hidden h-52">
          <img
            src={product.product_image_url || product.product_image || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>

        {/* Favourite Icon with improved styling */}
        <button
          onClick={handleFavouriteClick}
          className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-2 rounded-full text-red-500 transition hover:bg-white hover:text-red-600"
          title="Add to Favourites"
        >
          <Heart
            className={`w-5 h-5 transition-all ${favourited ? "fill-red-500 stroke-red-500" : "fill-transparent"}`}
            strokeWidth={2}
          />
        </button>

        {/* Add to Cart Button (appears on hover) */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-3 right-3 bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-orange-700"
          title="Add to Cart"
        >
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-5">
        {product.category && (
          <p className="text-xs font-semibold text-orange-600 uppercase mb-2">
            {product.category}
          </p>
        )}
        <h2 className="text-lg font-bold text-gray-800 truncate" title={product.name}>
          {product.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1 h-10 line-clamp-2">
          {product.description || "No description available."}
        </p>
        <div className="mt-4">
          <p className="text-xl font-extrabold text-gray-900">
            ${product.price?.toFixed(2) || '0.00'}
          </p>
        </div>
      </div>
    </Link>
  );
}