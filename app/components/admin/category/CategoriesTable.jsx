"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Edit, Trash2, Archive, Eye, Package, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useParams } from "next/navigation"
import Image from "next/image"

const CategoriesTable = ({ categories, search, openForm, setDeleteConfirmId, viewMode = "grid" }) => {
  const { id } = useParams()
  const [currentPage, setCurrentPage] = useState(1)
  const categoriesPerPage = viewMode === "grid" ? 8 : 5

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories
    const lower = search.toLowerCase()
    return categories.filter((cat) => cat.name.toLowerCase().includes(lower))
  }, [categories, search])

  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage)

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * categoriesPerPage
    const endIndex = startIndex + categoriesPerPage
    return filteredCategories.slice(startIndex, endIndex)
  }, [filteredCategories, currentPage, categoriesPerPage])

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const CategoryCard = ({ category, index }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      {/* Category Image */}
      <div className="relative h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        {category.image_url ? (
          <Image src={category.image_url || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="w-12 h-12 text-white/80" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => openForm(category)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDeleteConfirmId(category.id)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-red-500/80 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Category Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 truncate">{category.name}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/admin/${id}/category/${category.id}`}
            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
          >
            <Eye className="w-3 h-3" />
            View Products
          </Link>
        </div>
      </div>
    </motion.div>
  )

  const CategoryTableRow = ({ category, index }) => (
    <motion.tr variants={itemVariants} className="hover:bg-gray-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">#{index + 1}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
            {category.image_url ? (
              <Image
                src={category.image_url || "/placeholder.svg"}
                alt={category.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-5 h-5 text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{category.name}</div>
            <div className="text-xs text-gray-500">ID: {category.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/admin/${id}/category/${category.id}`}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </Link>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openForm(category)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
          >
            <Edit className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setDeleteConfirmId(category.id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  )

  if (filteredCategories.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Archive className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Categories Found</h3>
        <p className="text-gray-600 mb-6">
          {search ? "Try adjusting your search terms" : "Get started by creating your first category"}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openForm()}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <Plus className="w-4 h-4" />
          Create Category
        </motion.button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <AnimatePresence mode="wait">
        {viewMode === "grid" ? (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {paginatedCategories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </motion.div>
        ) : (
          <motion.div key="table" variants={containerVariants} initial="hidden" animate="visible">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedCategories.map((category, index) => (
                    <CategoryTableRow key={category.id} category={category} index={index} />
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * categoriesPerPage + 1} to{" "}
            {Math.min(currentPage * categoriesPerPage, filteredCategories.length)} of {filteredCategories.length}{" "}
            categories
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </motion.button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoriesTable
