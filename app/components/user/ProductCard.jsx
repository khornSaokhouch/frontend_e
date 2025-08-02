"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Heart, ShoppingCart, Percent } from "lucide-react";
import { useShoppingCartStore } from "../../store/useShoppingCart";
import { useUserStore } from "../../store/userStore";
import { usePromotionsCategoryStore } from "../../store/usePromotionsCategoryStore";

export default function ProductCard({ product, onAddFavourite, isFavourite }) {
  const userId = useUserStore((state) => state.user?.id);
  const [favourited, setFavourited] = useState(isFavourite || false);
  const { createCart } = useShoppingCartStore();

  // Get promotion ID if exists
  const promotionId = product.promotion?.id;
  // Zustand store for categories by promotion
  const {
    categoriesByPromotion,
    loading,
    error,
    fetchCategoriesByPromotion,
  } = usePromotionsCategoryStore();

  // Fetch categories when promotionId changes
  useEffect(() => {
    if (promotionId) {
      fetchCategoriesByPromotion(promotionId);
    }
  }, [promotionId, fetchCategoriesByPromotion]);

  // Check if product has promotion with discount_percentage
  const hasPromotion = product.promotion && product.promotion.discount_percentage > 0;
  const discount = hasPromotion ? product.promotion.discount_percentage : 0;
  const discountedPrice = hasPromotion
    ? product.price - (product.price * discount) / 100
    : product.price;

  const handleFavouriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast.error("You need to be logged in to add favourites.");
      return;
    }
    try {
      setFavourited(!favourited);
      await onAddFavourite(product.id);
    } catch (err) {
      setFavourited(favourited);
      toast.error("Failed to update favourite: " + err.message);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    if (!product?.id) {
      toast.error("Invalid product.");
      return;
    }

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

  return (
    <Link
      href={userId ? `/user/${userId}/details/${product.id}` : `/details/${product.id}`}
      className="group block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="relative">
        {/* Bigger Promotion Badge */}
        {hasPromotion && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-sm font-extrabold px-3 py-1 rounded-full z-10 shadow-lg flex items-center gap-1">
            <Percent className="w-4 h-4" />
            {discount}% OFF
          </div>
        )}

        {/* Image Container */}
        <div className="overflow-hidden h-52">
          <img
            src={product.product_image_url || product.product_image || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
          />
        </div>

        {/* Favourite Icon */}
        <button
          onClick={handleFavouriteClick}
          className="absolute top-3 right-3 bg-white/70 backdrop-blur-sm p-2 rounded-full text-red-500 transition hover:bg-white hover:text-red-600"
          title="Add to Favourites"
        >
          <Heart
            className={`w-5 h-5 transition-all ${
              favourited ? "fill-red-500 stroke-red-500" : "fill-transparent"
            }`}
            strokeWidth={2}
          />
        </button>

        {/* Add to Cart Button */}
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
        {/* Display categories related to the promotion */}
        {loading && <p className="text-sm text-gray-500">Loading categories...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {categoriesByPromotion.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-2">
            {categoriesByPromotion.map((cat) => (
              <li
                key={cat.id}
                className="text-xs font-semibold text-orange-600 uppercase bg-orange-100 px-2 py-1 rounded"
              >
                {cat.name}
              </li>
            ))}
          </ul>
        )}

        <h2 className="text-lg font-bold text-gray-800 truncate" title={product.name}>
          {product.name}
        </h2>
        <p className="text-sm text-gray-500 mt-1 h-10 line-clamp-2">
          {product.description || "No description available."}
        </p>
        <div className="mt-4 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-xl font-extrabold text-gray-900">${discountedPrice.toFixed(2)}</p>
            {hasPromotion && (
              <p className="line-through text-gray-500 text-sm">${product.price.toFixed(2)}</p>
            )}
          </div>
          {hasPromotion && (
            <p className="text-green-600 text-xs font-semibold">
              You save ${(product.price - discountedPrice).toFixed(2)}!
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
