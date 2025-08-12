// components/admin/shared/EmptyState.js
import { Plus, Truck } from 'lucide-react';

export default function EmptyState({ item, onAddClick }) {
  return (
    <div className="text-center py-16 px-6">
      <Truck className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-semibold text-gray-900">No {item}s found</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by adding your first {item}.</p>
      <div className="mt-6">
        <button
          onClick={onAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add {item}
        </button>
      </div>
    </div>
  );
}