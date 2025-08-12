"use client"

import { motion } from "framer-motion"
import { CreditCard, Edit, Trash2 } from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export default function PaymentTypeTable({ paymentTypes, onEdit, onDelete }) {
  return (
    <motion.div
      key="table"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50/50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/80">
            {paymentTypes.map((paymentType, index) => (
              <motion.tr
                key={paymentType.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                    {paymentType.id}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-emerald-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{paymentType.type}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end">
                    <button onClick={() => onEdit(paymentType)} aria-label="Edit" className="p-2 rounded-md text-blue-600 transition-colors">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDelete(paymentType)} aria-label="Delete" className="p-2 rounded-md text-red-600 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}