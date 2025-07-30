// File: pages/user/[id]/orders.js (or your path)
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useShopOrderStore } from "../../../store/useShopOrder";
import toast from "react-hot-toast";
import { ClipboardList, PackageX, AlertTriangle } from "lucide-react";

// Import your new, simplified OrderCard component
import OrderCard from "../../../components/user/orders/OrderCard";

const UserOrdersPage = () => {
  // --- SIMPLIFIED STATE AND LOGIC ---
  const { id: userId } = useParams();
  const { 
    orders, 
    fetchOrdersByUser, 
    loading, 
    error, 
    deleteOrder 
  } = useShopOrderStore();

  // We only need one loading state for the delete action
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchOrdersByUser(userId);
    }
  }, [userId, fetchOrdersByUser]);


  // Simplified delete handler
  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
        await deleteOrder(id);
        toast.success("Order deleted successfully!");
        // Refetch the orders list to update the UI
        await fetchOrdersByUser(userId); 
    } catch (err) {
        toast.error("Failed to delete order.");
    } finally {
        setIsDeleting(false);
    }
  };
  
  // Confirmation toast, now calling the simplified handler
  const confirmDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-semibold">Are you sure you want to delete this order?</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={() => { toast.dismiss(t.id); handleDelete(id); }} 
            className="px-4 py-1 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
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
  // --- END OF LOGIC SECTION ---


  // --- DESIGNED LOADING, ERROR, AND EMPTY STATES ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Loading Orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center p-8 bg-white shadow-lg rounded-xl">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-800">An Error Occurred</h3>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <header className="text-center mb-10">
          <ClipboardList className="w-12 h-12 mx-auto text-orange-500 mb-2" />
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Order History</h1>
          <p className="mt-2 text-lg text-gray-600">
            A total of <span className="font-bold text-gray-800">{orders.length}</span> orders found for user {userId}.
          </p>
        </header>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isDeleting={isDeleting}
                onDelete={() => confirmDelete(order.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-300 rounded-xl">
            <PackageX className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Orders Found</h2>
            <p className="text-gray-600">This user has not placed any orders yet.</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default UserOrdersPage;