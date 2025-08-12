"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"


export const ConfirmationModal = ({
isOpen,
onClose,
onConfirm,
title,
children,
}) => {
return (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose} // Close modal on backdrop click
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="rounded-lg shadow-xl p-6 w-full max-w-sm bg-white "
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        >
          <h3 className="text-xl font-bold ">{title}</h3>
          <p className="text-gray-600 mt-2 mb-6 ">{children}</p>
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 font-semibold transition-colors" onClick={onClose}>
              Cancel
            </button>
            <button className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 font-semibold transition-colors" onClick={onConfirm}>
              Confirm Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)
}
