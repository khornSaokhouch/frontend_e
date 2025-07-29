"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "../../store/useProductStore";
import { useShoppingCartStore } from "../../store/useShoppingCart";
import { useUserStore } from "../../store/userStore";
import { useFavouritesStore } from "../../store/useFavouritesStore"; // ✅ Import this!
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProductDetails({ productId }) {
  const userId = useUserStore((state) => state.user?.id);
  const { product, loading, error, fetchProduct } = useProductStore();
  const { createCart } = useShoppingCartStore();
  const { addFavourite } = useFavouritesStore(); // ✅ Use it
  const [favourited, setFavourited] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  const handleFavouriteClick = async () => {
    if (!userId) {
      toast.error("You need to be logged in to add favourites.");
      return;
    }

    if (!product?.id) {
      toast.error("Invalid product.");
      return;
    }

    try {
      toast.loading("Adding to favourites...");
      await addFavourite({
        user_id: userId,
        product_id: product.id,
      });
      setFavourited(true);
      toast.dismiss();
      toast.success("Added to favourites!");
    } catch (err) {
      toast.dismiss();
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

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>No product found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 rounded-lg shadow-xl bg-white">
      {/* Product Image & Actions */}
      <div className="relative">
        {product.product_image_url && (
          <Image
            src={product.product_image_url}
            alt={product.name}
            width={600}
            height={400}
            className="w-full h-96 object-contain rounded-lg"
          />
        )}
        <button
          onClick={handleFavouriteClick}
          className={`absolute top-2 right-2 bg-white rounded-full p-2 shadow transition hover:bg-gray-100 ${
            favourited ? "text-red-500" : "text-gray-500"
          }`}
          aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>

      {/* Product Details */}
      <div className="mt-4">
        <h2 className="text-3xl font-bold mb-2 text-gray-800">{product.name}</h2>
        <p className="mb-4 text-gray-700">{product.description || "No description."}</p>
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-gray-800">Price: ${product.price}</p>
          <button
            onClick={handleAddToCart}
            className="bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 transition"
          >
            <ShoppingCart className="w-4 h-4 mr-2 inline-block" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
