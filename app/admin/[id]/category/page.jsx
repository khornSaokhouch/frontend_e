'use client';

import { useEffect, useState, useMemo } from 'react';
import { useCategoryStore } from '../../../store/useCategoryStore';
import toast from 'react-hot-toast';

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

  const [editingCategory, setEditingCategory] = useState(null); // {id, name, image_url?}
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null); // File object
  const [previewUrl, setPreviewUrl] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const lower = search.toLowerCase();
    return categories.filter(cat => cat.name.toLowerCase().includes(lower));
  }, [categories, search]);

  const openForm = (category = null) => {
    setEditingCategory(category);
    setCategoryName(category?.name || '');
    setCategoryImage(null);
    setPreviewUrl(category?.image_url || null);
    setSubmitError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryImage(null);
    setPreviewUrl(null);
    setSubmitError(null);
    setIsFormOpen(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCategoryImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setSubmitError('Category name cannot be empty');
      return;
    }
    setIsSubmitting(true);
    try {
      await saveCategory({
        id: editingCategory?.id,
        name: categoryName,
        image: categoryImage,
      });
      toast.success(editingCategory ? 'Category updated' : 'Category created');
      closeForm();
    } catch (err) {
      toast.error(err.message || 'Failed to save category');
      setSubmitError(err.message);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteCategory(deleteConfirmId);
      toast.success('Category deleted');
      setDeleteConfirmId(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Category Management</h1>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow rounded border border-gray-300 px-3 py-2"
        />
        <button
          onClick={() => openForm()}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          New Category
        </button>
      </div>

      {loading && <p>Loading categories...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && filteredCategories.length === 0 && (
        <p className="text-gray-500">No categories found.</p>
      )}

      <ul className="divide-y divide-gray-200 border rounded">
        {filteredCategories.map((cat) => (
          <li key={cat.id} className="flex justify-between items-center px-4 py-2">
            <div className="flex items-center gap-4">
              {cat.image_url && (
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="h-12 w-12 object-cover rounded"
                />
              )}
              <span>{cat.name}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openForm(cat)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteConfirmId(cat.id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for Add/Edit */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
            <h2 className="text-lg font-semibold mb-4">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 mb-3"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-3"
              />
              {previewUrl && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
              {submitError && <p className="text-red-600 mb-3">{submitError}</p>}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this category?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
