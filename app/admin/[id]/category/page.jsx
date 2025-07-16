'use client';

import { useEffect, useState, useMemo } from 'react';
import { useCategoryStore } from '../../../store/useCategoryStore';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Image as ImageIcon,
  Edit,
  Trash2,
  X,
  Loader2,
  Archive,
} from 'lucide-react';

export default function CategoriesPage() {
  // --- All your existing state and logic remains the same ---
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
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
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
    setIsFormOpen(false);
  };

  const handleModalCloseAnimation = () => {
    setEditingCategory(null);
    setCategoryName('');
    setCategoryImage(null);
    setPreviewUrl(null);
    setSubmitError(null);
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("File is too large. Max 2MB.");
        return;
      }
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
    setSubmitError(null);
    try {
      await saveCategory({
        id: editingCategory?.id,
        name: categoryName,
        image: categoryImage,
      });
      toast.success(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
      closeForm();
    } catch (err) {
      const errorMessage = err.message || 'An unexpected error occurred.';
      toast.error(errorMessage);
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteCategory(deleteConfirmId);
      toast.success('Category deleted successfully!');
      setDeleteConfirmId(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  // --- UI Rendering ---
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            Category Management
          </h1>
          <p className="mt-1 text-slate-500">
            Browse, create, edit, and delete your product categories.
          </p>
        </header>

        <div className="bg-white  p-6 rounded-xl shadow-md">
{/* Toolbar */}
<div className="mb-6 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
  {/* Search bar takes up 2/3 of the space on sm screens and up */}
  <div className="relative w-full sm:col-span-2">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
    <input
      type="text"
      placeholder="Search categories..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Button takes up 1/3 of the space */}
 <button
  onClick={() => openForm()}
  className="w-full sm:min-w-48 flex items-center justify-center gap-2 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
>
  <Plus size={20} />
  New Category
</button>
</div>

          {/* Main Content Area */}
          <div className="space-y-4">
            {loading && (
              <div className="flex justify-center items-center p-10">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                <span className="ml-3 text-slate-600">Loading categories...</span>
              </div>
            )}
            {error && (
              <p className="text-center text-red-600 bg-red-50 p-4 rounded-lg">Error: {error}</p>
            )}
            {!loading && !error && (
              <>
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-10 px-6 border-2 border-dashed border-slate-200 rounded-lg">
                    <Archive className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-2 text-lg font-medium text-slate-800">No Categories Found</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {search ? "Try adjusting your search." : "Get started by creating a new category."}
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-200">
                    {filteredCategories.map((cat) => (
                      <li key={cat.id} className="flex justify-between items-center py-4 px-2 hover:bg-slate-50 rounded-md transition-colors">
                        <div className="flex items-center gap-4">
                          {cat.image_url ? (
                            <img src={cat.image_url} alt={cat.name} className="h-12 w-12 object-cover rounded-md bg-slate-100" />
                          ) : (
                            <div className="h-12 w-12 flex items-center justify-center bg-slate-100 rounded-md">
                                <ImageIcon className="h-6 w-6 text-slate-400" />
                            </div>
                          )}
                          <span className="font-medium text-slate-700">{cat.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openForm(cat)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-full transition-colors">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => setDeleteConfirmId(cat.id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      {/* Add/Edit Modal */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isFormOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onTransitionEnd={() => !isFormOpen && handleModalCloseAnimation()}
      >
        <div className="fixed inset-0 bg-black/60" onClick={closeForm}></div>
        <div className={`bg-white p-6 rounded-lg shadow-xl w-full max-w-md m-4 transform transition-all duration-300 ${isFormOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h2>
            <button onClick={closeForm} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                id="categoryName"
                type="text"
                placeholder="e.g., Electronics"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
              <div className="mt-2 flex items-center gap-4">
                  {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-md border border-slate-200" />
                  ) : (
                      <div className="w-20 h-20 flex items-center justify-center bg-slate-100 rounded-md">
                          <ImageIcon className="h-8 w-8 text-slate-400" />
                      </div>
                  )}
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>{categoryImage ? 'Change file' : 'Upload a file'}</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                  </label>
              </div>
               <p className="text-xs text-slate-500 mt-2">PNG, JPG, GIF up to 2MB.</p>
            </div>
            
            {submitError && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{submitError}</p>}
            
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 rounded-md border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${deleteConfirmId ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className="fixed inset-0 bg-black/60" onClick={() => setDeleteConfirmId(null)}></div>
          <div className={`bg-white p-6 rounded-lg shadow-xl w-full max-w-sm m-4 transform transition-all duration-300 ${deleteConfirmId ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
              <h2 className="text-xl font-bold text-slate-800">Confirm Deletion</h2>
              <p className="text-slate-600 mt-2 mb-6">Are you sure you want to delete this category? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                  <button onClick={() => setDeleteConfirmId(null)} className="px-4 py-2 rounded-md border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400">
                      Cancel
                  </button>
                  <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      Delete
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}