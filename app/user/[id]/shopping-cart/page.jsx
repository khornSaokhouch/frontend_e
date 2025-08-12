"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useShoppingCartStore } from "../../../store/useShoppingCart";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import CartCard from "../../../components/user/cart/CartCard";
import CartHeader from "../../../components/user/cart-page-components/CartHeader";
import CartLoading from "../../../components/user/cart-page-components/CartLoading";
import CartError from "../../../components/user/cart-page-components/CartError";
import EmptyCart from "../../../components/user/cart-page-components/EmptyCart";

export default function ShoppingCartPage() {
  const { id: userId } = useParams();

  const {
    carts = [],
    loading,
    error,
    fetchCartsByUserId,
    updateCart,
    deleteCart,
    optimisticallyUpdateItemQuantity,
    setCurrentUserId,
  } = useShoppingCartStore();

  useEffect(() => {
    if (userId) {
      setCurrentUserId(userId);
      fetchCartsByUserId(userId);
    }
  }, [userId, setCurrentUserId, fetchCartsByUserId]);

  const handleQuantityChange = async (productItemId, newQty) => {
    const cart = carts[0];
    if (!cart || newQty < 1) return;

    optimisticallyUpdateItemQuantity(cart.id, productItemId, newQty);

    const updatedItems = cart.items.map((item) =>
      item.product_item_id === productItemId ? { ...item, qty: newQty } : item
    );

    try {
      await updateCart(cart.id, { items: updatedItems });
    } catch (err) {
      toast.error("Could not update quantity. Reverting.");
      await fetchCartsByUserId(userId);
    }
  };

  const performItemDelete = async (cart, productItemId) => {
    const updatedItems = cart.items.filter(
      (item) => item.product_item_id !== productItemId
    );

    await toast.promise(
      updateCart(cart.id, { items: updatedItems }).then(() =>
        fetchCartsByUserId(userId)
      ),
      {
        loading: "Removing item...",
        success: "Item removed!",
        error: "Failed to remove item.",
      }
    );
  };

  const handleDeleteItem = async (productItemId) => {
    const cart = carts[0];
    if (!cart) return;

    try {
      await performItemDelete(cart, productItemId);
    } catch (error) {
      toast.error("Failed to remove item.");
    }
  };

  const handleDeleteCart = (cartId) => {
    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="font-semibold">
            Are you sure you want to clear your cart?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  await toast.promise(deleteCart(cartId), {
                    loading: "Clearing cart...",
                    success: "Cart cleared!",
                    error: "Failed to clear cart.",
                  });
                  await fetchCartsByUserId(userId);
                } catch (e) {
                  console.error("Delete cart error:", e);
                }
              }}
              className="px-4 py-1 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Clear
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-4 py-1 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )
    );
  };

  if (loading) return <CartLoading />;
  if (error) return <CartError error={error} />;

  const hasItems = carts.some((cart) => cart.items?.length > 0);
  if (!hasItems) return <EmptyCart />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <motion.div
        className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <CartHeader />
        
        <div className="mt-8 space-y-8">
          {carts.map((cart) => (
            <motion.div key={cart.id} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
              <CartCard
                cart={cart}
                userId={userId}
                onQuantityChange={handleQuantityChange}
                onDeleteItem={handleDeleteItem}
                onDeleteCart={() => handleDeleteCart(cart.id)} // Pass the handler
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}