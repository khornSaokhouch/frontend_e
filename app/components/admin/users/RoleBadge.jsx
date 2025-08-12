// app/admin/users/components/RoleBadge.jsx
"use client"

import { ShieldCheck, User } from "lucide-react"

export function RoleBadge({ role }) {
  const roleConfig = {
    company: {
      label: "Company",
      classes: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm",
      Icon: ShieldCheck,
    },
    user: {
      label: "User",
      classes: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm",
      Icon: User,
    },
    default: {
      label: role,
      classes: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-sm",
      Icon: User,
    },
  }
  const { label, classes, Icon } = roleConfig[role] || roleConfig.default

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${classes}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}