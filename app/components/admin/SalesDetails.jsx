"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

const SalesDetails = ({ users = [], products = [], companies = [], orders = [] }) => {
  const pendingCompaniesCount = companies.filter(
    (c) => c.status?.toLowerCase() === "pending"
  ).length;

  const data = [
    { name: "Users", count: users.length },
    { name: "Products", count: products.length },
    { name: "Pending Companies", count: pendingCompaniesCount },
    { name: "Order Total", count: orders.length },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-md p-3 shadow-md">
          <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
          <p className="text-xs text-gray-500">
            Count: <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
      <div className="flex justify-between items-center pb-5 mb-5 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800">Sales Details</h2>
        <div className="relative inline-block text-left">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            October
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 15, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesDetails;
