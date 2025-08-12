import { Plus, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShippingMethodHeader({ onAddClick, loading }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Truck className="w-8 h-8 text-sky-600" />
          Shipping Management
        </h1>
        <p className="mt-1 text-gray-600">Configure delivery options and pricing for your store.</p>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 text-white font-semibold rounded-lg shadow-sm hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onAddClick}
        disabled={loading}
      >
        <Plus className="w-5 h-5" />
        Add Method
      </motion.button>
    </div>
  );
}