"use client";

import React, { useEffect, useState } from 'react';
import { usePromotionsStore } from '../../store/usePromotionsStore';
import { toast } from 'react-hot-toast';

export default function EditPromotionModal({ promotion, isOpen, onClose }) {
  const { updatePromotion, loading } = usePromotionsStore();
  const [formData, setFormData] = useState(promotion);

  useEffect(() => {
    if (promotion) {
      setFormData({
        ...promotion,
        start_date: promotion.start_date.split('T')[0],
        end_date: promotion.end_date.split('T')[0],
      });
    }
  }, [promotion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePromotion(formData.id, formData);
      toast.success("Promotion updated successfully");
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to update promotion");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 relative animate-fade-in-up">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Edit Promotion</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Promotion name"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <input
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Discount (%)</label>
              <input
                type="number"
                name="discount_percentage"
                value={formData.discount_percentage}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 p-2 rounded-md"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
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
              className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:bg-green-300"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>

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
