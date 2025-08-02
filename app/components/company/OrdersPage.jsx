// /app/admin/[id]/order/page.jsx (or wherever this page lives)

"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useShopOrderStore } from "../../store/useShopOrder";
import { useOrderStatusStore } from "../../store/useOrderStatus";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";

// Import the new modals
import ConfirmationModal from "../company/order/ConfirmationModal";
import EditOrderModal from "../company/order/EditOrderModal";

// Helper for status badge colors
const getStatusColor = (statusName) => {
  const name = statusName?.toLowerCase() || '';
  if (name.includes("completed") || name.includes("delivered")) return "bg-green-100 text-green-800";
  if (name.includes("pending")) return "bg-yellow-100 text-yellow-800";
  if (name.includes("cancelled") || name.includes("refunded")) return "bg-red-100 text-red-800";
  if (name.includes("processing") || name.includes("shipped")) return "bg-blue-100 text-blue-800";
  return "bg-slate-100 text-slate-800";
};

export default function CompanyOrdersPage() {
  const { id: companyId } = useParams();

  const { orders, fetchOrders, loading: ordersLoading, deleteOrder } = useShopOrderStore();
  const { orderStatuses, fetchOrderStatuses, updateShopOrderStatus, loading: statusesLoading } = useOrderStatusStore();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (companyId) {
      fetchOrders(companyId);
      fetchOrderStatuses();
    }
  }, [companyId, fetchOrders, fetchOrderStatuses]);

  // --- Modal Triggers ---
  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  // --- Modal Actions ---
  const handleSaveStatus = async (orderId, newStatusId) => {
    setActionLoading(true);
    try {
      await updateShopOrderStatus(orderId, newStatusId);
      await fetchOrders(companyId); // Refetch to show updated data
      toast.success("Order status updated successfully!");
      setIsEditModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      toast.error("Failed to update order status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedOrder) return;
    setActionLoading(true);
    try {
      await deleteOrder(selectedOrder.id);
      await fetchOrders(companyId);
      toast.success("Order deleted successfully!");
      setIsDeleteModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      toast.error("Failed to delete order.");
    } finally {
      setActionLoading(false);
    }
  };

  if (ordersLoading || statusesLoading) {
    return <div className="text-center p-10">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center p-10 text-slate-500">No orders found.</div>;
  }

  return (
<>

  {/* Table Container */}
  <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-500">
        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
          <tr>
            <th scope="col" className="px-6 py-3">#</th>
            <th scope="col" className="px-6 py-3">Order ID</th>
            <th scope="col" className="px-6 py-3">Customer</th>
            <th scope="col" className="px-6 py-3">Date</th>
            <th scope="col" className="px-6 py-3">Total</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, i) => (
            <tr key={order.id} className="bg-white border-b hover:bg-slate-50">
              <td className="px-6 py-4 font-medium text-slate-900">{i + 1}</td>
              <td className="px-6 py-4 font-medium text-slate-900">#{order.id}</td>
              <td className="px-6 py-4">{order.user?.name || "N/A"}</td>
              <td className="px-6 py-4">{new Date(order.order_date).toLocaleDateString()}</td>
              <td className="px-6 py-4">${order.order_total?.toFixed(2) ?? "0.00"}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.order_status?.status)}`}>
                  {order.order_status?.status || "N/A"}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEditClick(order)}
                    className="p-2 text-indigo-600 hover:bg-slate-100 rounded-md"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(order)}
                    className="p-2 text-red-600 hover:bg-slate-100 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Modals */}
  <EditOrderModal
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    order={selectedOrder}
    statuses={orderStatuses}
    onSave={handleSaveStatus}
    loading={actionLoading}
  />

  <ConfirmationModal
    isOpen={isDeleteModalOpen}
    onClose={() => setIsDeleteModalOpen(false)}
    onConfirm={handleConfirmDelete}
    title="Delete Order"
    confirmText="Yes, Delete"
  >
    Are you sure you want to permanently delete order #{selectedOrder?.id}? This action cannot be undone.
  </ConfirmationModal>
</>

  );
}