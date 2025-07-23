"use client";

import React, { useEffect, useState } from "react";
import { useCategoryStore } from "../../../store/useCategoryStore"; // adjust the path as needed

export default function CategoriesPage() {
  const { categories, loading, error, fetchCategories } = useCategoryStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">All Categories</h1>

      <input
        type="text"
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/2 p-2 border border-gray-300 rounded mb-6"
      />

      {loading && <p>Loading categories...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !filtered.length && (
        <p className="text-gray-600">No categories found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((category) => (
          <div
            key={category.id}
            className="p-4 border rounded shadow hover:shadow-md transition flex flex-col items-center text-center"
          >
            <img
              src={category.image_url || "/placeholder.jpg"} // adjust field name if different
              alt={category.name}
              className="w-24 h-24 object-cover rounded-full mb-4"
            />
            <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
            {category.description && (
              <p className="text-sm text-gray-600">{category.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
