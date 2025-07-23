"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useFavouritesStore } from "../../../store/useFavouritesStore";
import { toast } from "react-hot-toast";
import { MoreHorizontal, ShoppingCart, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

// Confirm deletion popup component
const ConfirmDeletion = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p className="mb-6">
          Are you sure you want to delete this {itemName}?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default function FavouritesPage() {
  const { id } = useParams();
  const {
    favourites = [],
    loading,
    error,
    fetchFavourites,
    removeFavourite,
  } = useFavouritesStore();

  const [showDropdowns, setShowDropdowns] = useState({});
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const toggleDropdown = (index) => {
    setShowDropdowns((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (id) {
      fetchFavourites(id);
    }
  }, [id]);

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedFavourites = Array.isArray(favourites)
    ? favourites.slice(startIndex, startIndex + itemsPerPage)
    : [];

  const totalPages = Math.ceil(favourites.length / itemsPerPage);

  if (loading) return <p className="text-center">Loading favourites...</p>;
  if (error) return <p className="text-red-600 text-center">Error: {error}</p>;
  if (!favourites || favourites.length === 0)
    return <p className="text-center">No favourites found for this user.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-md p-4 mb-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-800">My Favorites</h1>
      </div>

      <ul className="space-y-4">
        {displayedFavourites.map((fav, index) => (
          <li
            key={fav?.id || index}
            className="bg-white rounded-md shadow-sm flex items-center justify-between p-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={fav?.product?.product_image_url || "/placeholder.jpg"}
                alt={fav?.product?.name || "Product Image"}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-semibold text-lg text-gray-800">
                  {fav?.product?.name || "No Product Name"}
                </p>
                <p className="text-sm text-gray-600">
                  ${fav?.product?.price ?? "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="bg-white hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-md focus:outline-none transition-colors duration-200">
                <ShoppingCart className="h-5 w-5" />
              </button>

              <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200">
                Buy Now <ShoppingCart className="h-5 w-5 inline-block ml-1" />
              </button>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown(index)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <MoreHorizontal className="h-6 w-6" />
                </button>
                {showDropdowns[index] && (
                  <motion.div
                    className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-md origin-top-right z-10"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: showDropdowns[index] ? 1 : 0,
                      opacity: showDropdowns[index] ? 1 : 0,
                    }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                  >
                    <div className="py-1">
                      <button
                        onClick={() => handleDeleteConfirmation(fav?.id)}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {favourites.length > itemsPerPage && currentPage < totalPages && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleNextPage}
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            Load More
          </button>
        </div>
      )}

      {/* Confirm Deletion Modal */}
      <ConfirmDeletion
        isOpen={showConfirmDeletion}
        onClose={handleCancelDelete}
        onConfirm={handleDelete}
        itemName="favourite"
      />
    </div>
  );
}
