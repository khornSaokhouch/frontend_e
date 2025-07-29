// /app/components/company/orders/EditOrderModal.jsx (or a suitable path)

"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function EditOrderModal({ isOpen, onClose, order, statuses, onSave, loading }) {
  const [selectedStatusId, setSelectedStatusId] = useState("");

  useEffect(() => {
    // When the modal opens, set the initial status from the order
    if (order) {
      setSelectedStatusId(order.order_status_id);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSaveClick = () => {
    onSave(order.id, selectedStatusId);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-lg"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-800">Edit Order #{order.id}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            <p className="mb-2 text-sm text-slate-600">
              Update the status for this order.
            </p>
            <select
              value={selectedStatusId}
              onChange={(e) => setSelectedStatusId(Number(e.target.value))}
              className="w-full mt-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            >
              <option value="" disabled>Select a status</option>
              {statuses.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.status}
                </option>
              ))}
            </select>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-3 p-4 bg-slate-50 border-t border-slate-200 rounded-b-lg">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100" disabled={loading}>
              Cancel
            </button>
            <button onClick={handleSaveClick} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}