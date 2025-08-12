"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle, Trash2, Shield, Database } from "lucide-react"

const DeletePaymentTypeModal = ({ isOpen, onClose, paymentType, onConfirm, isProcessing }) => {
  if (!isOpen || !paymentType) return null

  // Animation variants
  const dropIn = {
    hidden: { y: -30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: { y: 30, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
  }

  return (
    <AnimatePresence>
      {/* Modal Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 shadow-2xl z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal Content */}
        <motion.div
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative bg-white rounded-2xl shadow-2xl shadow-gray-600/10 w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Section */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200/80">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-50">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Delete Payment Type
                </h2>
                <p className="text-sm text-gray-500">
                  This action is permanent and cannot be reversed.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
              aria-label="Close modal"
              disabled={isProcessing}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Content */}
          <div className="p-8 space-y-6">
            <p className="text-center text-gray-600 leading-relaxed">
              You are attempting to delete the payment type{" "}
              <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                "{paymentType.type}"
              </span>
              .
              <br />
              Please review the consequences below before proceeding.
            </p>

            {/* Impact Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
              <p className="font-medium text-gray-700">This action will affect:</p>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Database className="w-4 h-4 flex-shrink-0 text-gray-400" />
                Associations in existing transaction records.
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-4 h-4 flex-shrink-0 text-gray-400" />
                Links to payment processing configurations.
              </div>
            </div>

            {/* Confirmation Input (Optional but recommended for critical deletes) */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                To confirm, please type{" "}
                <strong className="text-red-600">DELETE</strong> below.
              </p>
              <input
                type="text"
                // This logic would need state in your parent component:
                // onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
                className="mt-2 w-full max-w-xs mx-auto text-center font-semibold tracking-widest border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          {/* Footer with Action Buttons */}
          <div className="bg-gray-50/70 p-5 rounded-b-2xl border-t border-gray-200/80">
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="w-full px-6 py-3 text-gray-800 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isProcessing} // Add: || confirmText !== 'DELETE'
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-red-500/20 disabled:bg-red-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Permanently Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default DeletePaymentTypeModal