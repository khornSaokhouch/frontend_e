"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "../../store/useProductStore";
import { useShoppingCartStore } from "../../store/useShoppingCart";
import { useUserStore } from "../../store/userStore";
import { useFavouritesStore } from "../../store/useFavouritesStore";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import Products from "./Products"; // This will render the grid of related products

export default function ProductDetails({ productId }) {
  // --- ALL OF YOUR EXISTING STATE AND LOGIC REMAINS UNCHANGED ---
  const userId = useUserStore((state) => state.user?.id);
  const { product, loading, error, fetchProduct } = useProductStore();
  const { createCart } = useShoppingCartStore();
  const { addFavourite, favourites } = useFavouritesStore();

  const [quantity, setQuantity] = useState(1);
  const [isFavourited, setIsFavourited] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  useEffect(() => {
    if (product && Array.isArray(favourites)) {
      const isFav = favourites.some((fav) => fav.product_id === product.id);
      setIsFavourited(isFav);
    }
  }, [product, favourites]);

  const handleFavouriteClick = async () => {
    if (!userId) return toast.error("Please log in to add favourites.");
    if (!product?.id) return;
    const newFavouritedState = !isFavourited;
    setIsFavourited(newFavouritedState);
    try {
      await addFavourite({ user_id: userId, product_id: product.id });
      toast.success(
        newFavouritedState ? "Added to favourites!" : "Removed from favourites."
      );
    } catch (err) {
      setIsFavourited(!newFavouritedState);
      toast.error("Failed to update favourites.");
    }
  };

  const handleAddToCart = async () => {
    if (!userId) return toast.error("Please log in to add items to your cart.");
    if (!product?.id) return;
    await toast.promise(
      createCart({
        user_id: userId,
        items: [{ product_item_id: product.id, qty: quantity }],
      }),
      {
        loading: "Adding to cart...",
        success: `${quantity} x ${product.name} added!`,
        error: (err) => err.message || "Failed to add to cart.",
      }
    );
  };
  // --- END OF LOGIC SECTION ---

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[80vh]">
  //       <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500"></div>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-16 h-16 text-red-400 mb-4" />
        <h3 className="text-2xl font-bold text-red-800">An Error Occurred</h3>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-20 text-lg">Product not found.</div>;
  }

  // --- NEW, STRUCTURED DESIGN WITH RELATED PRODUCTS SECTION ---
  return (
    <div className="bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section 1: Main Product Details */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bg-white p-6 sm:p-8 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Image Column */}
          <div className="w-full aspect-square relative rounded-xl overflow-hidden shadow-md">
            {product.product_image_url && (
              <Image
                src={product.product_image_url}
                alt={product.name}
                layout="fill"
                className="object-cover"
                priority
              />
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col h-full">
            <div>
              {product.category && (
                <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  {product.category_name || product.category}
                </span>
              )}
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {product.name}
              </h1>
              <p className="mt-4 text-3xl font-bold text-gray-800">
                ${product.price?.toFixed(2)}
              </p>
              <div className="mt-4 flex items-center">
                <ShieldCheck className="w-5 h-5 text-green-500 mr-2" />
                <p className="text-sm text-green-600 font-medium">
                  In Stock & Ready to Ship
                </p>
              </div>
              <div className="mt-6 prose prose-slate max-w-none text-gray-600">
                <p>{product.description || "No description available."}</p>
              </div>
            </div>

            {/* Action Area */}
            <div className="mt-auto pt-8">
              <div className="flex items-center gap-4 mb-6">
                <p className="font-semibold text-gray-700">Quantity:</p>
                <div className="flex items-center rounded-full border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 text-gray-600 hover:bg-gray-100 rounded-l-full disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 text-gray-600 hover:bg-gray-100 rounded-r-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-stretch gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-orange-600 text-white py-4 px-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-orange-700 transition shadow-lg shadow-orange-500/20"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleFavouriteClick}
                  className="p-4 border border-gray-300 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition"
                  aria-label="Add to favourites"
                >
                  <Heart
                    className={`w-6 h-6 ${
                      isFavourited
                        ? "fill-red-500 stroke-red-500"
                        : "fill-transparent"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Related Products */}
        <section className="mt-20">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              You Might Also Like
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Customers who viewed this item also viewed
            </p>
          </div>
          <div className="mt-10">
            <Products limit={8} />
          </div>
        </section>
      </main>
    </div>
  );
}
