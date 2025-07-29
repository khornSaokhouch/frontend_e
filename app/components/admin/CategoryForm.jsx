"use client";

import React from 'react';
import { ImageIcon, X, Loader2 } from 'lucide-react';

const CategoryForm = ({
  isFormOpen,
  closeForm,
  categoryName,
  setCategoryName,
  categoryImage,
  setCategoryImage,
  previewUrl,
  setPreviewUrl,
  submitError,
  setSubmitError,
  isSubmitting,
  handleSubmit,
  handleFileChange,
  handleModalCloseAnimation,
  editingCategory,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isFormOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onTransitionEnd={() => !isFormOpen && handleModalCloseAnimation()}
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeForm}></div>

      <div
        className={`bg-white w-full max-w-lg rounded-2xl shadow-lg transform transition-all duration-300 mx-4 p-6 sm:p-8 relative z-10 ${
          isFormOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800">
            {editingCategory ? 'Edit Category' : 'New Category'}
          </h2>
          <button
            onClick={closeForm}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-slate-700 mb-1">
              Category Name
            </label>
            <input
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Electronics"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
            <div className="flex items-center gap-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center bg-slate-100 rounded-lg border border-slate-200">
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                </div>
              )}
              <div>
                <label
                  htmlFor="file-upload"
                  className="inline-block cursor-pointer px-4 py-1.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-50"
                >
                  {categoryImage ? 'Change File' : 'Upload Image'}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, up to 2MB.</p>
              </div>
            </div>
          </div>

          {/* Error */}
          {submitError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{submitError}</div>
          )}

          {/* Actions */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
