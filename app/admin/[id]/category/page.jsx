"use client"

import { useEffect, useState, useCallback } from "react"
import { useCategoryStore } from "../../../store/useCategoryStore"
import { motion } from "framer-motion"
import {
  Plus,
  Search,
  AlertTriangle,
  Grid3X3,
  List,
  Filter,
  Download,
  RefreshCw,
  Package,
  TrendingUp,
  BarChart3,
} from "lucide-react"
import CategoriesTable from "../../../components/admin/category/CategoriesTable"
import CategoryForm from "../../../components/admin/category/CategoryForm"
import { useToast, ToastContainer } from "../../../components/ui/Toast"
import DeleteCategoryModal from "../../../components/admin/category/DeleteCategoryModal"

export default function CategoriesPage() {
  const { categories, loading, error, fetchCategories, saveCategory, deleteCategory, search, setSearch } =
    useCategoryStore()

  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryName, setCategoryName] = useState("")
  const [categoryImage, setCategoryImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [submitError, setSubmitError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [viewMode, setViewMode] = useState("grid") // 'grid' or 'table'

  // Toast notifications
  const { toasts, success, error: showError, warning, info, removeToast } = useToast()

  useEffect(() => {
    fetchCategories()
    success("Categories loaded successfully!", {
      title: "Welcome",
      duration: 3000,
    })
  }, [fetchCategories])

  const openForm = useCallback(
    (category = null) => {
      setEditingCategory(category)
      setCategoryName(category?.name || "")
      setCategoryImage(null)
      setPreviewUrl(category?.image_url || null)
      setSubmitError(null)
      setIsFormOpen(true)
      info(category ? `Editing ${category.name}` : "Creating new category", {
        title: category ? "Edit Mode" : "Create Mode",
        duration: 3000,
      })
    },
    [info],
  )

  const closeForm = useCallback(() => {
    setIsFormOpen(false)
  }, [])

  const handleModalCloseAnimation = useCallback(() => {
    setEditingCategory(null)
    setCategoryName("")
    setCategoryImage(null)
    setPreviewUrl(null)
    setSubmitError(null)
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.size > 2 * 1024 * 1024) {
      showError("File is too large. Maximum size is 2MB.", {
        title: "File Too Large",
        duration: 4000,
      })
      return
    }
    setCategoryImage(file)
    setPreviewUrl(file ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoryName.trim()) {
      setSubmitError("Category name cannot be empty")
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await saveCategory({
        id: editingCategory?.id,
        name: categoryName,
        image: categoryImage,
      })

      success(editingCategory ? `${categoryName} updated successfully!` : `${categoryName} created successfully!`, {
        title: editingCategory ? "Category Updated" : "Category Created",
        duration: 4000,
      })
      closeForm()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error"
      showError(message, {
        title: "Operation Failed",
        duration: 5000,
      })
      setSubmitError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirmId) return

    try {
      const categoryToDelete = categories.find((cat) => cat.id === deleteConfirmId)
      await deleteCategory(deleteConfirmId)
      success(`${categoryToDelete?.name || "Category"} deleted successfully!`, {
        title: "Category Deleted",
        duration: 4000,
      })
      setDeleteConfirmId(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed"
      showError(message, {
        title: "Delete Failed",
        duration: 5000,
      })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
            <p className="text-gray-600 mt-1">Create, edit, and manage product categories</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => openForm()}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Category
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              label: "Total Categories",
              value: categories.length,
              icon: Package,
              color: "blue",
              change: "+12%",
            },
            {
              label: "Active Categories",
              value: categories.filter((cat) => cat.status === "active").length || categories.length,
              icon: Grid3X3,
              color: "green",
              change: "+8%",
            },
            {
              label: "Products",
              value: "1,234",
              icon: TrendingUp,
              color: "purple",
              change: "+23%",
            },
            {
              label: "This Month",
              value: "24",
              icon: BarChart3,
              color: "orange",
              change: "+5%",
            },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm text-${stat.color}-600 mt-1`}>{stat.change} from last month</p>
                </div>
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-2xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors w-80"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  fetchCategories()
                  info("Data refreshed", { duration: 2000 })
                }}
                className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "table" ? "bg-blue-100 text-blue-600" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200/50 shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="text-gray-600 font-medium">Loading categories...</div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-red-600 font-semibold text-lg">Error Loading Categories</div>
                <div className="text-gray-600">{error}</div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fetchCategories()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </motion.button>
              </div>
            </div>
          ) : (
            <CategoriesTable
              categories={categories}
              search={search}
              setSearch={setSearch}
              openForm={openForm}
              setDeleteConfirmId={setDeleteConfirmId}
              viewMode={viewMode}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Category Form Modal */}
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
      <DeleteCategoryModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        category={categories.find((cat) => cat.id === deleteConfirmId)}
        onConfirm={handleDelete}
      />
    </>
  )
}
