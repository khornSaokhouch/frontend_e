"use client";

import { useEffect, useMemo  } from "react";
import { useUserStore } from "../../../store/userStore";
import {
  Users,
  Package,
  LineChart as LineChartIcon,
  Clock,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { useProductStore } from "../../../store/useProductStore";
import { useCompanyStore } from "../../../store/useCompanyStore";
import DealsDetails from "../../../components/admin/DealsDetails";
import SalesDetails from "../../../components/admin/SalesDetails";

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
  const { users, loading: isLoadingUsers, fetchAllUsers } = useUserStore();
  const { products, fetchProducts, loading: loadingProducts } = useProductStore();
  const {
    companies,
    loading: loadingCompanies,
    fetchCompanies,
  } = useCompanyStore();

  useEffect(() => {
    fetchAllUsers();
    fetchProducts();
    fetchCompanies(); // fetch companies
  }, [fetchAllUsers, fetchProducts, fetchCompanies]);

  const totalUsers = useMemo(
    () => users?.filter((u) => u.role !== "admin").length || 0,
    [users]
  );

  const totalProducts = useMemo(() => products?.length || 0, [products]);

  const totalCompanies = useMemo(() => companies?.length || 0, [companies]);
  // --- 4. CREATE DYNAMIC STATS DATA ---
  // We use useMemo to prevent this array from being recreated on every render
  const statsData = useMemo(
    () => [
      {
        title: "Total Users",
        value: isLoadingUsers ? (
          <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
        ) : (
          totalUsers.toLocaleString()
        ),
        icon: Users,
        trend: "8.5%",
        period: "yesterday",
        iconBgColor: "bg-purple-400",
        trendColor: "green",
      },
      {
        title: "Total Products",
        value: loadingProducts ? (
          <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
        ) : (
          totalProducts.toLocaleString()
        ),
        icon: Package,
        trend: "2.1%",
        period: "this week",
        iconBgColor: "bg-blue-400",
        trendColor: "green",
      },
      {
        title: "Total Pendding Companies",
        value: loadingCompanies ? (
          <Loader2 className="w-7 h-7 animate-spin text-slate-400" />
        ) : (
          totalCompanies.toLocaleString()
        ),
        icon: Users, // or another icon that fits companies better
        trend: "4.2%",
        period: "last month",
        iconBgColor: "bg-pink-400",
        trendColor: "green",
      },
      // Add more stats here as needed, e.g. Total Pending or Total Orders
    ],
    [isLoadingUsers, totalUsers, loadingProducts, totalProducts, loadingCompanies, totalCompanies]
  );

  return (
    <div className="space-y-8 px-4">
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

      {/* Sales Details Section - Replaced with the SalesDetails Component */}
      <SalesDetails users={users} products={products} companies={companies} />


      {/* Deals Details Section - Using DealsTable Component */}
      <DealsDetails products={products} />
    </div>
  );
}