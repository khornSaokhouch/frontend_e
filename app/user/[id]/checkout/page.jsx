// File: app/user/[id]/checkout/page.js (or your checkout page's path)

"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useShoppingCartStore } from "../../../store/useShoppingCart";
import { useShippingMethodStore } from "../../../store/useShippingMethod";
import { useUserPaymentMethodStore } from "../../../store/useUserPaymentMethod";
import { useShopOrderStore } from "../../../store/useShopOrder";
import ManagePaymentMethodsModal from "../../../components/user/checkout/ManagePaymentMethodsModal";

export default function CheckoutPage() {
  const { id: userId } = useParams();
  const router = useRouter();

  const { carts, fetchCartsByUserId } = useShoppingCartStore();
  const { shippingMethods, fetchShippingMethods } = useShippingMethodStore();
  const { userPaymentMethods, fetchUserPaymentMethods } = useUserPaymentMethodStore();
  const { createOrder } = useShopOrderStore();

  const [shippingAddress, setShippingAddress] = useState({ address: "", city: "", postalCode: "", country: "" });
  const [shippingMethodId, setShippingMethodId] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showManagePaymentModal, setShowManagePaymentModal] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchCartsByUserId(userId);
      fetchShippingMethods();
      fetchUserPaymentMethods(userId);
    }
  }, [userId, fetchCartsByUserId, fetchShippingMethods, fetchUserPaymentMethods]);

  useEffect(() => {
    if (!shippingMethodId && shippingMethods.length > 0) setShippingMethodId(shippingMethods[0].id);
  }, [shippingMethods, shippingMethodId]);

  useEffect(() => {
    if (!paymentMethodId && userPaymentMethods.length > 0) setPaymentMethodId(userPaymentMethods[0].id);
  }, [userPaymentMethods, paymentMethodId]);

  const cart = carts?.[0] || { items: [] };
  const selectedShippingMethod = shippingMethods.find((s) => s.id === shippingMethodId);

  const handleAddressChange = (e) => setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  
  const calculateTotal = () => {
    const itemsTotal = cart.items.reduce((sum, item) => sum + (item.product_item?.product?.price ?? 0) * (item.qty ?? 0), 0);
    const shippingCost = selectedShippingMethod?.price ?? 0;
    return itemsTotal + shippingCost;
  };

  const handlePaymentMethodSuccess = () => {
    fetchUserPaymentMethods(userId);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    const fullAddress = `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`;
    const order_lines = cart.items.map((item) => ({
      product_item_id: item.product_item_id,
      quantity: item.qty,
      price: item.product_item?.product?.price || 0,
    }));

    const order = {
      user_id: Number(userId),
      order_date: new Date().toISOString(),
      payment_method_id: Number(paymentMethodId),
      shipping_address: fullAddress,
      shipping_method_id: Number(shippingMethodId),
      order_total: calculateTotal(),
      order_status_id: 1,
      order_lines,
    };

    try {
      const createdOrder = await createOrder(order);
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
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 text-center mb-12">Checkout</h1>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="lg:grid lg:grid-cols-3 lg:gap-x-12">
            <main className="lg:col-span-2 space-y-8">
              <section className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-4 mb-6">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {Object.entries({Address: 'address', City: 'city', 'Postal Code': 'postalCode', Country: 'country'}).map(([label, name]) => (
                    <div key={name}>
                      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input type="text" id={name} name={name} value={shippingAddress[name]} onChange={handleAddressChange} required className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400" />
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white p-6 rounded-lg shadow-sm">
                 <h2 className="text-xl font-semibold text-gray-900 border-b pb-4 mb-6">Shipping Method</h2>
                 <div className="space-y-4">
                  {shippingMethods.map((method) => (
                    <label key={method.id} className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer transition-all ${shippingMethodId === method.id ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-300'}`}>
                      <input type="radio" name="shippingMethod" value={method.id} checked={shippingMethodId === method.id} onChange={(e) => setShippingMethodId(Number(e.target.value))} className="hidden"/>
                      <span className="font-medium text-gray-800">{method.name}</span>
                      <span className="font-semibold text-gray-900">${(method.price ?? 0).toFixed(2)}</span>
                    </label>
                  ))}
                 </div>
              </section>

              <section className="bg-white p-6 rounded-lg shadow-sm">
                 <h2 className="text-xl font-semibold text-gray-900 border-b pb-4 mb-6">Payment Method</h2>
                 <div className="space-y-4">
                  {userPaymentMethods.map((method) => (
                    <label key={method.id} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethodId === method.id ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-300'}`}>
                       <input type="radio" name="paymentMethod" value={method.id} checked={paymentMethodId === method.id} onChange={(e) => setPaymentMethodId(Number(e.target.value))} className="hidden"/>
                       <span className="font-medium text-gray-800">{method.provider} ending in {method.card_number?.slice(-4)}</span>
                    </label>
                  ))}
                 </div>
                 <button type="button" onClick={() => setShowManagePaymentModal(true)} className="mt-6 text-sm font-semibold text-orange-600 hover:text-orange-500">
                  + Add or Manage Payment Methods
                </button>
              </section>
            </main>

            <aside className="lg:col-span-1 mt-10 lg:mt-0">
              <div className="sticky top-6 bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-4 mb-6">Order Summary</h2>
                <ul className="space-y-4 text-sm text-gray-600">
                  {cart.items.map((item) => (
                    <li key={item.product_item_id} className="flex justify-between">
                      <span>{item.product_item?.product?.name} x {item.qty}</span>
                      <span className="font-medium text-gray-900">${((item.product_item?.product?.price ?? 0) * (item.qty ?? 0)).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t my-6 pt-6 space-y-4 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium text-gray-900">${cart.items.reduce((sum, item) => sum + (item.product_item?.product?.price ?? 0) * (item.qty ?? 0), 0).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-medium text-gray-900">${(selectedShippingMethod?.price ?? 0).toFixed(2)}</span></div>
                </div>
                <div className="border-t my-6 pt-6 flex justify-between text-base font-bold text-gray-900">
                  <span>Order total</span><span>${calculateTotal().toFixed(2)}</span>
                </div>
                {submitError && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">{submitError}</div>}
                <button type="submit" disabled={submitting || !paymentMethodId || !shippingMethodId} className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold text-base transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed">
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </aside>
          </div>
        </form>
      </div>

      {showManagePaymentModal && (
        <ManagePaymentMethodsModal
          userId={userId}
          onClose={() => setShowManagePaymentModal(false)}
          onSuccess={handlePaymentMethodSuccess}
        />
      )}
    </div>
  );
}