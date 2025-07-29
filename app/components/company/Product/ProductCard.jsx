import Image from "next/image";
import { motion } from "framer-motion";
import { Store, Tag, Edit, Trash2, Image as ImageIcon } from "lucide-react";

export default function ProductCard({ product, storeName, categoryName, onEdit, onDelete }) {
  const stock = product?.product_items?.[0]?.quantity_in_stock || 0;
  const stockColorClass = stock > 10 ? "bg-green-100 text-green-800"
    : stock > 0 ? "bg-yellow-100 text-yellow-800"
    : "bg-red-100 text-red-800";

  return (
    <motion.div 
      className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col"
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
    >
      <div className="relative w-full h-40 bg-slate-50 flex items-center justify-center">
        {product.product_image_url ? (
          <Image 
            src={product.product_image_url} 
            alt={product.name} 
            fill 
            sizes="30vw" 
            className="object-cover" 
          />
        ) : (
          <ImageIcon className="w-12 h-12 text-slate-300" />
        )}
        <span className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-sm font-semibold text-slate-800 shadow-sm">
          ${product.price}
        </span>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-semibold text-slate-800 mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 flex-grow">
          {product.description || "No description available."}
        </p>
        <div className="text-xs text-slate-500 mt-3 space-y-1">
          <div className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5" /><span>{storeName || "N/A"}</span></div>
          <div className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /><span>{categoryName || "N/A"}</span></div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className={`text-xs px-2.5 py-1 font-medium rounded-full ${stockColorClass}`}>
            {stock} in stock
          </span>
          <div className="flex items-center gap-1">
            <button onClick={onEdit} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md"><Edit className="w-4 h-4" /></button>
            <button onClick={onDelete} className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-md"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}