'use client';
import { useEffect, useState  } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {useProductStore} from '../../../../store/useProductStore'; // Adjust path if needed

export default function ProductsByCategoryPage() {
    const { categoryId } = useParams();
    const router = useRouter();
    const { products, loading, error, fetchProductsByCategory, fetchCategoryById } = useProductStore();
  
    const [categoryName, setCategoryName] = useState('');
  
    useEffect(() => {
      if (categoryId) {
        fetchProductsByCategory(categoryId);
  
        fetchCategoryById(categoryId).then(category => {
          setCategoryName(category?.name || 'Unknown Category');
        });
      }
    }, [categoryId, fetchProductsByCategory, fetchCategoryById]);
  

  return (
    <div className="p-6">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        &larr; Back
      </button>

      <h1 className="text-2xl font-bold text-slate-800 mb-4">
        Products in Category # {categoryName || categoryId}
      </h1>

      {loading && (
        <div className="text-indigo-600 text-center py-10">Loading products...</div>
      )}

      {error && (
        <div className="text-center text-red-600 bg-red-100 border border-red-200 p-4 rounded-md">
          Error: {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center text-slate-500 bg-slate-50 border border-slate-200 p-6 rounded-lg">
          No products found in this category.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow-sm border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-medium">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Category_name</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {products.map((product, index) => (
                <tr key={product.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-semibold text-slate-500">{index + 1}</td>
                  <td className="px-4 py-3">
                    {product.product_image_url || product.product_image ? (
                      <img
                        src={product.product_image_url || product.product_image}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 flex items-center justify-center bg-slate-100 text-slate-400 text-xs rounded">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{product.category_id}</td>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 line-clamp-2">{product.description}</td>
                  <td className="px-4 py-3 font-semibold text-indigo-600">
                    ${product.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
