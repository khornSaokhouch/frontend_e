"use client";

import { useState, useEffect } from "react";
import { useProductStore } from "../../../store/useProductStore";
import { useUserStore } from "../../../store/userStore";
import { useCategoryStore } from "../../../store/useCategoryStore";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Store,
  Tag,
  Eye,
  Search,
} from "lucide-react";

import AddEditProductForm from "../../../components/company/Product/AddEditProductForm";

export default function ProductManagement() {
  const {
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
  } = useProductStore();

  const { categories, fetchCategories } = useCategoryStore();
  const { user } = useUserStore();
  const currentUserId = user?.id;

  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // ✅ correct
  }, []);

  const userProducts = products.filter((p) => p.user_id === currentUserId);

  const filteredProducts = userProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.category_id === Number(filterCategory);
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    toast.success("Editing product: " + product.name);
    setIsCreating(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully");
      } catch {
        toast.error("Failed to delete product");
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(formData);
        toast.success("Product created successfully");
      }
      setEditingProduct(null);
      setIsCreating(false);
    } catch {
      toast.error("Error saving product");
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsCreating(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const getCategoryName = (id) =>
    categories.find((c) => c.id === Number(id))?.name || "Unknown";

  const ProductCard = ({ product }) => (
    <motion.div variants={itemVariants}>
      <motion.div
        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
        whileHover={{ scale: 1.03 }}
      >
        <div className="relative">
          {product.product_image_url ? (
            <img
              src={product.product_image_url}
              alt={product.name}
              className="w-full h-40 object-cover rounded-t-lg"
            />
          ) : (
            <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-t-lg">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <motion.span
              className="bg-white px-2 py-1 rounded text-sm font-medium text-gray-800 shadow-sm"
              whileHover={{ scale: 1.1 }}
            >
              ${product.price}
            </motion.span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-1 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">
            {product.description || "No description"}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center">
              <Store className="h-3 w-3 mr-1" />
              <span>Store: {product.store_id}</span>
            </div>
            <div className="flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              <span>Cat: {getCategoryName(product.category_id)}</span>
            </div>
          </div>

          <motion.div className="flex items-center justify-between mb-3">
            <motion.span
              className={`text-xs px-2 py-1 rounded-full ${
                product?.product_items?.[0]?.quantity_in_stock > 10
                  ? "bg-green-100 text-green-700"
                  : product?.product_items?.[0]?.quantity_in_stock > 0
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
              whileHover={{ scale: 1.1 }}
            >
              Stock: {product?.product_items?.[0]?.quantity_in_stock || 0}
            </motion.span>
          </motion.div>

          <div className="flex space-x-2">
            <motion.button
              onClick={() => handleEdit(product)}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </motion.button>
            <motion.button
              onClick={() => handleDelete(product.id)}
              className="flex-1 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Product Management
              </h1>
              <p className="text-gray-600 text-sm">Manage your products</p>
            </div>
            <motion.button
              onClick={() => {
                setIsCreating(true);
                setEditingProduct(null);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Product
            </motion.button>
          </div>

          {/* Search + Filter */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <motion.select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              whileHover={{ scale: 1.05 }}
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </motion.select>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Error */}
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterCategory !== "all"
                    ? "Try adjusting your search"
                    : "Get started by adding your first product"}
                </p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}
          </>
        )}

        {/* Modal Form */}
        <AnimatePresence mode="wait">
          {(editingProduct || isCreating) && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <AddEditProductForm
                product={editingProduct}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}  