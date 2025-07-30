"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useShopOrderStore } from "../../../../store/useShopOrder";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId || params.confirmationId; // Handle different route param names

  const {
    fetchOrder,
    currentOrder: order,
    loading,
    error,
  } = useShopOrderStore();

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId, fetchOrder]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-700">Loading your order details...</p>
          <div className="mt-4 w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-red-600">Oops! Something went wrong.</h2>
          <p className="mt-2 text-gray-600">We couldn't load your order details. Please try again later.</p>
          <p className="mt-4 text-sm text-red-500 bg-red-50 p-3 rounded-md">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-semibold text-gray-600">No order found.</p>
      </div>
    );
  }
  
  // Calculate subtotal from order lines
  const subtotal = order.order_lines?.reduce((sum, line) => sum + (line.price * line.quantity), 0) ?? 0;
  const shippingCost = order.shipping_method?.price ?? 0;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white shadow-lg rounded-xl p-8 sm:p-10 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-5 text-3xl font-extrabold text-gray-900">Thank you for your order!</h1>
          <p className="mt-2 text-base text-gray-600">
            Your order has been placed successfully. A confirmation email has been sent.
          </p>
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-md p-3 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Order ID</span>
            <span className="text-sm font-semibold font-mono text-orange-600">{order.id}</span>
          </div>
        </div>

        <div className="mt-8 bg-white shadow-lg rounded-xl p-8 sm:p-10">
          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-200 pb-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Shipping Address</h3>
              <p className="mt-2 text-gray-800 whitespace-pre-line">{order.shipping_address || "N/A"}</p>
            </div>
            <div className="text-left md:text-right">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Order Date</h3>
              <p className="mt-2 text-gray-800">{new Date(order.order_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
             <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Payment Method</h3>
              <p className="mt-2 text-gray-800">{order.payment_method?.provider || order.payment_method?.type || "N/A"}</p>
            </div>
            <div className="text-left md:text-right">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Shipping Method</h3>
              <p className="mt-2 text-gray-800">{order.shipping_method?.name || "N/A"}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">What you ordered</h2>
            <ul className="divide-y divide-gray-200">
              {order.order_lines?.length > 0 ? (
                order.order_lines.map((line) => (
                  <li key={line.id} className="flex items-center py-5">
                    <img
                      src={line.product_item?.product?.product_image_url || 'https://via.placeholder.com/150'} // Placeholder image
                      alt={line.product_item?.product?.name || "Product image"}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div className="ml-4 flex-auto">
                      <p className="font-semibold text-gray-900">{line.product_item?.product?.name || "Unknown Product"}</p>
                      <p className="text-sm text-gray-500">Quantity: {line.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ${(line.price * line.quantity).toFixed(2)}
                    </p>
                  </li>
                ))
              ) : (
                <li className="py-4 text-gray-500">No items found in this order.</li>
              )}
            </ul>
          </div>

          {/* Cost Summary */}
          <div className="mt-10 pt-6 border-t border-gray-200">
            <div className="w-full max-w-sm ml-auto space-y-3 text-sm">
               <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
               <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-900">${shippingCost.toFixed(2)}</span>
              </div>
               <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-3 mt-3">
                <span>Order Total</span>
                <span>${order.order_total != null ? order.order_total.toFixed(2) : '0.00'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}