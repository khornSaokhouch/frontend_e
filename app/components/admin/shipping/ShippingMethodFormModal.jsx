import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

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
      className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </motion.div>
);

export default function ShippingMethodFormModal({ isOpen, onClose, onSubmit, isEditing, initialData, isProcessing }) {
  const [values, setValues] = useState({ name: '', price: '' });

  useEffect(() => {
    if (isEditing && initialData) {
      setValues({ name: initialData.name, price: initialData.price });
    } else {
      setValues({ name: '', price: '' });
    }
  }, [isEditing, initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!values.name.trim()) return toast.error('Method name is required.');
    if (values.price === '' || isNaN(values.price) || Number(values.price) < 0) {
      return toast.error('Please enter a valid, non-negative price.');
    }
    onSubmit(values);
  };
  
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <ModalWrapper onClose={onClose}>
        <form onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {isEditing ? 'Edit Shipping Method' : 'Add New Shipping Method'}
          </h3>
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Method Name</label>
              <input id="name" name="name" type="text" value={values.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500" placeholder="e.g., Standard Shipping" autoFocus />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input id="price" name="price" type="number" min="0" step="0.01" value={values.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-500" placeholder="0.00" />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isProcessing} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={isProcessing} className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:opacity-50 flex items-center gap-2">
              {isProcessing ? <Loader2 className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4" />}
              {isProcessing ? 'Saving...' : 'Save Method'}
            </button>
          </div>
        </form>
      </ModalWrapper>
    </AnimatePresence>
  );
}