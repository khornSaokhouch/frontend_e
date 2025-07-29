"use client";

import React, { useEffect, useState, useMemo } from "react";
import { toast, Toaster } from "react-hot-toast";
import { usePromotionsCategoryStore } from "../../store/usePromotionsCategoryStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { usePromotionsStore } from "../../store/usePromotionsStore";
import { ChevronDown, ListPlus, Info } from "lucide-react";

import CategoryCard, { CategoryCardSkeleton } from "./CategoryCard"; // Adjust path if needed

const InitialStatePrompt = () => (
  <div className="text-center py-16 px-6 bg-white rounded-lg border-2 border-dashed border-gray-300">
    <ListPlus className="mx-auto w-12 h-12 text-gray-400" />
    <h3 className="mt-4 text-xl font-semibold text-gray-800">Select a Promotion</h3>
    <p className="mt-2 text-sm text-gray-500">
      Choose a promotion from the dropdown above to manage its associated categories.
    </p>
  </div>
);

export default function PromotionCategories({ promotionId: initialPromotionId }) {
  const {
    fetchCategoriesByPromotion,
    attachCategoriesToPromotion,
    detachCategoryFromPromotion,
    loading: promoCatLoading,
    categoriesByPromotion,
  } = usePromotionsCategoryStore();

  const { fetchCategories, categories: allCategories } = useCategoryStore();
  const { promotions, fetchPromotions } = usePromotionsStore();

  const [promotionId, setPromotionId] = useState(initialPromotionId || "");
  const [actionLoading, setActionLoading] = useState(null); // Tracks loading for a specific category action

  useEffect(() => {
    fetchPromotions();
    fetchCategories();
  }, [fetchPromotions, fetchCategories]);

  useEffect(() => {
    if (promotionId) {
      fetchCategoriesByPromotion(promotionId);
    }
  }, [promotionId, fetchCategoriesByPromotion]);

  const handleAttach = async (categoryId) => {
    setActionLoading(categoryId);
    try {
      await attachCategoriesToPromotion(promotionId, [categoryId]);
      toast.success("Category attached!");
    } catch {
      toast.error("Failed to attach category");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDetach = async (categoryId) => {
    setActionLoading(categoryId);
    try {
      await detachCategoryFromPromotion(promotionId, categoryId);
      toast.success("Category detached!");
    } catch {
      toast.error("Failed to detach category");
    } finally {
      setActionLoading(null);
    }
  };

  const availableCategories = useMemo(() => {
    const attachedIds = new Set(categoriesByPromotion.map((cat) => cat.id));
    return allCategories.filter((cat) => !attachedIds.has(cat.id));
  }, [allCategories, categoriesByPromotion]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      <Toaster position="top-right" />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Link Categories to Promotions</h1>
        <p className="mt-1 text-sm text-gray-600">
          Select a promotion, then add or remove categories to control where it applies.
        </p>
      </div>

      {/* Promotion Selector */}
      <div className="mb-8 max-w-md">
        <label htmlFor="promotion" className="block text-sm font-medium text-gray-700 mb-1">
          Select Promotion
        </label>
        <div className="relative">
          <select
            id="promotion"
            value={promotionId}
            onChange={(e) => setPromotionId(e.target.value ? Number(e.target.value) : "")}
            className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm appearance-none border"
          >
            <option value="">-- Select a Promotion --</option>
            {promotions.map((promo) => (
              <option key={promo.id} value={promo.id}>
                {promo.name}
              </option>
            ))}
          </select>
          <ChevronDown className="h-5 w-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>
      
      {/* Main Content Area */}
      {!promotionId ? (
        <InitialStatePrompt />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Available Categories */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Categories</h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {promoCatLoading ? (
                [...Array(5)].map((_, i) => <CategoryCardSkeleton key={i} />)
              ) : availableCategories.length > 0 ? (
                availableCategories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    type="attach"
                    onAction={handleAttach}
                    loading={actionLoading === cat.id}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>All categories are attached.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Attached Categories */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Attached Categories</h3>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {promoCatLoading ? (
                [...Array(3)].map((_, i) => <CategoryCardSkeleton key={i} />)
              ) : categoriesByPromotion.length > 0 ? (
                categoriesByPromotion.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    type="detach"
                    onAction={handleDetach}
                    loading={actionLoading === cat.id}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                  <Info className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="font-medium">No categories attached.</p>
                  <p className="text-sm">Click a category on the left to add it.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}