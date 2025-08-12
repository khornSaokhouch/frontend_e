"use client"

import { motion } from "framer-motion"
import { Plus, Download } from "lucide-react"

export default function PaymentTypeHeader({ onAddClick, loading }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment Types</h1>
        <p className="text-gray-600 mt-1">Manage payment methods and transaction types</p>
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
          onClick={onAddClick}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Add Payment Type
        </motion.button>
      </div>
    </div>
  )
}