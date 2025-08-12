"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useStore } from "../../store/useStore";
import { motion } from "framer-motion";
import { useUserStore } from "../../store/userStore";
import Link from 'next/link';

const BrandCategorySection = () => {
  const userId = useUserStore((state) => state.user?.id);
  const { categories, fetchCategories } = useCategoryStore();
  const { stores, fetchStores } = useStore();
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, [fetchCategories, fetchStores]);

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const viewAllButtonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
  };

  return (
    <div className="w-full rounded-3xl bg-white p-6 shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Featured Stores Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              FEATURED STORES
            </h2>
            <motion.button
              aria-label="View all stores"
              className="bg-gray-100 text-gray-600 rounded-full px-4 py-2 text-sm"
              variants={viewAllButtonVariants}
              whileHover="hover"
              onClick={() => {
                if (!userId) {
                  console.warn("Missing userId");
                  return;
                }
                router.push(`/user/${userId}/store`);
              }}
            >
              View All
            </motion.button>
          </div>

          {/* Dynamic Store Logos */}
          <div className="grid grid-cols-4 gap-4">
            {stores && stores.length > 0 ? (
              stores.slice(0, 8).map((store) => (
                <div
                  key={store.id}
                  className="flex justify-center items-center p-2"
                >
                  {/* <Image
                    src={store.logo_url || "/placeholder-store.png"} // Adjust property name for store logo if needed
                    alt={store.name}
                    width={128}
                    height={32}
                    className="object-contain"
                    unoptimized // optional if images are external and not hosted on Next.js
                  /> */}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No stores available</p>
            )}
          </div>
        </div>

        {/* Top Categories Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              TOP CATEGORIES
            </h2>
            <Link href={userId ? `/user/${userId}/store` : `/store`} passHref>
  <motion.button
    aria-label="View all categories"
    className="bg-gray-100 text-gray-600 rounded-full px-4 py-2 text-sm"
    variants={viewAllButtonVariants}
    whileHover="hover"
  >
    View All
  </motion.button>
</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category) => (
              <motion.div
                key={category.id}
                className="flex flex-col items-center justify-center p-4 transition duration-300 cursor-pointer"
                onClick={() => router.push(`/category/${category.id}`)}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-20 h-20 relative mb-3 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={category.image_url || "/placeholder.jpg"}
                    alt={`${category.name} logo`}
                    fill
                    style={{ objectFit: "contain" }}
                    unoptimized
                  />
                </div>
                <p className="text-sm font-medium text-gray-800 text-center">
                  {category.name}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCategorySection;
