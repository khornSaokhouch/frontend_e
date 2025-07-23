"use client";

import { useEffect, useState } from "react";
import { useStocks } from "../../../store/useStocks";
import { useCategoryStore } from "../../../store/useCategoryStore";
import { useStore } from "../../../store/useStore";

export default function StocksPage() {
  const { stocks, fetchStocks, createStock, deleteStock, loading, error } =
    useStocks();

  const stores = useStore((state) => state.stores);
  const fetchStores = useStore((state) => state.fetchStores);

  const categories = useCategoryStore((state) => state.categories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  const [storeId, setStoreId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchStocks();
    fetchCategories();
    fetchStores();
  }, [fetchStocks, fetchCategories, fetchStores]);

  const handleAdd = async () => {
    if (!storeId) return alert("Store ID is required");
    await createStock({ store_id: storeId, category_id: categoryId || null });
    setStoreId("");
    setCategoryId("");
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Stocks</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Stock
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-100 p-4 rounded shadow space-y-3">
          <h2 className="text-lg font-semibold">Create Stock</h2>
          <select
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-3"
          >
            <option value="">Select Store</option>
            {(stores || []).map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-3"
          >
            <option value="">Select Category (optional)</option>
            {(categories || []).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Submit
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="bg-white shadow rounded-xl border border-slate-200">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Store ID</th>
              <th className="px-6 py-3">Category ID</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, index) => (
              <tr
                key={stock.id}
                className="border-b hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{stock.store_id}</td>
                <td className="px-6 py-4">{stock.category_id || "—"}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => deleteStock(stock.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {stocks.length === 0 && !loading && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  No stocks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
