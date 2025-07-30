// File: app/components/user/orders/OrderCard.js
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import StatusBadge from "./StatusBadge";
import OrderItemsList from "./OrderItemsList";

export default function OrderCard({ order, onDelete, isDeleting }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md transition-shadow hover:shadow-lg">
      {/* Collapsed Header (Clickable) */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1">
          <p className="text-sm font-mono text-gray-600">ID: {order.id}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.order_date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-lg font-bold text-gray-800">${order.order_total?.toFixed(2)}</p>
          <StatusBadge statusName={order.order_status?.status} />
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Expandable Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-200 p-6 space-y-6">
              <OrderItemsList items={order.order_lines} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">Shipping Address</h4>
                    <p className="text-sm text-gray-800">{order.shipping_address || "N/A"}</p>
                 </div>
                 <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-1">Payment & Shipping</h4>
                    <p className="text-sm text-gray-800">Paid with: {order.payment_method?.provider || "N/A"}</p>
                    <p className="text-sm text-gray-800">Method: {order.shipping_method?.name || "N/A"}</p>
                 </div>
              </div>
              
              {/* Simplified Actions Section */}
              <div className="pt-4 border-t border-gray-200 flex items-center justify-end">
                <button 
                  onClick={onDelete} 
                  disabled={isDeleting} 
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}