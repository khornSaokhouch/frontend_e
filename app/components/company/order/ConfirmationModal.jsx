// /app/components/company/ConfirmationModal.jsx (or wherever you keep it)

"use client";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, children, confirmText = 'Confirm' }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
              <div className="text-sm text-slate-600 mt-2">{children}</div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};