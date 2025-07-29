"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useShoppingCartStore } from "../../../store/useShoppingCart";
import { useShippingMethodStore } from "../../../store/useShippingMethod";
import { useUserPaymentMethodStore } from "../../../store/useUserPaymentMethod";
import { useShopOrderStore } from "../../../store/useShopOrder";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { id: userId } = useParams();
  const router = useRouter();

  const { carts, fetchCartsByUserId } = useShoppingCartStore();
  const {
    shippingMethods,
    loading: shippingLoading,
    error: shippingError,
    fetchShippingMethods,
  } = useShippingMethodStore();

  const {
    userPaymentMethods,
    loading: paymentLoading,
    error: paymentError,
    fetchUserPaymentMethods,
  } = useUserPaymentMethodStore();

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });
  const { createOrder } = useShopOrderStore();

  const [shippingMethodId, setShippingMethodId] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchCartsByUserId(userId);
      fetchShippingMethods();
      fetchUserPaymentMethods(userId);
    }
  }, [userId, fetchCartsByUserId, fetchShippingMethods, fetchUserPaymentMethods]);

  useEffect(() => {
    if (shippingMethods.length > 0) {
      setShippingMethodId(shippingMethods[0].id);
    }
  }, [shippingMethods]);

  useEffect(() => {
    if (userPaymentMethods.length > 0) {
      setPaymentMethodId(userPaymentMethods[0].id);
    }
  }, [userPaymentMethods]);

  const cart = carts?.[0] || { items: [] };

  const handleAddressChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    const itemsTotal = cart.items.reduce((sum, item) => {
      const price = item.product_item?.product?.price ?? 0;
      return sum + price * (item.qty ?? 0);
    }, 0);
  
    const shippingCost =
      shippingMethods.find((s) => s.id === shippingMethodId)?.cost ?? 0;
  
    return itemsTotal + shippingCost;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
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
  
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
  
    try {
      const createdOrder = await createOrder(order); // expect created order object with ID
      setSubmitSuccess(true);
      // Redirect to confirmation page with order ID
      router.push(`/user/${userId}/checkout/${createdOrder.id}`);
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit order');
      alert('Failed to submit order');
    } finally {
      setSubmitting(false);
    }
  };
  if (shippingLoading || paymentLoading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
        Loading checkout data...
      </div>
    );

  if (shippingError)
    return (
      <div className="text-red-600 font-semibold">
        Error loading shipping methods: {shippingError}
      </div>
    );

  if (paymentError)
    return (
      <div className="text-red-600 font-semibold">
        Error loading payment methods: {paymentError}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {submitSuccess && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          Order submitted successfully!
        </div>
      )}

      {submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10" noValidate>
        {/* Shipping Address */}
        <section>
          <h2 className="text-xl font-semibold mb-5 border-b pb-2">
            Shipping Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["address", "city", "postalCode", "country"].map((field) => (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  id={field}
                  name={field}
                  value={shippingAddress[field]}
                  onChange={handleAddressChange}
                  required
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Shipping Method */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Shipping Method
          </h2>
          <select
            value={shippingMethodId ?? ""}
            onChange={(e) => setShippingMethodId(Number(e.target.value))}
            className="border border-gray-300 p-3 rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          >
            {shippingMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.name} (${(method.price ?? 0).toFixed(2)})
              </option>
            ))}
          </select>
        </section>

        {/* Payment Method */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Payment Method
          </h2>
          <select
            value={paymentMethodId ?? ""}
            onChange={(e) => setPaymentMethodId(Number(e.target.value))}
            className="border border-gray-300 p-3 rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          >
            {userPaymentMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.provider
                  ? `${method.provider} - ****${method.card_number?.slice(-4)}`
                  : method.type}
              </option>
            ))}
          </select>
        </section>

        {/* Order Summary */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Order Summary
          </h2>
          <ul className="mb-6 divide-y divide-gray-200">
            {cart.items.length === 0 && (
              <li className="py-4 text-gray-500">No items in cart.</li>
            )}
            {cart.items.map((item) => {
              const product = item.product_item?.product;
              const price = product?.price ?? 0;
              return (
                <li key={item.product_item_id} className="flex justify-between py-3">
                  <span className="font-medium text-gray-900">
                    {product?.name} x {item.qty}
                  </span>
                  <span className="font-semibold">
                    ${(price * (item.qty ?? 0)).toFixed(2)}
                  </span>
                </li>
              );
            })}
            <li className="flex justify-between py-3 font-semibold border-t border-gray-300">
              <span>Shipping</span>
              <span>
                $
                {(
                  shippingMethods.find((s) => s.id === shippingMethodId)?.price ?? 0
                ).toFixed(2)}
              </span>
            </li>
            <li className="flex justify-between py-4 font-bold text-lg border-t border-gray-300">
              <span>Total</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </li>
          </ul>
        </section>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-semibold transition-shadow shadow-md ${
            submitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? "Submitting..." : "Submit Order"}
        </button>
      </form>
    </div>
  );
}
