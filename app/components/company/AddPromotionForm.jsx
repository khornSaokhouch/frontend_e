"use client";
import React, { useState } from "react";
import { usePromotionsStore } from "../../store/usePromotionsStore";
import { toast } from "react-hot-toast";

const initialState = {
  name: "",
  description: "",
  discount_percentage: 0,
  start_date: "",
  end_date: "",
};

export default function AddPromotionForm({ isOpen, onClose }) {
  const { createPromotion, loading } = usePromotionsStore();
  const [newPromotion, setNewPromotion] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createPromotion(newPromotion);
      toast.success("Promotion created successfully");
      setNewPromotion(initialState);
      onClose(); // Close modal after creation
    } catch (err) {
      toast.error(err.message || "Failed to create promotion");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl p-6 relative animate-fade-in-up">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Create New Promotion</h2>

        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <input
                name="name"
                value={newPromotion.name}
                onChange={handleInputChange}
                className="w-full mt-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Promotion name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <input
                name="description"
                value={newPromotion.description}
                onChange={handleInputChange}
                className="w-full mt-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Optional description"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Discount (%)</label>
              <input
                type="number"
                name="discount_percentage"
                value={newPromotion.discount_percentage}
                onChange={handleInputChange}
                className="w-full mt-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={newPromotion.start_date}
                onChange={handleInputChange}
                className="w-full mt-1 border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">End Date</label>
              <input
                type="date"
                name="end_date"
                value={newPromotion.end_date}
                onChange={handleInputChange}
                className="w-full mt-1 border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>

        {/* Close button top-right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl leading-none"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
