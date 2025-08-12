"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useShoppingCartStore } from "../../../store/useShoppingCart";
import { useUserStore } from "../../../store/userStore";

export default function RightSidebar({ product }) {
  const userId = useUserStore((state) => state.user?.id);
  const { carts = [], fetchCartsByUserId } = useShoppingCartStore();

  useEffect(() => {
    if (userId) {
      fetchCartsByUserId(userId);
    }
  }, [userId, fetchCartsByUserId]);

  // Combine all items from all carts
  const allItems = carts.flatMap((cart) => cart.items || []);

  // Filter items by current product ID
  const filteredItems = allItems.filter(
    (item) => String(item.product_item?.product?.id) === String(product?.id)
  );

  // Calculate subtotal for filtered items
  const subTotal = filteredItems.reduce((total, item) => {
    const price = item.product_item?.product?.price || 0;
    return total + price * item.qty;
  }, 0);

  const isCartEmpty = filteredItems.length === 0;

  return (
    <div className="lg:col-span-1 p-6 flex flex-col gap-6">
      {/* Brand Card */}
      <div className="bg-slate-100 rounded-2xl p-4">
        <h3 className="text-lg font-semibold text-slate-700 mb-2">Brand: Sonex</h3>
        <Image
          src="/sonex-logo.png"
          alt="Sonex Logo"
          width={150}
          height={50}
          className="object-contain mx-auto"
        />
      </div>

      {/* Your Cart Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between h-full shadow-sm">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4">Your Cart</h3>

          {isCartEmpty ? (
            <div className="text-center py-10">
              <ShoppingCart className="w-12 h-12 mx-auto text-slate-300" />
              <p className="mt-2 text-sm text-slate-500">Your cart is empty.</p>
            </div>
          ) : (
            <>
              <div className="max-h-60 overflow-y-auto pr-2 -mr-2 space-y-4 custom-scrollbar">
                {filteredItems.map((item) => (
                  <div key={item.product_item_id} className="flex items-center gap-4">
                    <Image
                      src={item.product_item?.product?.product_image_url || "/placeholder.svg"}
                      alt={item.product_item?.product?.name || "Product"}
                      width={64}
                      height={64}
                      className="object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {item.product_item?.product?.name || "Product"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {item.qty} × ${item.product_item?.product?.price?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="border-slate-200 my-4" />
              <div className="flex items-center justify-between font-semibold">
                <p className="text-slate-700">Subtotal:</p>
                <p className="text-slate-800">${subTotal.toFixed(2)}</p>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <Link
            href={userId ? `/user/${userId}/shopping-cart` : "/login"}
            className={`w-full text-center bg-slate-800 text-white py-3 px-6 rounded-xl font-semibold transition-colors ${
              isCartEmpty ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-900"
            }`}
            aria-disabled={isCartEmpty}
            onClick={(e) => isCartEmpty && e.preventDefault()}
          >
            View Cart
          </Link>
          <Link
            href={userId ? `/user/${userId}/checkout` : "/login"}
            className={`w-full text-center bg-green-500 text-white py-3 px-6 rounded-xl font-semibold transition-colors ${
              isCartEmpty ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
            }`}
            aria-disabled={isCartEmpty}
            onClick={(e) => isCartEmpty && e.preventDefault()}
          >
            Checkout
          </Link>

          <p className="mt-4 text-slate-500 flex items-center justify-center text-xs">
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            Ships From{" "}
            <span className="font-semibold text-slate-700 ml-1">United States</span>
          </p>
        </div>
      </div>
    </div>
  );
}
