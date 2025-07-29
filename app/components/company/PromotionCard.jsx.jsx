"use client";

import React from "react";
// "Tag" icon is no longer needed and has been removed from the import
import { Calendar, Percent, Pencil, Trash2 } from "lucide-react";

// Helper function to determine the promotion's current status
const getPromotionStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Set end of day for accurate comparison
  end.setHours(23, 59, 59, 999);

  if (now < start) {
    return { text: "Upcoming", color: "bg-blue-100 text-blue-800" };
  }
  if (now > end) {
    return { text: "Expired", color: "bg-gray-100 text-gray-800" };
  }
  return { text: "Active", color: "bg-green-100 text-green-800" };
};

// Helper function to format dates for display
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function PromotionCard({ promotion, onEdit, onDelete }) {
  // Get the calculated status for the badge
  const status = getPromotionStatus(promotion.start_date, promotion.end_date);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Card Header: Title & Status Badge */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-semibold text-gray-900">{promotion.name}</h3>
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0 ${status.color}`}>
            {status.text}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{promotion.description}</p>
      </div>

      {/* Card Body: Key Details with Icons */}
      <div className="p-4 space-y-3 flex-grow">
        <div className="flex items-center text-sm text-gray-600">
          <Percent className="w-4 h-4 mr-3 text-indigo-500 flex-shrink-0" />
          {/* UPDATED: Now uses promotion.discount_percentage */}
          <span>Discount: <strong className="font-medium text-gray-800">{promotion.discount_percentage}% OFF</strong></span>
        </div>
        
        {/* REMOVED: The section for promo_code has been deleted to match your table */}

        <div className="flex items-start text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-3 text-indigo-500 flex-shrink-0 mt-0.5" />
          <span>Valid from <strong className="text-gray-800">{formatDate(promotion.start_date)}</strong> to <strong className="text-gray-800">{formatDate(promotion.end_date)}</strong></span>
        </div>
      </div>

      {/* Card Footer: Action Buttons */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-end items-center space-x-2">
        <button
          onClick={() => onEdit(promotion)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors"
        >
          <Pencil className="w-4 h-4 mr-1.5" />
          Edit
        </button>
        <button
          onClick={() => onDelete(promotion.id)}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          Delete
        </button>
      </div>
    </div>
  );
}