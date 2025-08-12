// app/admin/users/components/UserTable.jsx
"use client"

import { ShieldAlert, Users } from "lucide-react"
import { UserTableRow } from "./UserTableRow"

// Internal components for different table states
const LoadingState = () => (
  <tr>
    <td colSpan="4" className="text-center py-12">
      <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
        <p className="font-medium">Loading users...</p>
      </div>
    </td>
  </tr>
)

const ErrorState = ({ error }) => (
  <tr>
    <td colSpan="4" className="text-center py-12">
      <div className="flex flex-col items-center justify-center gap-3 text-red-500">
        <ShieldAlert className="w-12 h-12" />
        <div>
          <p className="font-semibold text-lg">Error loading users</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    </td>
  </tr>
)

const EmptyState = ({ searchTerm }) => (
  <tr>
    <td colSpan="4" className="text-center py-12">
      <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
        <Users className="w-12 h-12" />
        <div>
          <p className="font-semibold text-lg">No users found</p>
          <p className="text-sm">{searchTerm ? "Try adjusting your search" : "No regular users available"}</p>
        </div>
      </div>
    </td>
  </tr>
)

export function UserTable({ users, loading, error, searchTerm, onEdit, onDelete }) {
  const hasUsers = users.length > 0
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Users className="h-4 w-4" />
            {users.length} users
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && <LoadingState />}
            {!loading && error && <ErrorState error={error} />}
            {!loading && !error && !hasUsers && <EmptyState searchTerm={searchTerm} />}
            {!loading && !error && hasUsers && users.map((user, index) => (
              <UserTableRow key={user.id} user={user} index={index} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}