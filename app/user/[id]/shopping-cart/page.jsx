"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useShoppingCartStore } from "../../../store/useShoppingCart";
import { toast } from "react-hot-toast";
import { CreditCard, Frown, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import CartCard from "../../../components/user/cart/CartCard";

export default function ShoppingCartPage() {
  const { id: userId } = useParams();
  const {
    carts = [],
    loading,
    error,
    fetchCartsByUserId,
    updateCart,
    optimisticallyUpdateItemQuantity,
    setCurrentUserId,
  } = useShoppingCartStore();

  useEffect(() => {
    if (userId) {
      setCurrentUserId(userId);
      fetchCartsByUserId(userId);
    }
  }, [userId, fetchCartsByUserId, setCurrentUserId]);

  const handleQuantityChange = async (productItemId, newQty) => {
    const cart = carts[0];
    if (!cart || newQty < 1) return;

    optimisticallyUpdateItemQuantity(cart.id, productItemId, newQty);

    const updatedItems = cart.items.map(item =>
      item.product_item_id === productItemId
        ? { ...item, qty: newQty }
        : item
    );

    try {
      await updateCart(cart.id, { items: updatedItems });
    } catch (err) {
      toast.error("Could not update quantity. Reverting.");
      await fetchCartsByUserId(userId);
    }
  };

  const handleDeleteItem = (productItemId) => {
    const cart = carts[0];
    if (!cart) return;

    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Remove this item from your cart?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              performItemDelete(cart, productItemId);
            }}
            className="px-4 py-1 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Remove
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-1 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };

  const performItemDelete = async (cart, productItemId) => {
    const updatedItems = cart.items.filter(item => item.product_item_id !== productItemId);
    await toast.promise(
      updateCart(cart.id, { items: updatedItems }).then(() => fetchCartsByUserId(userId)),
      {
        loading: 'Removing item...',
        success: 'Item removed!',
        error: 'Failed to remove item.',
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white shadow-lg rounded-xl">
          <Frown className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-800">Something Went Wrong</h3>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const hasItems = carts.some((cart) => cart.items?.length > 0);
  if (!hasItems) {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="max-w-4xl mx-auto px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">Your Shopping Cart</h1>
          <p className="mt-4 text-lg text-gray-600">Review your items and proceed to checkout.</p>
        </div>

        <div className="space-y-8">
          {carts.map((cart) => (
            <CartCard
              key={cart.id}
              cart={cart}
              userId={userId}
              onQuantityChange={handleQuantityChange}
              onDeleteItem={handleDeleteItem}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
