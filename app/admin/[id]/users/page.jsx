// app/admin/users/page.jsx
"use client"

import { useEffect, useState, useMemo } from "react"
import { useUserStore } from "../../../store/userStore"
import toast from "react-hot-toast"
import { UsersPageHeader } from "../../../components/admin/users/UsersPageHeader"
import { UserStats } from "../../../components/admin/users/UserStats" // Assuming this component exists
import { UserTable } from "../../../components/admin/users/UserTable"
import { EditUserModal } from "../../../components/admin/users/EditUserModal" // Assuming this component exists
import { ConfirmationModal } from "../../../components/admin/users/ConfirmationModal" // Assuming this component exists

export default function UsersPage() {
  // --- STATE AND STORE MANAGEMENT ---
  const { users, loading, error, fetchAllUsers, updateUser, deleteUser } = useUserStore()
  const [search, setSearch] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // --- DATA FETCHING ---
  useEffect(() => {
    fetchAllUsers()
  }, [fetchAllUsers])

  // --- MEMOIZED DATA ---
  const getCleanImageUrl = (url) => {
    if (!url) return "/default-avatar.png"
    const lastHttpIndex = url.lastIndexOf("http")
    return lastHttpIndex > 0 ? url.substring(lastHttpIndex) : url
  }
  
  const regularUsers = useMemo(() => users?.filter((u) => u.role === "user") ?? [], [users])

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return regularUsers
    const lower = search.toLowerCase()
    return regularUsers.filter((u) => u.name?.toLowerCase().includes(lower) || u.email?.toLowerCase().includes(lower))
  }, [regularUsers, search])

  // --- EVENT HANDLERS ---
  const handleOpenEditModal = (user) => {
    const userWithCleanedImage = { ...user, cleanedImageUrl: getCleanImageUrl(user.profile_image_url) }
    setSelectedUser(userWithCleanedImage)
    setIsEditModalOpen(true)
  }
  
  const handleOpenConfirmModal = (user) => {
    setSelectedUser(user)
    setIsConfirmModalOpen(true)
  }

  const handleCloseModals = () => {
    setSelectedUser(null)
    setIsEditModalOpen(false)
    setIsConfirmModalOpen(false)
  }

  const handleSaveRole = async (userId, newRole) => {
    const loadingToast = toast.loading("Updating role...")
    const formData = new FormData()
    formData.append("role", newRole)
    try {
      await updateUser(userId, formData)
      toast.success("User role updated successfully!", { id: loadingToast })
      handleCloseModals()
    } catch (err) {
      toast.error(err.message || "Failed to update role.", { id: loadingToast })
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return
    const loadingToast = toast.loading("Deleting user...")
    handleCloseModals()
    try {
      await deleteUser(selectedUser.id)
      toast.success("User deleted successfully!", { id: loadingToast })
    } catch (err) {
      toast.error(err.message || "Failed to delete user.", { id: loadingToast })
    }
  }

  // --- RENDER ---
  return (
    <>
      <EditUserModal 
        isOpen={isEditModalOpen} 
        onClose={handleCloseModals} 
        onSave={handleSaveRole} 
        user={selectedUser} 
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteUser}
        userName={selectedUser?.name}
      />

      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <UsersPageHeader search={search} onSearchChange={setSearch} />
          <UserStats users={regularUsers} />
          <UserTable
            users={filteredUsers}
            loading={loading}
            error={error}
            searchTerm={search}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenConfirmModal}
          />
        </div>
      </div>
    </>
  )
}