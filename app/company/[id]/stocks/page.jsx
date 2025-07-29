// /app/admin/[id]/stocks/page.jsx

"use client";

import { useEffect, useState, useMemo } from "react";
import { useStocks } from "../../../store/useStocks";
import { useCategoryStore } from "../../../store/useCategoryStore";
import { useStore } from "../../../store/useStore";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X, AlertTriangle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

// --- Modals (No changes needed here) ---

const AddStockModal = ({ isOpen, onClose, onSave, stores, categories, loading }) => {
  // ... (this component remains exactly the same)
  const [storeId, setStoreId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!storeId) {
      toast.error("Please select a store.");
      return;
    }
    onSave({
      store_id: Number(storeId),
      category_id: categoryId ? Number(categoryId) : null,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0  z-50 flex justify-center items-center p-4">
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-lg shadow-xl w-full max-w-lg">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">Add New Stock</h2>
              <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="store" className="block text-sm font-medium text-slate-700 mb-1">Store <span className="text-red-500">*</span></label>
                <select id="store" value={storeId} onChange={(e) => setStoreId(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required>
                  <option value="" disabled>Select a store</option>
                  {(stores ?? []).map((store) => (<option key={store.id} value={store.id}>{store.name}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category (Optional)</label>
                <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">Select a category</option>
                  {(categories ?? []).map((category) => (<option key={category.id} value={category.id}>{category.name}</option>))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 bg-slate-50 border-t border-slate-200 rounded-b-lg">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100" disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50" disabled={loading}>
                {loading ? "Saving..." : "Create Stock"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  // ... (this component remains exactly the same)
    if (!isOpen) return null;
    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0  z-50 flex justify-center items-center p-4">
                <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
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
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
                        <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">Yes, Delete</button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// --- Main Page Component ---

export default function StocksPage() {
  const { stocks, fetchStocks, createStock, deleteStock, loading, error } = useStocks();
  const { stores, fetchStores } = useStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStocks();
    fetchCategories();
    fetchStores();
  }, [fetchStocks, fetchCategories, fetchStores]);

  const storeMap = useMemo(() => new Map((stores ?? []).map(s => [s.id, s.name])), [stores]);
  const categoryMap = useMemo(() => new Map((categories ?? []).map(c => [c.id, c.name])), [categories]);

  // --- MODIFICATION HERE ---
  const handleSaveStock = async (formData) => {
    setActionLoading(true);
    try {
      // Step 1: Call the create action
      await createStock(formData);
      // Step 2: On success, re-fetch the entire list to get the new item
      await fetchStocks(); 
      
      toast.success("Stock link created successfully!");
      setIsAddModalOpen(false);
    } catch (err) {
      toast.error("Failed to create stock link.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedStock) return;
    setActionLoading(true);
    // Here we can use toast.promise because deleteStock throws an error on failure
    await toast.promise(deleteStock(selectedStock.id), {
      loading: 'Deleting...',
      success: 'Stock link deleted successfully!',
      error: 'Failed to delete stock link.'
    });

    // Note: We don't need to call fetchStocks() here because our deleteStock
    // in the store optimistically removes the item from the state for a faster UI feel.
    setActionLoading(false);
    setIsDeleteModalOpen(false);
    setSelectedStock(null);
  };
  
  // The rest of the component's JSX remains the same
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-500">Link stores to categories to manage stock availability.</p>
        <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md text-sm hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Stock
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">Stock ID</th>
                <th scope="col" className="px-6 py-3">Store Name</th>
                <th scope="col" className="px-6 py-3">Linked Category</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && [...Array(3)].map((_, i) => (
                <tr key={i} className="border-b border-slate-200">
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-1/4"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div></td>
                  <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded animate-pulse w-10 ml-auto"></div></td>
                </tr>
              ))}
              {!loading && (stocks ?? []).map((stock) => (
                <tr key={stock.id} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-slate-500">{stock.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{storeMap.get(stock.store_id) || `ID: ${stock.store_id}`}</td>
                  <td className="px-6 py-4 text-slate-600">{categoryMap.get(stock.category_id) || "All Categories"}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setSelectedStock(stock); setIsDeleteModalOpen(true); }} className="p-2 text-red-600 hover:bg-slate-100 rounded-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && (!stocks || stocks.length === 0) && (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-500">
                    No stock links found. Click "Add Stock" to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveStock}
        stores={stores}
        categories={categories}
        loading={actionLoading}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Stock Link"
      >
        Are you sure you want to delete this stock link? This will unlink the store from the category.
      </ConfirmationModal>
    </div>
  );
}