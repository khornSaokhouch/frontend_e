'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProductStore } from '../../store/useProductStore';
import ProductCard from '../user/ProductCard';
import { useUserStore } from '../../store/userStore';
import { toast } from 'react-hot-toast';
import { useFavouritesStore } from '../../store/useFavouritesStore';

export default function ProductsByCategoryPage({ categoryId }) {
  const userId = useUserStore(state => state.user?.id);
  const router = useRouter();
  const {
    products,
    loading,
    error,
    fetchProductsByCategory,
    fetchCategoryById,
  } = useProductStore();

  const [isLoading, setIsLoading] = useState(false);
  const [categoryName, setCategoryName] = useState('');

  const { favourites } = useFavouritesStore(); // <-- Get favourites list
  const { addFavourite } = useFavouritesStore();

  useEffect(() => {
    if (categoryId) {
      fetchProductsByCategory(categoryId);
      fetchCategoryById(categoryId).then((category) =>
        setCategoryName(category?.name || 'Unknown Category')
      );
    }
  }, [categoryId, fetchProductsByCategory, fetchCategoryById]);

  const handleAddFavourite = async (productId) => {
    if (!userId) {
      toast.error("You need to be logged in to add favourites.");
      return;
    }

    try {
      const loadingToastId = toast.loading("Adding to favourites...");

      await addFavourite({ user_id: userId, product_id: productId });

      toast.success("Added to favourites!", { id: loadingToastId });
    } catch (err) {
      toast.error(`Failed to add favourite: ${err.message}`, { id: loadingToastId });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded transition"
        aria-label="Go back"
      >
        &larr; Back
      </button>

      <h1 className="text-4xl font-extrabold text-gray-900 text-center mt-6 mb-8 tracking-tight">
        Products in &quot;{categoryName || categoryId}&quot;
      </h1>

      {loading && (
        <div className="text-center text-indigo-600 py-16 font-semibold text-lg">
          Loading products...
        </div>
      )}

      {error && (
        <div className="text-center text-red-700 bg-red-100 border border-red-300 p-6 rounded-lg font-medium">
          Error: {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="text-center text-gray-500 bg-gray-50 border border-gray-200 p-8 rounded-lg font-medium italic">
          No products found in this category.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            // ✅ Safely check if product is favourited
            const isFavourite = favourites?.some(fav => fav?.product_id === product.id);

            return (
              <ProductCard
                key={product.id}
                product={product}
                isFavourite={isFavourite}
                onAddFavourite={() => handleAddFavourite(product.id)}
                disabled={isLoading}
                className="hover:shadow-lg transition-shadow duration-300"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
