// /app/admin/[id]/categories/page.jsx (or wherever this page lives)

"use client";

import React, { useEffect, useState } from "react";
import { useCategoryStore } from "../../../store/useCategoryStore";
import { Search } from "lucide-react";

// Import the new components
import CategoryCard from "../../../components/company/categories/CategoryCard";
import CategoryCardSkeleton from "../../../components/company/categories/CategoryCardSkeleton";

export default function CategoriesPage() {
  const { categories, loading, error, fetchCategories } = useCategoryStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    if (loading) {
      // Show a grid of skeletons while loading
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <CategoryCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-500 py-10">Error: {error}</p>;
    }

    if (filteredCategories.length === 0) {
      return (
        <p className="text-center text-slate-500 py-10">
          No categories found. Try adjusting your search.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          {/* Main title is now in the Navbar, so this is a subtitle */}
          <p className="text-slate-500">
            Manage and browse all product categories.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      {renderContent()}
    </div>
  );
}