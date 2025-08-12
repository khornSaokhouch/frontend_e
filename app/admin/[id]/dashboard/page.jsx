"use client"

import { useEffect, useMemo } from "react"
import { useUserStore } from "../../../store/userStore"
import { Users, Package, ArrowUp, ArrowDown, Loader2 } from "lucide-react"
import { useProductStore } from "../../../store/useProductStore"
import { useCompanyStore } from "../../../store/useCompanyStore"
import DealsDetails from "../../../components/admin/DealsDetails"
import SalesDetails from "../../../components/admin/SalesDetails"
import { motion } from "framer-motion"
import { useShopOrderStore } from "../../../store/useShopOrder"

const StatCard = ({ title, value, icon: Icon, trend, period, iconBgColor, trendColor }) => {
  const isUp = trendColor === "green"
  const TrendIcon = isUp ? ArrowUp : ArrowDown
  const trendTextColor = isUp ? "text-green-600" : "text-red-500"
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="flex flex-col justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-200/50 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className={`p-3 rounded-xl ${iconBgColor} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4">
        <h2 className="text-3xl font-bold text-gray-900 h-10 flex items-center">{value}</h2>
        <div className="flex items-center gap-1 mt-1 text-sm">
          <TrendIcon className={`w-4 h-4 ${trendTextColor}`} />
          <span className={`${trendTextColor} font-semibold`}>{trend}</span>
          <span className="text-gray-500">from {period}</span>
        </div>
      </div>
    </motion.div>
  )
}

// StatusPill is not used in this component, but kept for completeness if it's used elsewhere.
const StatusPill = ({ status }) => {
  const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full"
  const statusClasses = {
    Delivered: "bg-green-100 text-green-800",
    Pending: "bg-orange-100 text-orange-800",
    Canceled: "bg-red-100 text-red-800",
  }
  return <span className={`${baseClasses} ${statusClasses[status] || "bg-slate-100 text-slate-800"}`}>{status}</span>
}

export default function AdminDashboard() {
  const { users, loading: isLoadingUsers, fetchAllUsers } = useUserStore()
  const { products, fetchProducts, loading: loadingProducts } = useProductStore()
  const { companies, loading: loadingCompanies, fetchCompanies } = useCompanyStore()
  const { orders, loading: isLoadingOrders, fetchOrders } = useShopOrderStore() // Assuming orders are fetched from user store

  useEffect(() => {
    fetchAllUsers()
    fetchProducts()
    fetchCompanies() // fetch companies
    fetchOrders() // Fetch orders if needed
  }, [fetchAllUsers, fetchProducts, fetchCompanies, fetchOrders])

  const totalUsers = useMemo(() => users?.filter((u) => u.role !== "admin").length || 0, [users])
  const totalProducts = useMemo(() => products?.length || 0, [products])
  const totalCompanies = useMemo(() => companies?.length || 0, [companies])
  const totalOrders = useMemo(() => orders?.length || 0, [orders])

  const statsData = useMemo(
    () => [
      {
        title: "Total Users",
        value: isLoadingUsers ? (
          <Loader2 className="w-7 h-7 animate-spin text-gray-400" />
        ) : (
          totalUsers.toLocaleString()
        ),
        icon: Users,
        trend: "8.5%",
        period: "yesterday",
        iconBgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
        trendColor: "green",
      },
      {
        title: "Total Products",
        value: loadingProducts ? (
          <Loader2 className="w-7 h-7 animate-spin text-gray-400" />
        ) : (
          totalProducts.toLocaleString()
        ),
        icon: Package,
        trend: "2.1%",
        period: "this week",
        iconBgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
        trendColor: "green",
      },
      {
        title: "Total Companies",
        value: loadingCompanies ? (
          <Loader2 className="w-7 h-7 animate-spin text-gray-400" />
        ) : (
          totalCompanies.toLocaleString()
        ),
        icon: Users,
        trend: "4.2%",
        period: "last month",
        iconBgColor: "bg-gradient-to-br from-pink-500 to-red-600",
        trendColor: "green",
      },
      {
        title: "Total Orders",
        value: isLoadingUsers ? ( // Reusing isLoadingUsers for simplicity, replace with actual order loading state
          <Loader2 className="w-7 h-7 animate-spin text-gray-400" />
        ) : (
          totalOrders.toLocaleString()
        ),
        icon: Package, // Placeholder icon
        trend: "15.0%",
        period: "last month",
        iconBgColor: "bg-gradient-to-br from-orange-500 to-yellow-600",
        trendColor: "green",
      },
    ],
    [isLoadingUsers, totalUsers, loadingProducts, totalProducts, loadingCompanies, totalCompanies, totalOrders],
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  return (
    <motion.div className="space-y-8" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.h1 variants={itemVariants} className="text-4xl font-bold text-slate-800">
        Dashboard
      </motion.h1>

      {/* Stat Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </motion.div>

      {/* Sales Details Section */}
      <motion.div variants={itemVariants}>
        <SalesDetails users={users} products={products} companies={companies} orders={orders} />
      </motion.div>

      {/* Deals Details Section */}
      <motion.div variants={itemVariants}>
        <DealsDetails products={products} />
      </motion.div>
    </motion.div>
  )
}
