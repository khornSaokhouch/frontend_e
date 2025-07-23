"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "../../store/useProductStore"; // Adjust path if needed
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react"; // Add this
import { toast } from "react-hot-toast";

export default function ProductDetails({ productId }) {
  const { product, loading, error, fetchProduct } = useProductStore();
  const [isFavourite, setIsFavourite] = useState(false);  // Example state

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
    // Placeholder for checking if product is already a favourite
    //  setIsFavourite(checkIfFavourite(productId));
  }, [productId, fetchProduct]);

  // Placeholder function (replace with actual implementation)
  const checkIfFavourite = (id) => {
    // Here is what must happen
    // - Use cookie or localStorage to check
    // - Check from supabase user database
    return false;
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    toast.success("Added to cart");
  };

  const toggleFavourite = () => {
    // - Add logic to connect it
    // - Add favourite to supabase and local database if avaliable
    setIsFavourite(!isFavourite);
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
        {/*  Heart button to add function */}
        <button
          onClick={toggleFavourite}
          className={`absolute top-2 right-2 bg-white rounded-full p-2 shadow transition hover:bg-gray-100 ${
            isFavourite ? "text-red-500" : "text-gray-500"
          }`}
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