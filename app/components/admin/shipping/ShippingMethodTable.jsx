import { Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShippingMethodTable({ methods, onEdit, onDelete, isProcessing }) {
  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Method Name</th>
            <th scope="col" className="px-6 py-3">Price</th>
            <th scope="col" className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {methods.map((method, index) => (
            <motion.tr
              key={method.id}
              className="bg-white border-b hover:bg-gray-50"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{method.name}</td>
              <td className="px-6 py-4">{formatPrice(method.price)}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(method)}
                    disabled={isProcessing}
                    className="p-2 text-gray-500 rounded-md hover:bg-gray-100 hover:text-sky-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(method)}
                    disabled={isProcessing}
                    className="p-2 text-gray-500 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}