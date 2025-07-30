// File: app/components/user/orders/StatusBadge.js
"use client";

export default function StatusBadge({ statusName }) {
  const status = statusName?.toLowerCase() || 'unknown';

  const statusStyles = {
    delivered: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    processing: "bg-yellow-100 text-yellow-800",
    pending: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800",
    unknown: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${statusStyles[status] || statusStyles.unknown}`}
    >
      {statusName || "N/A"}
    </span>
  );
}