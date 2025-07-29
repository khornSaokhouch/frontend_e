// /app/components/company/dashboard/StatCard.jsx

"use client";

import React from "react";

// The Skeleton component now has the same clean structure.
export const StatCardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm animate-pulse">
    <div className="h-12 w-12 rounded-lg bg-slate-200 mb-4"></div>
    <div className="h-4 w-3/4 rounded bg-slate-200 mb-2"></div>
    <div className="h-8 w-1/2 rounded bg-slate-200"></div>
  </div>
);

// The StatCard component with updated styling.
export default function StatCard({ title, value, icon: Icon, color }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };

  return (
    // UPDATED: Standardized styling with subtle border and shadow.
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
      <div className={`w-12 h-12 flex items-center justify-center rounded-lg mb-4 ${colorClasses[color] || colorClasses.indigo}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );
}