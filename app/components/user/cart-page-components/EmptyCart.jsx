import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function EmptyCart() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <ShoppingBag className="w-24 h-24 text-orange-300 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any items yet.</p>
        <Link href="/">
          <button className="bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition-all">
            Start Shopping
          </button>
        </Link>
      </div>
    </div>
  );
}