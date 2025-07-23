"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import { useUserStore } from "../../../store/userStore"; // <-- 1. IMPORT YOUR STORE
import {
  Users,
  Package,
  LineChart as LineChartIcon,
  Clock,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Loader2, // <-- 2. IMPORT THE LOADER ICON
} from "lucide-react";
import { useProductStore } from "../../../store/useProductStore"; // <-- 1. IMPORT YOUR PRODUCT STORE

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  period,
  iconBgColor,
  trendColor,
}) => {
  const isUp = trendColor === "green";
  const TrendIcon = isUp ? ArrowUp : ArrowDown;
  const trendTextColor = isUp ? "text-green-600" : "text-red-500";

  return (
    <div className="flex flex-col justify-between bg-white p-5 rounded-xl shadow-sm border border-slate-200/80">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className={`p-3 rounded-xl ${iconBgColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-3xl font-bold text-slate-800 h-10 flex items-center">
          {value}
        </h2>{" "}
        {/* Added height for consistency during loading */}
        <div className="flex items-center gap-1 mt-1 text-sm">
          <TrendIcon className={`w-4 h-4 ${trendTextColor}`} />
          <span className={`${trendTextColor} font-semibold`}>{trend}</span>
          <span className="text-slate-500">from {period}</span>
        </div>
      </div>
    </div>
  );
};

const StatusPill = ({ status }) => {
  // ... same code as before
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
  const statusClasses = {
    Delivered: "bg-green-100 text-green-800",
    Pending: "bg-orange-100 text-orange-800",
    Canceled: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`${baseClasses} ${
        statusClasses[status] || "bg-slate-100 text-slate-800"
      }`}
    >
      {status}
    </span>
  );
};

export default function AdminDashboard() {
  // --- 3. FETCH REAL USER DATA ---
  const { users, loading: isLoadingUsers, fetchAllUsers } = useUserStore();
  const { products, fetchProducts, loading, error } = useProductStore(); // Fetch products if needed, not used in this example

  useEffect(() => {
    fetchAllUsers();
    fetchProducts();
  }, [fetchAllUsers, fetchProducts]);

  // Calculate total users from the store
  const totalUsers = useMemo(() => {
    if (!users) return 0;
    // Exclude admins from the count, as in your original logic
    return users.filter((u) => u.role !== "admin").length;
  }, [users]);

  // --- 4. CREATE DYNAMIC STATS DATA ---
  // We use useMemo to prevent this array from being recreated on every render
  const statsData = useMemo(
    () => [
      {
        title: "Total User",
        // Show loader while fetching, then show the real number
        value: isLoadingUsers ? (
          <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
        ) : (
          totalUsers.toLocaleString()
        ),
        icon: Users,
        trend: "8.5%", // This remains static for now, you can make it dynamic later
        period: "yesterday",
        iconBgColor: "bg-purple-400",
        trendColor: "green",
      },
      // The rest of the stats are still using mock data for this example
      {
        title: "Total Order",
        value: "10,293",
        icon: Package,
        trend: "1.3%",
        period: "past week",
        iconBgColor: "bg-yellow-400",
        trendColor: "green",
      },
      {
        title: "Total Sales",
        value: "$89,000",
        icon: LineChartIcon,
        trend: "4.3%",
        period: "yesterday",
        iconBgColor: "bg-green-400",
        trendColor: "red",
      },
      {
        title: "Total Pending",
        value: "2,040",
        icon: Clock,
        trend: "1.8%",
        period: "yesterday",
        iconBgColor: "bg-orange-400",
        trendColor: "green",
      },
    ],
    [isLoadingUsers, totalUsers]
  ); // Dependencies array ensures this updates only when loading state or user count changes

  return (
    <div className="space-y-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-slate-800">Dashboard</h1>

      {/* Stat Cards Grid - This section now uses the dynamic statsData */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            period={stat.period}
            iconBgColor={stat.iconBgColor}
            trendColor={stat.trendColor}
          />
        ))}
      </div>

      {/* Sales Details Section (No changes here) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-200/80">
          <h2 className="text-xl font-semibold text-slate-800">
            Sales Details
          </h2>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50">
            October <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 sm:p-6 h-96">
          <div className="h-full flex items-center justify-center bg-slate-50 rounded-lg">
            <p className="text-slate-500">
              Chart component would be rendered here.
            </p>
          </div>
        </div>
      </div>

      {/* Deals Details Section (No changes here) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/80">
        {/* ... table code remains the same ... */}
        <div className="flex justify-between items-center p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-slate-800">
            Deals Details
          </h2>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50">
            October <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold">
              <tr>
                <th scope="col" className="p-4">
                  ID
                </th>
                <th scope="col" className="p-4">
                  Product Name
                </th>
                <th scope="col" className="p-4">
                  Descriptions
                </th>
                <th scope="col" className="p-4">
                  Date - Time
                </th>

                <th scope="col" className="p-4">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-t border-slate-200/80 hover:bg-slate-50/50"
                >
                  <td className="p-4 text-slate-600 font-medium">
                    {index + 1}
                  </td>
                  <td className="p-4 font-medium text-slate-800">
                    <div className="flex items-center gap-3">
                      {product.product_image_url ? (
                        <div className="relative w-9 h-9">
                          <Image
                            src={
                              product.product_image_url || "/default_avatar.png"
                            } // Fallback URL if product_image_url is not available
                            alt={product.name}
                            width={36}
                            height={36}
                            style={{ height: "auto", width: "auto" }}
                            className="rounded-md object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400">
                          No Image
                        </div>
                      )}
                      {product.name}
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">
                    {product.description?.length > 50
                      ? product.description.slice(0, 50) + "..."
                      : product.description || "No description"}
                  </td>

                  <td className="p-4 text-slate-600">
                    {new Date(product.created_at).toLocaleString()}
                  </td>

                  <td className="p-4 text-slate-600 font-medium">
                    ${product.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
