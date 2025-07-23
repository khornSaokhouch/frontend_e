"use client";

import React, { useEffect, useState } from "react";
import { useProductStore } from "../../../store/useProductStore";
import { useCategoryStore } from "../../../store/useCategoryStore";
import { useStore } from "../../../store/useStore"; // added for stores
import { useUserStore } from "../../../store/userStore";
import { toast } from "react-hot-toast";

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category_id: product?.category_id || "",
    store_id: product?.store_id || "",
    product_image: null,
  });

  const { categories, fetchCategories } = useCategoryStore();
  const { stores, fetchStores } = useStore();

  const [imagePreview, setImagePreview] = useState(product?.product_image || null);

  useEffect(() => {
    setFormData({
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      category_id: product?.category_id || "",
      store_id: product?.store_id || "",
      product_image: null,
    });

    if (product?.product_image && typeof product.product_image === "string") {
      setImagePreview(product.product_image);
    } else {
      setImagePreview(null);
    }
  }, [product]);

  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((f) => ({ ...f, product_image: file }));

    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded max-w-md mx-auto space-y-4">
      <div>
        <label className="block mb-1 font-medium">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={3}
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Store:</label>
        <select
          name="store_id"
          value={formData.store_id}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select Store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Category:</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Price:</label>
        <input
          type="number"
          step="0.01"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Product Image:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 max-h-40 object-contain border rounded"
          />
        )}
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
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

  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const { user } = useUserStore();
  const currentUserId = user?.id;

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products by user id if you want user-specific products
  const userProducts = products.filter((p) => p.user_id === currentUserId);

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

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!editingProduct && !isCreating && (
        <>
          <button
            onClick={() => setIsCreating(true)}
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add New Product
          </button>

          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Store</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Image</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4">
                    No products found.
                  </td>
                </tr>
              ) : (
                userProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="border p-2">{product.id}</td>
                    <td className="border p-2">{product.name}</td>
                    <td className="border p-2">${product.price}</td>
                    <td className="border p-2">{product.store_id}</td>
                    <td className="border p-2">{product.category_id}</td>
                    <td className="border p-2">
                      {product.product_image_url ? (
                        <img
                          src={product.product_image_url}
                          alt={product.name}
                          className="h-16 object-contain"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="border p-2 space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-yellow-400 px-2 rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-600 text-white px-2 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}

      {(editingProduct || isCreating) && (
        <ProductForm
          product={editingProduct}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
