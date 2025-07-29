// /app/components/company/dashboard/SummaryBarChart.jsx

"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SummaryBarChart({ stats }) {
  const data = [
    { name: "Products", total: stats.totalProducts },
    { name: "Orders", total: stats.totalOrders },
    { name: "Promotions", total: stats.totalPromotions },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm h-96">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Overview Summary</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="name"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(239, 246, 255, 0.5)" }}
            contentStyle={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              boxShadow:
                "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            }}
          />
          <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
