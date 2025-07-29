"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useShopOrderStore } from "../../../store/useShopOrder";
import { useOrderStatusStore } from "../../../store/useOrderStatus";
import toast from "react-hot-toast";

const UserOrdersPage = () => {
  const { id: userId } = useParams();

  const {
    orders,
    fetchOrdersByUser,  // Make sure your store exports this
    loading,
    error,
    deleteOrder,
  } = useShopOrderStore();

  const {
    orderStatuses,
    fetchOrderStatuses,
    updateOrderStatus,
    loading: statusesLoading,
    error: statusesError,
  } = useOrderStatusStore();

  const [editId, setEditId] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchOrdersByUser(userId);
      fetchOrderStatuses();
    }
  }, [userId, fetchOrdersByUser, fetchOrderStatuses]);

  const handleEditClick = (order) => {
    setEditId(order.id);
    setEditOrder({ ...order });
    setActionError(null);
  };

  const handleStatusChange = (e) => {
    const statusId = Number(e.target.value);
    setEditOrder((prev) => ({
      ...prev,
      order_status_id: statusId,
    }));
  };

  const handleSaveClick = async () => {
    if (!editOrder?.order_status_id) {
      setActionError("Please select a valid status.");
      return;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      await updateOrderStatus(editId, editOrder.order_status_id);
      await fetchOrdersByUser(userId);
      setEditId(null);
      setEditOrder(null);
      toast.success("Order status updated!");
    } catch (error) {
      setActionError("Failed to update order status.");
      toast.error("Failed to update order status.");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDelete = (id) => {
    toast((t) => (
      <div className="p-4">
        <p>Are you sure you want to delete this order?</p>
        <div className="mt-2 flex justify-end gap-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setActionLoading(true);
              setActionError(null);

              const success = await deleteOrder(id);

              if (!success) {
                setActionError("Failed to delete order.");
                toast.error("Failed to delete order.");
              } else {
                if (editId === id) {
                  setEditId(null);
                  setEditOrder(null);
                }
                toast.success("Order deleted successfully!");
                await fetchOrdersByUser(userId);
              }

              setActionLoading(false);
            }}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 px-3 py-1 rounded"
          >
            No
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      style: { minWidth: "250px" },
    });
  };

  if (loading || statusesLoading)
    return (
      <p className="text-center mt-10 text-lg font-medium">
        Loading orders...
      </p>
    );

  if (error || statusesError)
    return (
      <p className="text-center mt-10 text-red-600">{error || statusesError}</p>
    );

  if (!orders || orders.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">
        No orders found for this user.
      </p>
    );

  return (
    <main className="max-w-5xl mx-auto px-4 mt-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Orders for User {userId}
      </h1>

      {actionError && (
        <p className="text-red-600 text-center mb-4">{actionError}</p>
      )}

      <ul className="space-y-6">
        {orders.map((order) => (
          <li key={order.id} className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p>
                  <strong>Order Date:</strong>{" "}
                  {order.order_date ? new Date(order.order_date).toLocaleDateString() : "N/A"}
                </p>
                <p><strong>Total:</strong> ${order.order_total ?? "N/A"}</p>
                <p>
                  <strong>Shipping:</strong>{" "}
                  {order.shipping_method?.name
                    ? `${order.shipping_method.name} ($${order.shipping_method.price})`
                    : "N/A"}
                </p>
              </div>

              <div>
                <p><strong>Address:</strong> {order.shipping_address || "N/A"}</p>
                <p><strong>Payment:</strong> {order.payment_method?.provider || "N/A"}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  {editId === order.id ? (
                    <select
                      value={editOrder?.order_status_id ?? order.order_status_id}
                      onChange={handleStatusChange}
                      className="mt-1 border rounded px-2 py-1"
                      disabled={actionLoading}
                    >
                      {orderStatuses.map((status) => (
                        <option key={status.id} value={status.id}>
                          {status.status}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="ml-1 font-medium text-blue-600">
                      {order.order_status?.status || "N/A"}
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-4">
              {editId === order.id ? (
                <>
                  <button
                    onClick={handleSaveClick}
                    disabled={actionLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditId(null);
                      setEditOrder(null);
                      setActionError(null);
                    }}
                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEditClick(order)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(order.id)}
                    disabled={actionLoading}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default UserOrdersPage;
