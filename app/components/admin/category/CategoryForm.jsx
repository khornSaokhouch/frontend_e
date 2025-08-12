"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2, Upload, Camera, Package } from "lucide-react"
import Image from "next/image"

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
  if (!isFormOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={closeForm}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated Header */}
          <div className="relative h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>

            {/* Floating particles */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.5,
                  }}
                  style={{
                    left: `${10 + i * 15}%`,
                    top: `${20 + (i % 2) * 40}%`,
                  }}
                />
              ))}
            </div>

            <button
              onClick={closeForm}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="absolute bottom-4 left-6 flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm"
              >
                <Package className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl font-bold text-white"
                >
                  {editingCategory ? "Edit Category" : "New Category"}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/80 text-sm"
                >
                  {editingCategory ? "Update category details" : "Create a new product category"}
                </motion.p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Upload Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl -mt-8"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-lg">
                    {previewUrl ? (
                      <Image
                        src={previewUrl || "/placeholder.svg"}
                        alt="Category Preview"
                        width={72}
                        height={72}
                        className="w-full h-full rounded-xl object-cover"
                        onError={() => setPreviewUrl("")}
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Upload className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category Image</label>
                  <label
                    htmlFor="file-upload"
                    className="inline-block cursor-pointer px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-colors"
                  >
                    {categoryImage ? "Change Image" : "Upload Image"}
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB</p>
                </div>
              </motion.div>

              {/* Category Name */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <label htmlFor="categoryName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  id="categoryName"
                  type="text"
                  value={categoryName}
                  onChange={(e) => {
                    setCategoryName(e.target.value)
                    if (submitError) setSubmitError(null)
                  }}
                  placeholder="e.g. Electronics, Clothing, Books"
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors ${
                    submitError ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
                {submitError && <p className="text-red-500 text-xs mt-1">{submitError}</p>}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex gap-4 pt-6 border-t border-gray-100"
              >
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !categoryName.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl font-semibold transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {editingCategory ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5" />
                      {editingCategory ? "Update Category" : "Create Category"}
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default CategoryForm
