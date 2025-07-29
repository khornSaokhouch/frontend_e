"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useProductStore } from "../../store/useProductStore";
import { useUserStore } from '../../store/userStore';
import Image from "next/image";

const ProductCategory = () => {
  const userId = useUserStore(state => state.user?.id);
  const { categories, fetchCategories } = useCategoryStore();
  const { products, fetchAllProducts } = useProductStore();
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
    fetchAllProducts();
  }, [fetchCategories, fetchAllProducts]);
  

  const filteredProducts = products;



  const handleCategoryClick = (categoryId) => {
    if(userId) {
      router.push(`/user/${userId}/category/${categoryId}`);
    } else {
      router.push(`/category/${categoryId}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen p-4">
      {/* Left: Categories */}
      <div className="w-full md:w-1/5 bg-white rounded-3xl p-4 shadow-md">
        <h2 className="text-red-500 text-xl font-bold mb-4">CATEGORY</h2>
        <ul>
      {categories && categories.length > 0 ? (
        categories.map((category) => (
          <li
            key={category.id}
            className="py-2 cursor-pointer hover:text-red-500"
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </li>
        ))
      ) : (
        <li>Loading categories...</li>
      )}
    </ul>
      </div>

      {/* Right: Banner + Mini Cards */}
      <div className="w-full md:w-3/5 flex flex-col gap-6 ml-0 md:ml-6 mt-6 md:mt-0">
        {/* Main Banner Product */}
        {filteredProducts[0] && (
          <div className="bg-gray-200 relative rounded-3xl overflow-hidden shadow-md mb-1">
            <div className="relative h-102">
              <Image
                src={filteredProducts[0].product_image_url || "/placeholder.jpg"}
                alt={filteredProducts[0].name}
                fill
                style={{ objectFit: "cover" }}
                className="absolute inset-0 opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent"></div>
            </div>
            <div className="absolute top-0 left-0 p-8 z-10 text-left w-1/2">
              <h2 className="text-6xl font-bold text-white mb-2">
                {filteredProducts[0].name}
              </h2>
              <p className="text-white text-lg mb-14">
                {filteredProducts[0].description}
              </p>
              <button
                className="bg-white text-black font-semibold py-4 px-8 rounded-xl hover:bg-gray-300"
                onClick={() => router.push(`/product/${filteredProducts[0].id}`)}
              >
                BUY NOW
              </button>
            </div>
          </div>
        )}

        {/* Right Column: Mini Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProducts.slice(1, 3).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md flex flex-col"
            >
              <div className="relative h-52 rounded-t-3xl">
                <Image
                  src={product.product_image_url || "/placeholder.jpg"}
                  alt={product.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-transparent"></div>

                {/* ✅ Bottom-left text */}
                <div className="absolute bottom-4 left-4 text-left px-4 text-white">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-xl font-bold mt-1">${product.price}</p>
                  <button
                    className="text-sm mt-2 font-semibold underline hover:text-gray-300"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    SHOP NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Right Column */}
      <div className="w-full md:w-1/5 flex flex-col gap-6 ml-0 md:ml-6 mt-6 md:mt-0">
        <div className="grid grid-cols-1 gap-6">
          {filteredProducts.slice(3, 5).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden shadow-md flex flex-col"
            >
              <div
                className="relative h-78 rounded-t-3xl bg-cover bg-center"
                style={{
                  backgroundImage: `url(${product.product_image_url || "/placeholder.jpg"})`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-transparent"></div>

                {/* ✅ Bottom-left text */}
                <div className="absolute bottom-4 left-4 text-left px-4 text-white">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-xl font-bold mt-1">${product.price}</p>
                  <button
                    className="mt-2 bg-white text-black font-semibold py-1 px-4 rounded hover:bg-gray-300"
                    onClick={() => router.push(`/product/${product.id}`)}
                  >
                    SHOP NOW
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
