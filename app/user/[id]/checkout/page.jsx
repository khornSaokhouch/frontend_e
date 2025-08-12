"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";

// Store Imports
import { useShoppingCartStore } from "../../../store/useShoppingCart";
import { useShippingMethodStore } from "../../../store/useShippingMethod";
import { useUserPaymentMethodStore } from "../../../store/useUserPaymentMethod";
import { useShopOrderStore } from "../../../store/useShopOrder";
import { useCartItemStore } from "../../../store/useCartItemStore";

// Component Imports
import ShippingAddressForm from "../../../components/user/checkout/ShippingAddressForm";
import ShippingMethodSelector from "../../../components/user/checkout/ShippingMethodSelector";
import PaymentMethodSelector from "../../../components/user/checkout/PaymentMethodSelector";
import OrderSummary from "../../../components/user/checkout/OrderSummary";
import ManagePaymentMethodsModal from "../../../components/user/checkout/ManagePaymentMethodsModal";

export default function CheckoutPage() {
  const { id: userId } = useParams();
  const router = useRouter();

  // Zustand Stores
  const { carts, fetchCartsByUserId } = useShoppingCartStore();
  const { shippingMethods, fetchShippingMethods } = useShippingMethodStore();
  const { userPaymentMethods, fetchUserPaymentMethods } = useUserPaymentMethodStore();
  const { createOrder } = useShopOrderStore();
  const { cartItems, fetchCartItems } = useCartItemStore();

  // State Management
  const [shippingAddress, setShippingAddress] = useState({
    address: "", city: "", postalCode: "", country: "",
  });
  const [shippingMethodId, setShippingMethodId] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showManagePaymentModal, setShowManagePaymentModal] = useState(false);

  // Data Fetching
  useEffect(() => {
    if (userId) {
      fetchCartsByUserId(userId);
      fetchShippingMethods();
      fetchUserPaymentMethods(userId);
    }
  }, [userId, fetchCartsByUserId, fetchShippingMethods, fetchUserPaymentMethods]);

  const cart = useMemo(() => {
    const userCarts = carts.filter((c) => c.user_id === Number(userId));
    if (!userCarts.length) return null;
    return userCarts.reduce((latest, current) =>
      new Date(current.updated_at) > new Date(latest.updated_at) ? current : latest
    );
  }, [carts, userId]);

  useEffect(() => {
    if (cart?.id) {
      fetchCartItems(cart.id);
    }
  }, [cart, fetchCartItems]);

  // Set Default Selections
  useEffect(() => {
    if (!shippingMethodId && shippingMethods.length > 0) {
      setShippingMethodId(shippingMethods[0].id);
    }
  }, [shippingMethods, shippingMethodId]);

  useEffect(() => {
    if (!paymentMethodId && userPaymentMethods.length > 0) {
      setPaymentMethodId(userPaymentMethods[0].id);
    }
  }, [userPaymentMethods, paymentMethodId]);

  // Derived State
  const filteredCartItems = useMemo(() =>
    cartItems.filter((item) => item.product_item && item.product_item.product),
    [cartItems]
  );
  const selectedItem = useMemo(() =>
    filteredCartItems.find((item) => item.product_item_id === selectedItemId),
    [filteredCartItems, selectedItemId]
  );
  const selectedShippingMethod = useMemo(() =>
    shippingMethods.find((s) => s.id === shippingMethodId),
    [shippingMethods, shippingMethodId]
  );

  const total = useMemo(() => {
    const itemTotal = selectedItem
      ? (selectedItem.product_item.product.price ?? 0) * (selectedItem.qty ?? 0)
      : 0;
    const shippingCost = selectedShippingMethod?.price ?? 0;
    return itemTotal + shippingCost;
  }, [selectedItem, selectedShippingMethod]);

  // Handlers
  const handleAddressChange = (e) =>
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });

  const handlePaymentMethodSuccess = () => {
    fetchUserPaymentMethods(userId);
    setShowManagePaymentModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) {
      setSubmitError("Please select an item to checkout.");
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    const order = {
      user_id: Number(userId),
      order_date: new Date().toISOString(),
      payment_method_id: Number(paymentMethodId),
      shipping_address: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`,
      shipping_method_id: Number(shippingMethodId),
      order_total: total,
      order_status_id: 1, // Assuming 1 is a default "pending" status
      order_lines: [{
        product_item_id: selectedItem.product_item_id,
        quantity: selectedItem.qty,
        price: selectedItem.product_item.product.price || 0,
      }],
    };

    try {
      const createdOrder = await createOrder(order);
      await fetchCartsByUserId(userId); // Refreshes cart state
      router.push(`/user/${userId}/checkout/${createdOrder.id}`);
    } catch (error) {
      setSubmitError(error.message || "Failed to submit order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 text-center mb-12">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="lg:grid lg:grid-cols-3 lg:gap-x-12">
            <main className="lg:col-span-2 space-y-8">
              <ShippingAddressForm
                shippingAddress={shippingAddress}
                onAddressChange={handleAddressChange}
              />
              <ShippingMethodSelector
                methods={shippingMethods}
                selectedMethodId={shippingMethodId}
                onSelectMethod={setShippingMethodId}
              />
              <PaymentMethodSelector
                methods={userPaymentMethods}
                selectedMethodId={paymentMethodId}
                onSelectMethod={setPaymentMethodId}
                onManageClick={() => setShowManagePaymentModal(true)}
              />
            </main>
            <OrderSummary
              cartItems={filteredCartItems}
              selectedItemId={selectedItemId}
              onItemSelect={setSelectedItemId}
              selectedShippingMethod={selectedShippingMethod}
              total={total}
              isSubmitting={submitting}
              submitError={submitError}
            />
          </div>
        </form>

        {showManagePaymentModal && (
          <ManagePaymentMethodsModal
            userId={userId}
            onClose={() => setShowManagePaymentModal(false)}
            onSuccess={handlePaymentMethodSuccess}
          />
        )}
      </div>
    </div>
  );
}