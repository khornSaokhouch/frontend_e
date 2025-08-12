import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Loader2 } from 'lucide-react';

const ModalWrapper = ({ children, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md p-8 bg-white rounded-lg shadow-xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </motion.div>
    </motion.div>
);

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, itemName, itemType, isProcessing }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <ModalWrapper onClose={onClose}>
        <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the {itemType}: <strong className="font-medium text-gray-800">"{itemName}"</strong>? This action is permanent.
        </p>
        <div className="flex justify-center gap-3">
          <button type="button" onClick={onClose} disabled={isProcessing} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 w-28">Cancel</button>
          <button type="button" onClick={onConfirm} disabled={isProcessing} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 w-28">
            {isProcessing ? <Loader2 className="animate-spin w-4 h-4"/> : 'Delete'}
          </button>
        </div>
      </ModalWrapper>
    </AnimatePresence>
  );
}