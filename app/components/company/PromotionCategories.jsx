"use client";

import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { usePromotionsCategoryStore } from "../../store/usePromotionsCategoryStore";
import { useCategoryStore } from "../../store/useCategoryStore";
import { usePromotionsStore } from "../../store/usePromotionsStore";

export default function PromotionCategories({ promotionId: initialPromotionId }) {
  const {
    fetchCategoriesByPromotion,
    attachCategoriesToPromotion,
    detachCategoryFromPromotion,
    loading,
    error,
    categoriesByPromotion,
  } = usePromotionsCategoryStore();

  const { fetchCategories, categories } = useCategoryStore();
  const { promotions, fetchPromotions } = usePromotionsStore();

  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [promotionId, setPromotionId] = useState(initialPromotionId || "");

  useEffect(() => {
    fetchPromotions();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (promotionId) {
      fetchCategoriesByPromotion(promotionId);
      fetchCategories();
    }
  }, [promotionId]);

  const handleAttach = async () => {
    if (!promotionId) {
      toast.error("Please select a promotion first");
      return;
    }

    if (selectedCategoryIds.length === 0) {
      toast.error("Select at least one category");
      return;
    }

    const attachedIds = new Set(categoriesByPromotion.map((cat) => cat.id));
    const alreadyAttached = [];
    const newToAttach = [];

    selectedCategoryIds.forEach((id) => {
      if (attachedIds.has(id)) {
        const cat = categories.find((c) => c.id === id);
        if (cat) alreadyAttached.push(cat.name);
      } else {
        newToAttach.push(id);
      }
    });

    alreadyAttached.forEach((name) => {
      toast(`Already attached ${name}`, { icon: "⚠️" });
    });

    if (newToAttach.length === 0) {
      setSelectedCategoryIds([]);
      return;
    }

    try {
      await attachCategoriesToPromotion(promotionId, newToAttach);
      setSelectedCategoryIds([]);
      await fetchCategoriesByPromotion(promotionId);
      toast.success("Category(s) attached!");
    } catch {
      toast.error("Failed to attach category(s)");
    }
  };

  const handleDetach = async (categoryId) => {
    const category = categoriesByPromotion.find((cat) => cat.id === categoryId);
    try {
      await detachCategoryFromPromotion(promotionId, categoryId);
      await fetchCategoriesByPromotion(promotionId);
      toast.success(`Detached ${category?.name || "category"} successfully!`);
    } catch {
      toast.error("Failed to detach category");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md font-sans">
      <Toaster position="top-right" />
      <h2 className="text-2xl font-semibold text-center mb-6 text-blue-600">
        Manage Categories for Promotions
      </h2>

      {/* Select Promotion Dropdown */}
      <div className="mb-6">
        <label htmlFor="promotion" className="block text-gray-700 font-semibold mb-2">
          Select Promotion:
        </label>

        {promotions.length === 0 ? (
          <p className="text-gray-500 italic">Loading promotions...</p>
        ) : (
          <select
            id="promotion"
            value={promotionId}
            onChange={(e) => {
              const val = e.target.value;
              setPromotionId(val === "" ? "" : Number(val));
            }}
            className="w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Select a Promotion --</option>
            {promotions.map((promo) => (
              <option key={promo.id} value={promo.id}>
                {promo.title || `Promotion #${promo.id}`}
              </option>
            ))}
          </select>
        )}
      </div>

      {!promotionId && (
        <p className="text-red-500 font-semibold text-center mb-6">
          Please select a promotion to manage categories.
        </p>
      )}

      {promotionId && (
        <>
          {loading && <p className="text-gray-600 italic mb-4">Loading...</p>}
          {error && <p className="text-red-600 font-semibold mb-4">Error: {error}</p>}

          <section className="mb-8">
            <h3 className="text-xl font-semibold border-b-2 border-blue-500 pb-1 mb-4 text-blue-600">
              Attached Categories
            </h3>
            {categoriesByPromotion.length === 0 ? (
              <p className="text-gray-500">No categories attached yet.</p>
            ) : (
              <ul className="max-h-48 overflow-y-auto border border-gray-200 rounded-md bg-gray-50">
                {categoriesByPromotion.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex items-center px-4 py-2 border-b last:border-b-0"
                  >
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="w-10 h-10 rounded-full object-cover mr-4 border border-gray-300"
                    />
                    <span className="flex-grow text-gray-800">{cat.name}</span>
                    <button
                      onClick={() => handleDetach(cat.id)}
                      aria-label={`Detach ${cat.name}`}
                      className="text-red-600 hover:text-red-800 transition-colors text-xl font-bold"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="text-xl font-semibold border-b-2 border-blue-500 pb-1 mb-4 text-blue-600">
              Attach Categories
            </h3>
            <select
              multiple
              value={selectedCategoryIds}
              onChange={(e) => {
                const options = e.target.options;
                const selected = [];
                for (let i = 0; i < options.length; i++) {
                  if (options[i].selected) selected.push(Number(options[i].value));
                }
                setSelectedCategoryIds(selected);
              }}
              className="w-full min-h-[6rem] border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleAttach}
              disabled={!promotionId || selectedCategoryIds.length === 0}
              className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                !promotionId || selectedCategoryIds.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Attach Selected Categories
            </button>
          </section>
        </>
      )}
    </div>
  );
}
