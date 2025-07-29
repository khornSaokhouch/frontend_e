"use client"
import { useEffect, useState, useMemo } from "react"
import { useUserStore } from "../../../store/userStore"
import Image from "next/image"
import {
  ShieldCheck,
  User,
  Search,
  ShieldAlert,
  Edit,
  X,
  Loader2,
  ChevronDown,
  Trash2,
  Users,
  UserPlus,
} from "lucide-react"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

function RoleBadge({ role }) {
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

// Modern Confirmation Modal
const ConfirmationModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-center items-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Delete User</h2>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-gray-700">
              Are you sure you want to delete <span className="font-semibold text-gray-900">{userName}</span>?
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              Delete User
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Modern Edit Modal
const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || "user")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) setSelectedRole(user.role)
  }, [user])

  if (!isOpen || !user) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSave(user.id, selectedRole)
    setIsSubmitting(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-center items-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Edit className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit User Role</h2>
                <p className="text-sm text-gray-500">Change user permissions</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="relative">
                <Image
                  src={user.cleanedImageUrl || "/default-avatar.png"}
                  width={56}
                  height={56}
                  alt={user.name}
                  className="rounded-full object-cover ring-2 ring-white shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-400 ring-2 ring-white"></div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Current: <RoleBadge role={user.role} />
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                Select New Role
              </label>
              <div className="relative">
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 py-3 px-4 text-sm bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="user">👤 User - Standard Access</option>
                  <option value="company">🏢 Company - Business Access</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors shadow-sm"
              >
                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Changes"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Modern Stats Component
const UserStats = ({ users }) => {
  const stats = useMemo(() => {
    const total = users.length
    const recentUsers = users.filter((u) => {
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
    className="bg-white rounded-2xl p-6 text-gray-900 shadow-lg"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">Total Users</p>
        <p className="text-3xl font-bold mt-1">{stats.total}</p>
        <p className="text-gray-400 text-xs mt-1">Active platform users</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Users className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-white rounded-2xl p-6 shadow-lg text-gray-900"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">New This Week</p>
        <p className="text-3xl font-bold mt-1">{stats.recentUsers}</p>
        <p className="text-gray-400 text-xs mt-1">Recently joined</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <UserPlus className="h-6 w-6 text-green-600" />
      </div>
    </div>
  </motion.div>
</div>

  )
}

export default function UsersPage() {
  const { users, loading, error, fetchAllUsers, updateUser, deleteUser } = useUserStore()
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  useEffect(() => {
    fetchAllUsers()
  }, [fetchAllUsers])

  const getCleanImageUrl = (url) => {
    if (!url) return "/default-avatar.png"
    const lastHttpIndex = url.lastIndexOf("http")
    if (lastHttpIndex > 0) return url.substring(lastHttpIndex)
    return url
  }

  const handleOpenModal = (user) => {
    const userWithCleanedImage = {
      ...user,
      cleanedImageUrl: getCleanImageUrl(user.profile_image_url),
    }
    setSelectedUser(userWithCleanedImage)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedUser(null)
    setIsModalOpen(false)
  }

  const handleSaveRole = async (userId, newRole) => {
    const loadingToast = toast.loading("Updating role...")

    const formData = new FormData()
    formData.append("role", newRole)

    try {
      await updateUser(userId, formData)
      toast.success("User role updated successfully!", { id: loadingToast })
      handleCloseModal()
      fetchAllUsers()
    } catch (err) {
      toast.error(err.message || "Failed to update role.", { id: loadingToast })
    }
  }

  const handleOpenConfirm = (user) => {
    setUserToDelete(user)
    setShowConfirmationModal(true)
  }

  const handleCloseConfirm = () => {
    setUserToDelete(null)
    setShowConfirmationModal(false)
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return

    const { id } = userToDelete
    const loadingToast = toast.loading("Deleting user...")
    handleCloseConfirm()

    try {
      await deleteUser(id)
      toast.success("User deleted successfully!", { id: loadingToast })
      fetchAllUsers()
    } catch (err) {
      toast.error(err.message || "Failed to delete user.", { id: loadingToast })
    } finally {
      setUserToDelete(null)
    }
  }

  const regularUsers = useMemo(() => users?.filter((u) => u.role === "user") ?? [], [users])

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return regularUsers
    const lower = search.toLowerCase()
    return regularUsers.filter((u) => u.name?.toLowerCase().includes(lower) || u.email?.toLowerCase().includes(lower))
  }, [regularUsers, search])

  return (
    <>
      <EditUserModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveRole} user={selectedUser} />
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={handleCloseConfirm}
        onConfirm={handleDeleteUser}
        userName={userToDelete?.name}
      />

      <div className="min-h-screen ">
        <div className="max-w-7xl mx-auto p-6">
          {/* Modern Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="mt-2 text-gray-600">Manage and monitor regular platform users</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <UserStats users={regularUsers} />

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  {filteredUsers.length} users
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading && (
                    <tr>
                      <td colSpan="4" className="text-center py-12">
                        <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-blue-600 rounded-full"></div>
                          <p className="font-medium">Loading users...</p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {!loading && error && (
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
                  )}

                  {!loading &&
                    !error &&
                    filteredUsers.length > 0 &&
                    filteredUsers.map((user, index) => (
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
                                src={getCleanImageUrl(user.profile_image_url) || "/placeholder.svg"}
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
                              onClick={() => handleOpenModal(user)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              aria-label={`Edit ${user.name}`}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenConfirm(user)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label={`Delete ${user.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}

                  {!loading && !error && filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-12">
                        <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                          <Users className="w-12 h-12" />
                          <div>
                            <p className="font-semibold text-lg">No users found</p>
                            <p className="text-sm">
                              {search.trim() ? "Try adjusting your search" : "No regular users available"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
