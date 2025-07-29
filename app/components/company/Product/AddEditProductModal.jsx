import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, UploadCloud } from "lucide-react";
import Image from "next/image";

// Reusable style constants for a consistent look
const inputStyle = "w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";
const btnPrimary = "px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50";
const btnSecondary = "px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50";

export default function AddEditProductModal({ isOpen, onClose, onSave, product, categories, stores, loading }) {
  const [formData, setFormData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (product) {
        setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            category_id: product.category_id || "",
            store_id: product.store_id || "",
            quantity_in_stock: product.product_items?.[0]?.quantity_in_stock || 0,
        });
        setImagePreview(product.product_image_url || null);
        setImageFile(null); // Reset file on open
      } else { // Reset form for new product
        setFormData({ name: "", description: "", price: "", category_id: "", store_id: "", quantity_in_stock: "" });
        setImagePreview(null);
        setImageFile(null);
      }
    }
  }, [product, isOpen]);

  // Cleanup the object URL to prevent memory leaks
  useEffect(() => {
    return () => { 
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, imageFile); // Pass both text data and file object
  };

  if (!isOpen) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">{product ? "Edit Product" : "Add New Product"}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
        <form onSubmit={handleSubmit} className="overflow-y-auto">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
            {/* Image Upload Area */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
              <div onClick={() => fileInputRef.current?.click()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500">
                <div className="space-y-1 text-center">
                  {imagePreview ? <Image src={imagePreview} alt="Preview" width={128} height={128} className="mx-auto h-32 w-32 object-contain rounded-md" /> : <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />}
                  <div className="flex text-sm text-slate-600"><p className="pl-1">{imageFile ? `Selected: ${imageFile.name}` : "Click to upload an image"}</p></div>
                  <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                </div>
                <input ref={fileInputRef} id="file-upload" name="product_image" type="file" className="sr-only" onChange={handleImageChange} accept="image/png, image/jpeg" />
              </div>
            </div>
            {/* Form Fields */}
            <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} className={inputStyle} required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Description</label><textarea name="description" value={formData.description || ''} onChange={handleChange} className={inputStyle} rows="3"></textarea></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Price</label><input type="number" name="price" value={formData.price || ''} onChange={handleChange} className={inputStyle} step="0.01" required /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label><input type="number" name="quantity_in_stock" value={formData.quantity_in_stock || ''} onChange={handleChange} className={inputStyle} required /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Category</label><select name="category_id" value={formData.category_id || ''} onChange={handleChange} className={inputStyle} required><option value="" disabled>Select category</option>{(categories ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Store</label><select name="store_id" value={formData.store_id || ''} onChange={handleChange} className={inputStyle} required><option value="" disabled>Select store</option>{(stores ?? []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
          </div>
          <div className="flex justify-end gap-3 p-4 bg-slate-50 border-t border-slate-200 rounded-b-lg"><button type="button" onClick={onClose} className={btnSecondary} disabled={loading}>Cancel</button><button type="submit" className={btnPrimary} disabled={loading}>{loading ? "Saving..." : "Save Product"}</button></div>
        </form>
      </motion.div>
    </motion.div>
  );
}