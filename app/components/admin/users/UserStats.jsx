// app/admin/users/components/UserStats.jsx
"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Users, UserPlus } from "lucide-react"

export function UserStats({ users }) {
  const stats = useMemo(() => {
    const total = users.length
    const recentUsers = users.filter((u) => {
      // Ensure created_at is valid before creating a Date object
      if (!u.created_at) return false
      const joinDate = new Date(u.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return joinDate > weekAgo
    }).length

    return { total, recentUsers }
  }, [users])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl p-6 text-gray-900 shadow-lg border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Users</p>
            <p className="text-3xl font-bold mt-1">{stats.total}</p>
            <p className="text-gray-400 text-xs mt-1">Active platform users</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-2xl p-6 shadow-lg text-gray-900 border border-gray-100"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">New This Week</p>
            <p className="text-3xl font-bold mt-1">{stats.recentUsers}</p>
            <p className="text-gray-400 text-xs mt-1">Recently joined</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <UserPlus className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}