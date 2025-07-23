"use client";

import { useEffect, useState } from "react";
import { useStore } from "../../../store/useStore";
import { Pencil, Trash2 } from "lucide-react";

export default function StoreManager() {
  const {
    stores,
    fetchStores,
    createStore,
    updateStore,
    deleteStore,
    loading,
  } = useStore();

  const [formData, setFormData] = useState({ name: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await updateStore(editingId, formData);
    } else {
      await createStore(formData);
    }
    setFormData({ name: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (store) => {
    setEditingId(store.id);
    setFormData({ name: store.name });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this store?")) {
      await deleteStore(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Store Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Store
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
          <div className="mb-4">
            <label className="block mb-1 text-slate-700 font-medium">
              Store Name
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded px-3 py-2"
              placeholder="Store name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              {editingId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({ name: "" });
              }}
              className="bg-gray-200 text-slate-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Store Name</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr
                key={store.id}
                className="border-t border-slate-200 hover:bg-slate-50"
              >
                <td className="p-4 text-slate-700">{store.id}</td>
                <td className="p-4 font-medium text-slate-800">{store.name}</td>
                <td className="p-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(store)}
                    className="flex items-center gap-1 px-2 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(store.id)}
                    className="flex items-center gap-1 px-2 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {stores.length === 0 && !loading && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-slate-500">
                  No stores found.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan="3" className="p-4 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
