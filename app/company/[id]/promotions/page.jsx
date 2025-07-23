"use client";
import React, { useEffect, useState } from 'react';
import { usePromotionsStore } from '../../../store/usePromotionsStore';
import { toast, Toaster } from 'react-hot-toast';

export default function PromotionList() {
  const {
    promotions,
    fetchPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
    loading,
    error,
  } = usePromotionsStore();

  const [newPromotion, setNewPromotion] = useState({
    name: '',
    description: '',
    discount_percentage: 0,
    start_date: '',
    end_date: '',
  });

  const [editingPromotion, setEditingPromotion] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    try {
      await createPromotion(newPromotion);
      toast.success("Promotion created successfully");
      setNewPromotion({
        name: '',
        description: '',
        discount_percentage: 0,
        start_date: '',
        end_date: '',
      });
    } catch (err) {
      toast.error(err.message || "Failed to create promotion");
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingPromotion((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (promotion) => {
    setEditingPromotion(promotion);
  };

  const handleUpdate = async () => {
    try {
      await updatePromotion(editingPromotion.id, editingPromotion);
      toast.success("Promotion updated successfully");
      setEditingPromotion(null);
    } catch (err) {
      toast.error(err.message || "Failed to update promotion");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await deletePromotion(id);
        toast.success("Promotion deleted");
      } catch (err) {
        toast.error(err.message || "Failed to delete promotion");
      }
    }
  };

  if (loading) return <p className="text-blue-600">Loading promotions...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Promotions</h2>

      {/* Create Promotion */}
      <div className="bg-white shadow-md rounded p-6 mb-8">
        <h3 className="text-lg font-bold mb-4">Create New Promotion</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            className="border p-2 rounded"
            name="name"
            value={newPromotion.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
          <input
            className="border p-2 rounded"
            name="description"
            value={newPromotion.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <input
            className="border p-2 rounded"
            type="number"
            name="discount_percentage"
            value={newPromotion.discount_percentage}
            onChange={handleInputChange}
            placeholder="Discount %"
          />
          <input
            className="border p-2 rounded"
            type="date"
            name="start_date"
            value={newPromotion.start_date}
            onChange={handleInputChange}
          />
          <input
            className="border p-2 rounded"
            type="date"
            name="end_date"
            value={newPromotion.end_date}
            onChange={handleInputChange}
          />
        </div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      {/* Edit Promotion */}
      {editingPromotion && (
        <div className="bg-yellow-100 border border-yellow-400 p-6 rounded mb-8">
          <h3 className="text-lg font-bold mb-4">Edit Promotion</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              className="border p-2 rounded"
              name="name"
              value={editingPromotion.name}
              onChange={handleEditChange}
              placeholder="Name"
            />
            <input
              className="border p-2 rounded"
              name="description"
              value={editingPromotion.description}
              onChange={handleEditChange}
              placeholder="Description"
            />
            <input
              className="border p-2 rounded"
              type="number"
              name="discount_percentage"
              value={editingPromotion.discount_percentage}
              onChange={handleEditChange}
              placeholder="Discount %"
            />
            <input
              className="border p-2 rounded"
              type="date"
              name="start_date"
              value={editingPromotion.start_date}
              onChange={handleEditChange}
            />
            <input
              className="border p-2 rounded"
              type="date"
              name="end_date"
              value={editingPromotion.end_date}
              onChange={handleEditChange}
            />
          </div>
          <div className="space-x-2">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Update
            </button>
            <button
              onClick={() => setEditingPromotion(null)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List Promotions */}
      <div className="space-y-4">
        {promotions.map((promo) => (
          <div key={promo.id} className="bg-white shadow p-4 rounded">
            <h4 className="text-lg font-semibold">{promo.name}</h4>
            <p className="text-sm text-gray-700">{promo.description}</p>
            <p className="text-sm text-gray-500">
              {promo.discount_percentage}% off | {promo.start_date} → {promo.end_date}
            </p>
            <div className="mt-2 space-x-2">
              <button
                onClick={() => startEdit(promo)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(promo.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
