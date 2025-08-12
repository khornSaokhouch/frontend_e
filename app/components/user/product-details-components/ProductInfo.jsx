import { ShieldCheck } from "lucide-react";

export default function ProductInfo({ product }) {
  if (!product) return null;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
      <h2 className="text-xl font-semibold text-gray-900">Dark Grey</h2>
      <p className="mt-2 text-3xl font-bold text-gray-800">${product.price?.toFixed(2)}</p>
      <p className="mt-4 text-gray-600 text-sm">
        Intel LGA 1700 Socket: Supports 13th & 12th Gen Intel Core Processors. DDR5 Compatible: 4*SMD DIMMs with XMP 3.0 Memory Module Support Commanding Power Design: Twin 16+1+2 Phases Digital VRM
      </p>
      <button className="bg-green-100 text-green-400 py-1 px-4 rounded-md mt-4 text-sm">
        Free Shipping
      </button>
      <div className="mt-4 flex items-center">
        <ShieldCheck className="w-4 h-4 text-green-500 mr-1" />
        <p className="text-sm text-green-600 font-medium">In Stock</p>
      </div>
    </div>
  );
}