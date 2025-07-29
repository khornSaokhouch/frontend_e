"use client";

import { useEffect, useState } from 'react';
import { useProductStore } from '../../../store/useProductStore';
import Image from 'next/image'; // Import Image component
import { ChevronRight, Star, ChevronLeft } from 'lucide-react';

const PAGE_SIZE = 12; // Number of products per page

export default function ProductsPage() {
  const { products, loading, error, fetchAllProducts } = useProductStore();
  const [initLoading, setInitLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadProducts() {
      await fetchAllProducts();
      setInitLoading(false);
    }
    loadProducts();
  }, [fetchAllProducts]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const displayedProducts = products.slice(startIndex, endIndex);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (initLoading) {
    return (
      <div className="p-6 text-indigo-600 font-medium">Loading products...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 font-semibold">Error: {error}</div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-6 text-gray-600">No products found.</div>
    );
  }

  return (
    <div className="container mx-auto px-2">
      {/* Sale Banner Section */}
      <div className="bg-indigo-500 rounded-lg p-6 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-600 opacity-20"></div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="w-2/3">
            <p className="text-sm">September 12-22</p>
            <h2 className="text-2xl font-bold">Enjoy free home delivery in this summer</h2>
            <p className="text-sm mt-2">Designer Dresses - Pick from trendy Designer Dress.</p>
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded mt-4">
              Get Started
            </button>
          </div>
          <div className="w-1/3 flex justify-end">
            {/* Add navigation buttons or any other visual elements you like */}
            {/* Example: <button>Next</button> */}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image Section */}
            <div className="relative h-64">
              <Image
                src={product.product_image_url || product.product_image || "/placeholder.jpg"} // Replace with your placeholder image path
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                className="absolute"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" // Adjust sizes for responsiveness
              />
            </div>

            {/* Product Info Section */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-600">${product.price}</p>

              {/* Star Ratings (Implement your star rating component here) */}
              <div className="flex items-center mt-2">
                {/* Assuming you have a rating and review count */}
                <Star className="w-4 h-4 text-yellow-500 fill-current"/>
                <Star className="w-4 h-4 text-yellow-500 fill-current"/>
                <Star className="w-4 h-4 text-yellow-500 fill-current"/>
                <Star className="w-4 h-4 text-yellow-500 fill-current"/>
                <Star className="w-4 h-4 text-yellow-500 fill-current"/>
                <span className="text-gray-500 text-xs ml-1">(131)</span>
              </div>

              {/* Edit Product Button */}
              <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded mt-4 text-sm">
                Edit Product
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center mt-4 space-x-2">
           <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            <span>Back</span>
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <span>Next</span>
            <ChevronRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
}