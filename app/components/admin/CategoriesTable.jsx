// components/CategoriesTable.tsx
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ImageIcon, Edit, Trash2, Archive } from "lucide-react";
import { useParams } from "next/navigation";



const CategoriesTable = ({
  categories,
  search,
  openForm,
  setDeleteConfirmId,
}) => {
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const categoriesPerPage = 5; // Number of categories per page

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const lower = search.toLowerCase();
    return categories.filter((cat) => cat.name.toLowerCase().includes(lower));
  }, [categories, search]);

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage); // Calculate total pages

  // Calculate the categories to display on the current page
  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * categoriesPerPage;
    const endIndex = startIndex + categoriesPerPage;
    return filteredCategories.slice(startIndex, endIndex);
  }, [filteredCategories, currentPage, categoriesPerPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages)); // Increment page, but not beyond total pages
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // Decrement page, but not below 1
  };

  return (
    <>
      {filteredCategories.length === 0 ? (
        <div className="text-center py-10 px-6 border-2 border-dashed border-slate-200 rounded-lg">
          <Archive className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-2 text-lg font-medium text-slate-800">
            No Categories Found
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {search ? "Try adjusting your search." : "Get started by creating a new category."}
          </p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-slate-200">
            {paginatedCategories.map((cat) => (
              <li
                key={cat.id}
                className="flex justify-between items-center py-4 px-2 hover:bg-slate-50 rounded-md transition-colors"
              >
                <Link
                  href={`/admin/${id}/category/${cat.id}`}
                  className="flex items-center gap-4 flex-1"
                >
                  {cat.image_url ? (
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      className="h-12 w-12 object-cover rounded-md bg-slate-100"
                    />
                  ) : (
                    <div className="h-12 w-12 flex items-center justify-center bg-slate-100 rounded-md">
                      <ImageIcon className="h-6 w-6 text-slate-400" />
                    </div>
                  )}
                  <span className="font-medium text-slate-700">{cat.name}</span>
                </Link>

                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => openForm(cat)}
                    className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(cat.id)}
                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CategoriesTable;