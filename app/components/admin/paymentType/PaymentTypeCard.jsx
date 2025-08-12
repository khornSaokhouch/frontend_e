"use client"

import { motion } from "framer-motion"
import { CreditCard, MoreVertical, Edit, Trash2 } from "lucide-react"

const PaymentTypeCard = ({ paymentType, openEditModal, openDeleteModal, index }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, delay: index * 0.05, ease: "easeOut" } 
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
      transition={{ duration: 0.2 }}
      className="group relative flex items-center p-4 bg-white rounded-xl border border-gray-200/80 shadow-sm transition-all duration-200"
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-emerald-100 rounded-lg mr-4">
        <CreditCard className="w-6 h-6 text-emerald-600" />
      </div>

      {/* Details */}
      <div className="flex-grow">
        <h3 className="text-base font-semibold text-gray-800 truncate">{paymentType.type}</h3>
        {/* <p className="text-sm text-gray-500">ID: {paymentType.id}</p> */}
      </div>

      {/* Actions (reveal on hover) */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => openEditModal(paymentType)}
          aria-label="Edit payment type"
          className="p-2 rounded-md text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={() => openDeleteModal(paymentType)}
          aria-label="Delete payment type"
          className="p-2 rounded-md text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default PaymentTypeCard