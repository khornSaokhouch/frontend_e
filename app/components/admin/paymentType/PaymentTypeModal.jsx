"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Loader2, CreditCard, Save, Plus, Info } from "lucide-react"

const PaymentTypeModal = ({
  isOpen,
  onClose,
  onSubmit,
  inputValue,
  setInputValue,
  isProcessing,
  isEditing,
}) => {
  if (!isOpen) return null

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0  z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          variants={dropIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl grid lg:grid-cols-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Left Side: Informational Panel */}
          <div className="hidden lg:flex flex-col justify-between p-8 bg-gray-50 rounded-l-2xl">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-100">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditing ? "Edit Payment Type" : "New Payment Type"}
                </h2>
              </div>
              <p className="mt-3 text-gray-600 leading-relaxed">
                {isEditing
                  ? "Update the details for this payment method. Changes will be reflected across the system."
                  : "Create a new payment method that can be used for transactions and assigned to customers."}
              </p>
            </div>
            <div className="mt-8 p-4 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Guidelines</h4>
                  <ul className="text-sm text-gray-500 list-disc list-inside space-y-1">
                    <li>Use clear, recognizable names (e.g., "Credit Card").</li>
                    <li>Avoid special characters for better compatibility.</li>
                    <li>Keep names concise but descriptive.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Side: Form */}
          <div className="p-8">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors lg:hidden"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-6 lg:hidden">
              {isEditing ? "Edit Payment Type" : "New Payment Type"}
            </h2>
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="paymentType" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Type Name
                </label>
                <input
                  id="paymentType"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g., PayPal, Bank Transfer"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  autoFocus
                />
              </div>

              {/* Add more form fields here if needed in the future */}
              {/*
                <div className="pt-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select id="status" className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg ...">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>
              */}

              <div className="pt-8 flex flex-col-reverse sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isProcessing}
                  className="w-full px-6 py-3 text-gray-800 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !inputValue.trim()}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-500/20 disabled:bg-green-300 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isEditing ? "Saving..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {isEditing ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      {isEditing ? "Save Changes" : "Create Method"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PaymentTypeModal