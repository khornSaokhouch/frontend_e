// app/admin/users/components/UserTableRow.jsx
"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Edit, Trash2 } from "lucide-react"
import { RoleBadge } from "./RoleBadge" // Assuming RoleBadge is in the same folder

// A helper function to ensure we get a valid image URL
const getCleanImageUrl = (url) => {
  if (!url) return "/default-avatar.png"
  const lastHttpIndex = url.lastIndexOf("http")
  return lastHttpIndex > 0 ? url.substring(lastHttpIndex) : url
}

export function UserTableRow({ user, index, onEdit, onDelete }) {
  return (
    <motion.tr
      key={user.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-gray-50 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={getCleanImageUrl(user.profile_image_url)}
              alt={user.name}
              width={48}
              height={48}
              className="rounded-full object-cover ring-2 ring-gray-200"
            />
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-400 ring-2 ring-white"></div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <RoleBadge role={user.role} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(user.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label={`Edit ${user.name}`}
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            aria-label={`Delete ${user.name}`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </td>
    </motion.tr>
  )
}