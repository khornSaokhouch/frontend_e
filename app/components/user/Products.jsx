"use client";
import React, { useEffect } from "react";
import { useProductStore } from "../../store/useProductStore"; // Adjust path if needed
import { useFavouritesStore } from "../../store/useFavouritesStore"; // Import favourites store
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function ProductsPage() {
  const { id } = useParams();
  const { products, loading, error, fetchAllProducts } = useProductStore();
  const { addFavourite } = useFavouritesStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Handler for add to favourite
  const handleAddFavourite = async (productId) => {
    if (!id) {
      toast.error("User ID not found");
      return;
    }
    try {
      toast.loading("Adding to favourites...");
      await addFavourite({ user_id: id, product_id: productId });
      toast.dismiss(); // dismiss loading
      toast.success("Added to favourites!");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to add favourite: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">All Products</h1>

      {loading && (
        <div className="text-center text-indigo-600 py-10">Loading products...</div>
      )}

      {error && (
        <div className="text-center text-red-600 bg-red-100 p-4 rounded-md">
          Error: {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center text-slate-500 py-10">No products found.</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-slate-200 rounded-lg shadow-sm bg-white hover:shadow-md transition"
            >
              <img
                src={product.product_image_url || product.product_image}
                alt={product.name}
                className="h-48 w-full object-cover rounded-t-lg"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-slate-800 line-clamp-1">
                  {product.name}
                </h2>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-indigo-600 font-semibold text-sm">${product.price}</p>
                <Link
                  href={id ? `/user/${id}/details/${product.id}` : `/details/${product.id}`}
                  className="block text-sm text-indigo-500 hover:underline"
                >
                  View Details
                </Link>
                {/* Add to favourite button */}
                <button
                  onClick={() => handleAddFavourite(product.id)}
                  className="mt-2 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                >
                  Add to Favourite
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
