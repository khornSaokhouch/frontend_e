'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useProductStore } from '../../../../store/useProductStore';

export default function ProductsByCategoryPage() {
  const { categoryId } = useParams();
  const router = useRouter();
  const { products, loading, error, fetchProductsByCategory, fetchCategoryById } = useProductStore();

  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    if (categoryId) {
      fetchProductsByCategory(categoryId);
      fetchCategoryById(categoryId).then((category) =>
        setCategoryName(category?.name || 'Unknown Category')
      );
    }
  }, [categoryId, fetchProductsByCategory, fetchCategoryById]);

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        &larr; Back
      </button>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-slate-800">
        Products in "{categoryName || categoryId}"
      </h1>

      {/* States */}
      {loading && (
        <div className="text-center text-indigo-600 py-8 text-sm">Loading products...</div>
      )}

      {error && (
        <div className="text-red-700 bg-red-100 border border-red-200 p-4 rounded-md text-sm text-center">
          Error: {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center text-slate-500 bg-slate-50 border border-slate-200 p-6 rounded-lg text-sm">
          No products found in this category.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="overflow-x-auto rounded-xl shadow border border-slate-200 bg-white">
          <table className="min-w-full text-sm text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
              <tr>
                <th className="px-5 py-3">#</th>
                <th className="px-5 py-3">Image</th>
                <th className="px-5 py-3">Category ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map((product, index) => (
                <tr key={product.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3 text-slate-500 font-medium">{index + 1}</td>
                  <td className="px-5 py-3">
                    {product.product_image_url || product.product_image ? (
                      <img
                        src={product.product_image_url || product.product_image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md border border-slate-200"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-slate-100 text-xs text-slate-400 rounded-md border border-slate-200">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3">{product.category_id}</td>
                  <td className="px-5 py-3 font-semibold">{product.name}</td>
                  <td className="px-5 py-3 max-w-xs text-slate-600 line-clamp-2">
                    {product.description}
                  </td>
                  <td className="px-5 py-3 font-bold text-indigo-600">${product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
