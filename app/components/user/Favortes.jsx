// File: app/profile/[id]/favorites/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useFavouritesStore } from "../../store/useFavouritesStore";
import { toast } from "react-hot-toast";
import { Heart, PackageX } from "lucide-react";
import { motion } from "framer-motion";

// Import your new components
import FavouriteItemRow from "../../components/user/Favourite/FavouriteItemRow"; 
import Pagination from "../../components/ui/Pagination";
import ConfirmDeletionFavorites from "../../components/user/ConfirmDeletionFavorites";

export default function FavouritesPage() {
  // All your state and logic for deletion remains exactly the same
  const { id: userId } = useParams();
  const { favourites = [], loading, error, fetchFavourites, removeFavourite } = useFavouritesStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const itemsPerPage = 5; // A list view looks better with slightly fewer items per page

  useEffect(() => {
    if (userId) fetchFavourites(userId);
  }, [userId, fetchFavourites]);

  const handleDeleteConfirmation = (favId) => {
    setItemToDelete(favId);
    setShowConfirmDeletion(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await toast.promise(
        removeFavourite(itemToDelete).then(() => fetchFavourites(userId)),
        {
          loading: 'Removing from favourites...',
          success: 'Removed from favourites!',
          error: 'Failed to remove favourite.',
        }
      );
    } finally {
      setShowConfirmDeletion(false);
      setItemToDelete(null);
    }
  };
  
  const handleCancelDelete = () => {
    setShowConfirmDeletion(false);
    setItemToDelete(null);
  };

  // Pagination logic...
  const totalPages = Math.ceil(favourites.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedFavourites = Array.isArray(favourites) ? favourites.slice(startIndex, startIndex + itemsPerPage) : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  // Loading and error states...
  if (loading) return <div className="text-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-500 mx-auto"></div><p className="mt-4 text-gray-600">Loading your favourites...</p></div>;
  if (error) return <p className="text-red-600 text-center py-20">Error: {error}</p>;

  return (
    <div>
      <header className="mb-10">
        <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-red-500"/>
            </div>
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">My Favourites</h1>
                <p className="text-gray-600 mt-1">
                    You have {favourites.length} item{favourites.length !== 1 ? 's' : ''} saved for later.
                </p>
            </div>
        </div>
      </header>

      {displayedFavourites.length > 0 ? (
        <>
          <motion.div 
            className="space-y-5" 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible"
          >
            {displayedFavourites.map((fav) => (
              <motion.div 
                key={fav.id} 
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              >
                {/* We now use the new FavouriteItemRow component */}
                <FavouriteItemRow
                  favourite={fav}
                  onRemove={() => handleDeleteConfirmation(fav.id)}
                />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-12">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-2xl">
          <PackageX className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Your Favourites List is Empty</h2>
          <p className="text-gray-600">Click the heart on any product to save it here for later.</p>
        </div>
      )}

      {/* Your modal still works perfectly */}
      <ConfirmDeletionFavorites
        isOpen={showConfirmDeletion}
        onClose={handleCancelDelete}
        onConfirm={handleDelete}
        itemName="favourite"
      />
    </div>
  );
}