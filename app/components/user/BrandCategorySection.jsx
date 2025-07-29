"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCategoryStore } from "../../store/useCategoryStore";
import { motion } from "framer-motion"; // Import motion

const BrandCategorySection = () => {
  const { categories, fetchCategories } = useCategoryStore();
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
        {/* Featured Brands Section */}
        <div>
          {/* Section Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">FEATURED BRANDS</h2>
            <motion.button
              className="bg-gray-100 text-gray-600 rounded-full px-4 py-2 text-sm"
              variants={viewAllButtonVariants}
              whileHover="hover"
              onClick={() => {
                // Navigate to a Brands page
                router.push("/brands");
              }}
            >
              View All
            </motion.button>
          </div>

          {/* Brand Logos */}
          <div className="grid grid-cols-4 gap-4">
            <Image src="/jamx-logo.png" alt="JAMX" width={128} height={32} className="object-contain" />
            <Image src="/digitek-logo.png" alt="Digitek" width={128} height={32} className="object-contain" />
            <Image src="/tekreactjs-logo.png" alt="tekreactjs" width={128} height={32} className="object-contain" />
            <Image src="/grafbase-logo.png" alt="Grafbase" width={128} height={32} className="object-contain" />
            <Image src="/msi-logo.png" alt="MSI" width={128} height={32} className="object-contain" />
            <Image src="/ohbear-logo.png" alt="ohbear" width={128} height={32} className="object-contain" />
            <Image src="/oak-logo.png" alt="Oak" width={128} height={32} className="object-contain" />
            <Image src="/stropi-logo.png" alt="stropi" width={128} height={32} className="object-contain" />
          </div>
        </div>

        {/* Top Categories Section */}
        <div>
          {/* Section Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">TOP CATEGORIES</h2>
            <motion.button
              className="bg-gray-100 text-gray-600 rounded-full px-4 py-2 text-sm"
              variants={viewAllButtonVariants}
              whileHover="hover"
              onClick={() => {
                // Navigate to a Categories page
                router.push("/categories");
              }}
            >
              View All
            </motion.button>
          </div>

          {/* Dynamic Category Images and Labels */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {categories.slice(0, 4).map((category) => (
              <motion.div
                key={category.id}
                className="flex flex-col items-center justify-center p-4 transition duration-300 cursor-pointer"
                onClick={() => router.push(`/category/${category.id}`)} // Optional: click to view
                variants={itemVariants}
                whileHover={{ scale: 1.1 }}
              >
                <div className="w-20 h-20 relative mb-3">
                  <Image
                    src={category.image_url || "/placeholder.jpg"}
                    alt={category.name}
                    fill
                    style={{ objectFit: "contain" }}
                    className="object-contain rounded-full "
                  />
                </div>
                <p className="text-sm font-medium text-gray-800 text-center">{category.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCategorySection;