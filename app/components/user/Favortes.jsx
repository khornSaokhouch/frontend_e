"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useFavouritesStore } from "../../store/useFavouritesStore";
import { toast } from "react-hot-toast";
import { Trash2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import ConfirmDeletionFavorites from "../../components/user/ConfirmDeletionFavorites";

export default function Favourites() {
  const { id } = useParams();
  const {
    favourites = [],
    loading,
    error,
    fetchFavourites,
    removeFavourite,
  } = useFavouritesStore();

  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (id) {
      fetchFavourites(id);
    }
  }, [id, fetchFavourites]);

  const handleDeleteConfirmation = (favId) => {
    setItemToDelete(favId);
    setShowConfirmDeletion(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      toast.loading("Removing...");
      await removeFavourite(itemToDelete);
      await fetchFavourites(id);
      toast.dismiss();
      toast.success("Favourite removed!");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to remove favourite.");
    } finally {
      setShowConfirmDeletion(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDeletion(false);
    setItemToDelete(null);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedFavourites = Array.isArray(favourites)
    ? favourites.slice(startIndex, startIndex + itemsPerPage)
    : [];

  const totalPages = Math.ceil(favourites.length / itemsPerPage);

  if (loading) return <p className="text-center text-gray-600">Loading favourites...</p>;
  if (error) return <p className="text-red-600 text-center">Error: {error}</p>;
  if (!Array.isArray(favourites) || favourites.length === 0)
    return <p className="text-center text-gray-500">No favourites found for this user.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">My Favourites</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedFavourites.map((fav, index) => {
          const product = fav?.product || {};
          return (
            <motion.div
              key={fav?.id || index}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={product.product_image_url || "/placeholder.jpg"}
                alt={product.name || "Product Image"}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-gray-600 mt-1 mb-3">
                  {typeof product.price === "number" ? `$${product.price.toFixed(2)}` : "N/A"}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  className="p-2 text-green-600 hover:text-green-600 transition"
                  title="Add to cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>

                <button
                  onClick={() => handleDeleteConfirmation(fav?.id)}
                  className="p-2 text-red-500 hover:text-red-500 transition"
                  title="Remove"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {favourites.length > itemsPerPage && currentPage < totalPages && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition"
          >
            Load More
          </button>
        </div>
      )}

      <ConfirmDeletionFavorites
        isOpen={showConfirmDeletion}
        onClose={handleCancelDelete}
        onConfirm={handleDelete}
        itemName="favourite"
      />
    </div>
  );
}
