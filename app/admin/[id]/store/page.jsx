// /app/admin/[id]/stores/page.jsx (or your file path)

"use client";

import { useEffect, useState } from "react";
import { useStore } from "../../../store/useStore"; // Assuming this is your Zustand store
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trash2, Plus, X, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

// --- Reusable Modals Defined In-File ---

/**
 * A reusable modal for Creating and Editing a store.
 */
const StoreModal = ({ isOpen, onClose, onSave, store, loading }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName(store ? store.name : "");
    }
  }, [isOpen, store]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-center items-center p-4">
        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-lg shadow-xl w-full max-w-md">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">{store ? "Edit Store" : "Add New Store"}</h2>
              <button type="button" onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="p-6">
              <label htmlFor="storeName" className="block text-sm font-medium text-slate-700 mb-1">Store Name</label>
              <input
                id="storeName"
                type="text"
                className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., Downtown Branch"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-3 p-4 bg-slate-50 border-t border-slate-200 rounded-b-lg">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100" disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50" disabled={loading}>
                {loading ? "Saving..." : (store ? "Update Store" : "Create Store")}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * A reusable modal for confirming destructive actions.
 */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
    if (!isOpen) return null;
    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex justify-center items-center p-4">
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

export default function StoreManager() {
  const { stores, fetchStores, createStore, updateStore, deleteStore, loading } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // --- Handlers for opening modals ---
  const handleAdd = () => {
    setSelectedStore(null);
    setIsModalOpen(true);
  };

  const handleEdit = (store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const handleDelete = (store) => {
    setSelectedStore(store);
    setIsDeleteModalOpen(true);
  };

  // --- Handlers for modal actions ---
  const handleSave = async (formData) => {
    setActionLoading(true);
    const promise = selectedStore
      ? updateStore(selectedStore.id, formData)
      : createStore(formData);

    await toast.promise(promise, {
      loading: 'Saving...',
      success: `Store ${selectedStore ? 'updated' : 'created'} successfully!`,
      error: `Failed to ${selectedStore ? 'update' : 'create'} store.`,
    });

    setActionLoading(false);
    setIsModalOpen(false);
    setSelectedStore(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedStore) return;
    setActionLoading(true);
    
    await toast.promise(deleteStore(selectedStore.id), {
        loading: 'Deleting...',
        success: 'Store deleted successfully!',
        error: 'Failed to delete store.'
    });

    setActionLoading(false);
    setIsDeleteModalOpen(false);
    setSelectedStore(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-500">Manage all your physical or digital store locations.</p>
        <button onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md text-sm hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Store
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">Store ID</th>
                <th scope="col" className="px-6 py-3">Store Name</th>
                <th scope="col" className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && [...Array(3)].map((_, i) => (
                <tr key={i} className="border-b border-slate-200">
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-1/4"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div></td>
                  <td className="px-6 py-4"><div className="h-8 bg-slate-200 rounded animate-pulse w-20 ml-auto"></div></td>
                </tr>
              ))}
              {!loading && stores.map((store) => (
                <tr key={store.id} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-slate-500">{store.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{store.name}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(store)} className="p-2  text-blue-600 hover:bg-slate-100 rounded-md">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(store)} className="p-2 text-red-600 hover:bg-slate-100 rounded-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && stores.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-10 text-center text-slate-500">
                    No stores found. Click "Add Store" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* --- Render Modals --- */}
      <StoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        store={selectedStore}
        loading={actionLoading}
      />
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Store"
      >
        Are you sure you want to permanently delete the store "{selectedStore?.name}"? This action cannot be undone.
      </ConfirmationModal>
    </div>
  );
}