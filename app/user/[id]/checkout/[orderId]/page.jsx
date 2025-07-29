"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useShopOrderStore } from "../../../../store/useShopOrder";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
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
  }, [orderId]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!order) return <p>No order found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-3xl font-bold mb-6 text-center">Order Confirmation</h1>

      <p>Thank you for your order! Here are the details:</p>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <p><strong>Order ID:</strong> {order.id}</p>
        <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
        <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
        <p>
          <strong>Payment Method:</strong>{" "}
          {order.payment_method?.provider || order.payment_method?.type || "N/A"}
        </p>
        <p>
  <strong>Shipping Method:</strong>{" "}
  {order.shipping_method?.name || "N/A"} (
  ${order.shipping_method?.price != null
    ? order.shipping_method.price.toFixed(2)
    : "0.00"}
  )
</p>

        <p>
          <strong>Total:</strong>{" "}
          ${order.order_total != null ? order.order_total.toFixed(2) : "0.00"}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Items</h2>
        <ul>
          {order.order_lines?.length > 0 ? (
            order.order_lines.map((line) => (
              <li key={line.id} className="flex justify-between py-2 border-b">
                <span>
                  {line.product_item?.product?.name || "Unknown Product"} x{" "}
                  {line.quantity}
                </span>
                <span>
                  $
                  {line.price != null && line.quantity != null
                    ? (line.price * line.quantity).toFixed(2)
                    : "0.00"}
                </span>
              </li>
            ))
          ) : (
            <li>No items found.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
