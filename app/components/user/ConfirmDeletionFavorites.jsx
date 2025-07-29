// components/ConfirmDeletionModal.tsx
"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";


const ConfirmDeletionFavorites = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-50"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div
        className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center"
        variants={modalVariants}
      >
        <div className="flex items-center justify-center text-red-500 mb-4">
          <AlertTriangle className="w-6 h-6 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Confirm Deletion</h2>
        </div>
        <p className="mb-6 text-gray-700">
          Are you sure you want to delete this {itemName}? This action cannot be
          undone.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfirmDeletionFavorites;