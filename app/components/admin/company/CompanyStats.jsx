// app/admin/companies/components/CompanyStats.jsx
"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Building2, UserPlus } from "lucide-react"

export function CompanyStats({ companies }) {
  const stats = useMemo(() => {
    const total = companies.length;
    const recentCompanies = companies.filter((c) => {
      if (!c.created_at) return false;
      const joinDate = new Date(c.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return joinDate > weekAgo;
    }).length;

    return { total, recentCompanies };
  }, [companies]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 text-gray-900 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Companies</p>
            <p className="text-3xl font-bold mt-1">{stats.total}</p>
            <p className="text-gray-400 text-xs mt-1">Registered business accounts</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <Building2 className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg text-gray-900 border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">New This Week</p>
            <p className="text-3xl font-bold mt-1">{stats.recentCompanies}</p>
            <p className="text-gray-400 text-xs mt-1">Recently registered</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <UserPlus className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}