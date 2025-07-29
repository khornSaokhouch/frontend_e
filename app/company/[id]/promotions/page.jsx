"use client";

import React, { useEffect, useState } from "react";
import { usePromotionsStore } from "../../../store/usePromotionsStore";
import { toast, Toaster } from "react-hot-toast";
import { Plus, Tag, AlertCircle } from "lucide-react";

import AddPromotionForm from "../../../components/company/AddPromotionForm";
import EditPromotionModal from "../../../components/company/EditPromotionModal";
import ConfirmDeleteModalPromotions from "../../../components/company/ConfirmDeleteModalPromotions";
import PromotionCard from "../../../components/company/PromotionCard.jsx";

// Skeleton component for loading state
const PromotionCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm animate-pulse">
    <div className="p-4 border-b">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
    </div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
    <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
      <div className="h-8 bg-gray-200 rounded w-20"></div>
      <div className="h-8 bg-gray-200 rounded w-20"></div>
    </div>
  </div>
);

// Component for empty state
const EmptyState = ({ onAddClick }) => (
  <div className="text-center py-16 px-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
    <div className="mx-auto w-16 h-16 flex items-center justify-center bg-gray-200 rounded-full">
        <Tag className="w-8 h-8 text-gray-500" />
    </div>
    <h3 className="mt-4 text-xl font-semibold text-gray-800">No Promotions Yet</h3>
    <p className="mt-2 text-sm text-gray-500">Get started by creating your first promotional offer.</p>
    <div className="mt-6">
      <button
        onClick={onAddClick}
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Plus className="-ml-1 mr-2 h-5 w-5" />
        Create Promotion
      </button>
    </div>
  </div>
);

// Component for error state
const ErrorDisplay = ({ message }) => (
    <div className="text-center py-16 px-6 bg-red-50 rounded-lg border border-red-200">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="mt-4 text-xl font-semibold text-red-800">Something Went Wrong</h3>
        <p className="mt-2 text-sm text-red-600">{message || "We couldn't load your promotions. Please try again later."}</p>
    </div>
);


export default function PromotionList() {
  const {
    promotions,
    fetchPromotions,
    deletePromotion,
    loading,
    error,
  } = usePromotionsStore();

  const [editingPromotion, setEditingPromotion] = useState(null);
  const [deletingPromotionId, setDeletingPromotionId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleConfirmDelete = async () => {
    if (!deletingPromotionId) return;
    try {
      await deletePromotion(deletingPromotionId);
      toast.success("Promotion deleted successfully");
      setDeletingPromotionId(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete promotion");
    }
  };

  const renderContent = () => {
    // Initial loading state (skeleton)
    if (loading && promotions.length === 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => <PromotionCardSkeleton key={i} />)}
        </div>
      );
    }

    // Error state
    if (error) {
      return <ErrorDisplay message={error} />;
    }

    // Empty state
    if (!loading && promotions.length === 0) {
      return <EmptyState onAddClick={() => setIsAddModalOpen(true)} />;
    }
    
    // Content loaded state
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <PromotionCard
            key={promo.id}
            promotion={promo}
            onEdit={setEditingPromotion}
            onDelete={setDeletingPromotionId}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Promotions</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your company's promotional offers and discount codes.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 sm:mt-0 flex-shrink-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Promotion
        </button>
      </div>

      {/* Main Content Area */}
      <main>
        {renderContent()}
      </main>

      {/* Modals */}
      {isAddModalOpen && (
        <AddPromotionForm
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {editingPromotion && (
        <EditPromotionModal
          isOpen={!!editingPromotion}
          onClose={() => setEditingPromotion(null)}
          promotion={editingPromotion}
        />
      )}

      <ConfirmDeleteModalPromotions
        isOpen={!!deletingPromotionId}
        onClose={() => setDeletingPromotionId(null)}
        onConfirm={handleConfirmDelete}
        loading={loading} // You might want a specific 'deleting' state for the button
      />
    </div>
  );
}