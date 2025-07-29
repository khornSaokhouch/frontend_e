"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useShoppingCartStore } from "../../../store/useShoppingCart";
import { toast } from "react-hot-toast";
import { Trash2, Plus, Minus, Heart, CreditCard } from "lucide-react";
import ConfirmDeletionCart from "../../../components/user/ConfirmDeletionCart";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ShoppingCartComponent() {
  const { id: userId } = useParams();
  const {
    carts = [],
    loading,
    error,
    fetchCartsByUserId,
    deleteCart,
    updateCart, // Add this action to your store to update qty
  } = useShoppingCartStore();

  const [showConfirm, setShowConfirm] = useState(false);
  const [cartToDelete, setCartToDelete] = useState(null);

  useEffect(() => {
    if (userId) fetchCartsByUserId(userId);
  }, [userId, fetchCartsByUserId]);

  const confirmDelete = (cartId) => {
    setCartToDelete(cartId);
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!cartToDelete) return;
    try {
      toast.loading("Removing cart...");
      await deleteCart(cartToDelete);
      await fetchCartsByUserId(userId);
      toast.dismiss();
      toast.success("Cart removed!");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to remove cart: " + (err.message || err));
    } finally {
      setShowConfirm(false);
      setCartToDelete(null);
    }
  };

  // Handler for quantity change
  const handleQtyChange = async (cartId, itemId, newQty) => {
    if (newQty < 1) return; // Avoid invalid qty

    try {
      // Optimistically update UI (optional: you can update local state too if needed)
      toast.loading("Updating quantity...");
      await updateCart(cartId, itemId, newQty);
      await fetchCartsByUserId(userId);
      toast.dismiss();
      toast.success("Quantity updated!");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to update quantity: " + (err.message || err));
    }
  };

  const updateQty = async (productItemId, delta) => {
    const cart = carts[0]; // Assuming 1 cart per user; adjust if multiple
    if (!cart) return;
  
    const item = cart.items.find(
      (i) => i.product_item_id === productItemId
    );
    if (!item) return;
  
    const newQty = item.qty + delta;
    if (newQty < 1) return; // prevent quantity < 1
  
    try {
      toast.loading("Updating quantity...");
      // Call updateCart with new qty for that item
      // Construct payload based on your backend structure
      // Example payload (adjust if needed):
      const payload = {
        user_id: userId,
        items: cart.items.map((i) =>
          i.product_item_id === productItemId
            ? { ...i, qty: newQty }
            : i
        ),
      };
  
      await updateCart(cart.id, payload);
      await fetchCartsByUserId(userId);
      toast.dismiss();
      toast.success("Quantity updated!");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to update quantity: " + (err.message || err));
    }
  };
  

  if (loading)
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-orange-600 font-medium">
            Loading your cart...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );

  const hasItems = carts.some((cart) => cart.items?.length);

  if (!carts.length || !hasItems)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-12 h-12 text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any items to your cart yet.
          </p>
          <button className="bg-gradient-to-r from-orange-500 to-rose-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105">
            Start Shopping
          </button>
        </div>
      </div>
    );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const calculateCartTotal = (cart) => {
    const groupedItems = {};
    cart.items.forEach((item) => {
      const key = item.product_item_id || item.product_item?.id;
      if (!key) return;
      if (!groupedItems[key]) {
        groupedItems[key] = { ...item, qty: item.qty };
      } else {
        groupedItems[key].qty += item.qty;
      }
    });

    return Object.values(groupedItems).reduce((total, item) => {
      const price = item.product_item?.product?.price || 0;
      return total + price * item.qty;
    }, 0);
  };

  return (
    <div className="min-h-screen ">
      <motion.div
        className="max-w-6xl mx-auto px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your Shopping Cart
          </h1>
          <p className="text-gray-600">
            Review your items and proceed to checkout
          </p>
        </motion.div>

        {/* Cart Items */}
        <div className="space-y-8">
          {carts.map((cart) => {
            const groupedItems = {};
            cart.items.forEach((item) => {
              const key = item.product_item_id || item.product_item?.id;
              if (!key) return;
              if (!groupedItems[key]) {
                groupedItems[key] = { ...item, qty: item.qty };
              } else {
                groupedItems[key].qty += item.qty;
              }
            });

            const cartTotal = calculateCartTotal(cart);

            return (
              <motion.div
                key={cart.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-8">
                  <div className="space-y-6">
                    {Object.values(groupedItems).map((item) => {
                      const product = item.product_item?.product;
                      const itemTotal = (product?.price || 0) * item.qty;

                      return (
                        <motion.div
                          key={item.product_item_id}
                          className="flex items-center space-x-6 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                          whileHover={{ scale: 1.01 }}
                        >
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={
                                product?.product_image_url ||
                                "/placeholder.svg?height=80&width=80&query=product"
                              }
                              alt={product?.name || "Product"}
                              className="w-20 h-20 object-cover rounded-xl shadow-md"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                              {product?.name || "Unknown Product"}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              ${product?.price?.toFixed(2) || "0.00"} each
                            </p>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-600">
                                Quantity:
                              </span>
                              <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200">
                                <button
                                  className="p-2 hover:bg-gray-50 rounded-l-lg transition-colors"
                                  onClick={() =>
                                    handleQtyChange(
                                      cart.id,
                                      item.product_item_id,
                                      item.qty - 1
                                    )
                                  }
                                >
                                  <Minus className="w-4 h-4 text-gray-600" />
                                </button>
                                <span className="px-4 py-2 font-medium text-gray-800 min-w-[3rem] text-center">
                                  {item.qty}
                                </span>
                                <button
                                  className="p-2 hover:bg-gray-50 rounded-r-lg transition-colors"
                                  onClick={() =>
                                    handleQtyChange(
                                      cart.id,
                                      item.product_item_id,
                                      item.qty + 1
                                    )
                                  }
                                >
                                  <Plus className="w-4 h-4 text-gray-600" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Item Actions & Price */}
                          <div className="flex items-center space-x-4">
                            <p className="text-2xl font-bold text-gray-800">
                              ${itemTotal.toFixed(2)}
                            </p>
                            <button
                              onClick={() => confirmDelete(cart.id)}
                              className="text-red-500 p-2 rounded-full hover:bg-red-100 transition-all duration-200"
                              aria-label="Delete Cart"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Cart Footer */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-3xl font-bold text-gray-800">
                          ${cartTotal.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium">
                          Save for Later
                        </button>
                        <Link href={`/user/${userId}/checkout`}>
  <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl hover:from-orange-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center space-x-2">
    <CreditCard className="w-5 h-5" />
    <span>Checkout</span>
  </button>
</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Confirmation Modal */}
        <ConfirmDeletionCart
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={handleDeleteConfirmed}
          cartId={cartToDelete}
        />
      </motion.div>
    </div>
  );
}
