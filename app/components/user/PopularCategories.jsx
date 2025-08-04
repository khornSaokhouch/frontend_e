"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useCategoryStore } from "../../store/useCategoryStore";

const PopularCategories = () => {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Title Bar */}
      <div className="bg-green-500 py-4 px-6 flex items-center justify-between">
        <h2 className="text-white text-lg font-semibold">Popular Categories</h2>
        <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-full hover:bg-gray-300 transition-colors duration-200">
          View All
        </button>
      </div>

      {/* Category List */}
      <div className="flex items-center space-x-4 px-6 py-4 overflow-x-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center justify-center cursor-pointer"
            title={category.name}
          >
            <div className="relative w-24 h-24 rounded-full bg-gray-100 overflow-hidden shadow-sm border border-gray-200 transition-transform duration-300 hover:scale-105 hover:shadow-lg">
              <Image
                src={category.image_url || "/placeholder.jpg"}
                alt={`${category.name} logo`}
                fill
                style={{ objectFit: "contain" }}
                unoptimized
              />
            </div>
            <p className="text-gray-700 mt-2 text-sm text-center truncate max-w-[96px]">
              {category.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularCategories;
