"use client";

import { useEffect, useState, useCallback } from "react";
import { useCategoryStore } from "../../../store/useCategoryStore";
import toast from "react-hot-toast";
import { Plus, Search, Loader2, AlertTriangle } from "lucide-react";
import CategoriesTable from "../../../components/admin/CategoriesTable";
import CategoryForm from "../../../components/admin/CategoryForm";

export default function CategoriesPage() {
  const {
    categories,
    loading,
    error,
    fetchCategories,
    saveCategory,
    deleteCategory,
    search,
    setSearch,
  } = useCategoryStore();

  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openForm = useCallback((category = null) => {
    setEditingCategory(category);
    setCategoryName(category?.name || "");
    setCategoryImage(null);
    setPreviewUrl(category?.image_url || null);
    setSubmitError(null);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleModalCloseAnimation = useCallback(() => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryImage(null);
    setPreviewUrl(null);
    setSubmitError(null);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.size > 2 * 1024 * 1024) {
      toast.error("File is too large. Max 2MB.");
      return;
    }
    setCategoryImage(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setSubmitError("Category name cannot be empty");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await saveCategory({
        id: editingCategory?.id,
        name: categoryName,
        image: categoryImage,
      });
      toast.success(
        editingCategory ? "Category updated!" : "Category created!"
      );
      closeForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      toast.error(message);
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteCategory(deleteConfirmId);
      toast.success("Category deleted.");
      setDeleteConfirmId(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      toast.error(message);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Category Management
          </h1>
          <p className="text-slate-500 mt-1">
            Create, edit, search and delete product categories.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
          {/* Top Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Search (left, fixed width) */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Button (right) */}
            <button
              onClick={() => openForm()}
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold transition"
            >
              <Plus size={18} />
              New Category
            </button>
          </div>

          {/* Category Table or Loader */}
          {loading ? (
            <div className="flex justify-center py-20 text-slate-600">
              <Loader2 className="animate-spin w-6 h-6 mr-3" />
              Loading categories...
            </div>
          ) : error ? (
            <div className="text-center text-red-600 bg-red-50 p-4 rounded-md">
              Error: {error}
            </div>
          ) : (
            <CategoriesTable
              categories={categories}
              search={search}
              setSearch={setSearch}
              openForm={openForm}
              setDeleteConfirmId={setDeleteConfirmId}
            />
          )}
        </div>
      </div>

      {/* Category Modal */}
      <CategoryForm
        isFormOpen={isFormOpen}
        closeForm={closeForm}
        categoryName={categoryName}
        setCategoryName={setCategoryName}
        categoryImage={categoryImage}
        setCategoryImage={setCategoryImage}
        previewUrl={previewUrl}
        setPreviewUrl={setPreviewUrl}
        submitError={submitError}
        setSubmitError={setSubmitError}
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        handleFileChange={handleFileChange}
        handleModalCloseAnimation={handleModalCloseAnimation}
        editingCategory={editingCategory}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4 mx-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            <p className="text-slate-700 text-sm">
              Are you sure you want to delete this category? This action is
              permanent.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-md border border-slate-300 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 px-4 py-2 rounded-md text-white text-sm hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
