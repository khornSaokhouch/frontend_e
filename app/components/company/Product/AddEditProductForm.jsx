"use client";

import { useState, useEffect } from "react";
import { useCategoryStore } from "../../../store/useCategoryStore";
import { useStore } from "../../../store/useStore";
import { motion } from "framer-motion";
import { CheckCircle, Upload, X, Package } from "lucide-react";

const AddEditProductForm = ({ product, onSave, onCancel }) => {
  const initialQuantity =
    product?.product_items && product.product_items.length > 0
      ? product.product_items[0].quantity_in_stock
      : 0;

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category_id: product?.category_id || "",
    store_id: product?.store_id || "",
    product_image: null ,
    quantity_in_stock: initialQuantity !== undefined ? Number(initialQuantity) : 0,
  });

  const { categories, fetchCategories } = useCategoryStore();
  const { stores, fetchStores } = useStore();
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setFormData({
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      category_id: product?.category_id || "",
      store_id: product?.store_id || "",
      product_image: null ,
      quantity_in_stock: initialQuantity !== undefined ? Number(initialQuantity) : 0,
    });
    // Set initial image preview if product has an image
    setImagePreview(product?.product_image_url || null);
  }, [product]);

  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((f) => ({ ...f, product_image: file }));
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setFormData((f) => ({ ...f, product_image: null }));
      setImagePreview(null);
    }
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <motion.div
      className="w-full max-w-sm mx-auto"
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-800">{product ? "Edit Product" : "Add Product"}</h2>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 p-1 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-3 space-y-3">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Store and Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store *</label>
              <select
                value={formData.store_id}
                onChange={(e) => handleSelectChange("store_id", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={formData.category_id}
                onChange={(e) => handleSelectChange("category_id", e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              id="quantity"
              name="quantity_in_stock"
              type="number"
              value={formData.quantity_in_stock}
              onChange={handleChange}
              required
              placeholder="0"
              className="w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
            <div className="space-y-2">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-20 border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col items-center justify-center">
                  <Upload className="w-5 h-5 mb-1 text-gray-400" />
                  <p className="text-xs text-gray-500">Click to upload</p>
                </div>
                <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              {/* Conditionally render image preview */}
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-20 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full text-xs"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData((f) => ({ ...f, product_image_url: null }));
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors flex items-center justify-center"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              {product ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddEditProductForm;