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
  Search,
  AlertTriangle,
} from "lucide-react";

import AddEditProductForm from "../../../components/company/Product/AddEditProductForm";

// --- NEW STYLED CONFIRMATION MODAL COMPONENT ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-xl w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="flex items-center justify-center mx-auto h-20 w-20 rounded-full border-4 border-yellow-400">
            <AlertTriangle className="h-10 w-10 text-yellow-400" />
          </div>

          {/* Title */}
          <h3 className="mt-5 text-2xl font-bold text-gray-800">{title}</h3>

          {/* Subtitle/Description */}
          <p className="mt-2 text-md text-gray-600">{children}</p>
        </div>

        {/* Buttons */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-semibold text-gray-800 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-6 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            OK
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};


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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);


  useEffect(() => {
    fetchProducts();
    fetchCategories();
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
    setIsCreating(false);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete.id);
      toast.success("Product deleted successfully");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
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

  const ProductCard = ({ product }) => (
    <motion.div variants={itemVariants}>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-full">
        <div className="bg-gray-100 p-4">
          {product.product_image_url ? (
            <motion.img
              src={product.product_image_url}
              alt={product.name}
              className="w-full h-48 object-contain"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-grow space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg text-gray-800 leading-tight">
              {product.name}
            </h3>
            <p className="text-lg font-bold text-gray-900 ml-2">
              ${product.price}
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {product.description || "No description available."}
          </p>
          <div className="flex-grow" />
          <div>
            <div className="mb-3">
              <span
                className={`inline-block text-sm font-medium rounded-full ${
                  product?.product_items?.[0]?.quantity_in_stock > 10
                    ? "bg-green-100 text-green-700"
                    : product?.product_items?.[0]?.quantity_in_stock > 0
                    ? " text-yellow-700"
                    : " text-red-700"
                }`}
              >
                Stock: {product?.product_items?.[0]?.quantity_in_stock || 0}
              </span>
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() => handleEdit(product)}
                className="flex-1 px-1 py-1 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Edit
              </motion.button>
              <motion.button
                onClick={() => handleDeleteClick(product)}
                className="flex-1 px-1 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header and Filters... (code is unchanged) */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
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

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || filterCategory !== "all"
                    ? "Try adjusting your search"
                    : "Get started by adding your first product"}
                </p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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

        {/* Modals Container */}
        <AnimatePresence mode="wait">
          {(editingProduct || isCreating) && (
            <motion.div
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
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

          <ConfirmationModal
           key="confirm-modal" 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Are you sure?"
          >
            This will permanently delete the product "{productToDelete?.name}".
          </ConfirmationModal>
        </AnimatePresence>
      </div>
    </div>
  );
}