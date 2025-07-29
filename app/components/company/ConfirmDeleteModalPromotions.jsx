"use client";
import React from "react";

export default function ConfirmDeleteModalPromotions({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirm Deletion</h2>
        <p className="mb-6 text-gray-700">
          Are you sure you want to delete this promotion? This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 disabled:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-red-300"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>

        {/* Close icon top right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
