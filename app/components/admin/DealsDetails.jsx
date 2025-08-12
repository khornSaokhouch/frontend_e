"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ChevronDown, TrendingUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const DealsDetails = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const totalPages = Math.ceil(products.length / pageSize)

  // Calculate start and end index for the current page
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize

  // Get the products for the current page
  const displayedProducts = products.slice(startIndex, endIndex)

  // Determine if there's a next page
  const hasNextPage = currentPage < totalPages
  // Determine if there's a previous page
  const hasPreviousPage = currentPage > 1

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1)
  }

  const handlePreviousPage = () => {
    setCurrentPage((prev) => prev - 1)
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
    <motion.div
      className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center pb-5 mb-5 border-b border-gray-200"
      >
        <div className="flex items-center gap-3">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-800">Deals Details</h2>
        </div>
        {/* CORRECTED THIS LINE */}
        <motion.button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          October
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </motion.button>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="overflow-x-auto rounded-2xl border border-gray-200/50">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product Name
              </th>
              <th scope="col" className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date - Time
              </th>
              <th scope="col" className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors group"
                  >
                    <td className="p-4 text-gray-600 font-medium">#{startIndex + index + 1}</td>
                    <td className="p-4 font-medium text-gray-800">
                      <div className="flex items-center gap-3">
                        {product.product_image_url ? (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={product.product_image_url || "/placeholder.svg"}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                        {product.name}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      {product.description?.length > 50
                        ? product.description.slice(0, 50) + "..."
                        : product.description || "No description"}
                    </td>
                    <td className="p-4 text-gray-600">{new Date(product.created_at).toLocaleString()}</td>
                    <td className="p-4 text-green-600 font-semibold">${product.price}</td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr key="no-products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <td colSpan={5} className="p-6 text-center text-gray-500">
                    No products found for this period.
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Pagination */}
      {products.length > pageSize && (
        <motion.div variants={itemVariants} className="flex justify-between items-center pt-6 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, products.length)} of {products.length} deals
          </span>
          <div className="flex items-center gap-2">
            <motion.button
              onClick={handlePreviousPage}
              disabled={!hasPreviousPage}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </motion.button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <motion.button
              onClick={handleNextPage}
              disabled={!hasNextPage}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default DealsDetails