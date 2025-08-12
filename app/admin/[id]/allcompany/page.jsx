// app/admin/companies/page.jsx
"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useUserStore } from "../../../store/userStore"
import toast from "react-hot-toast"

// --- Import Reusable and New Components ---
import { CompanyPageHeader } from "../../../components/admin/company/CompanyPageHeader"
import { CompanyStats } from "../../../components/admin/company/CompanyStats"
import { CompanyTable } from "../../../components/admin/company/CompanyTable"
import { EditUserModal } from "../../../components/admin/users/EditUserModal" // Re-use from user page
import { ConfirmationModal } from "../../../components/admin/users/ConfirmationModal" // Re-use from user page
import { ShieldAlert } from "lucide-react"

const getCleanImageUrl = (url) => {
  if (!url) return "/default-avatar.png"
  const lastHttpIndex = url.lastIndexOf("http")
  return lastHttpIndex > 0 ? url.substring(lastHttpIndex) : url
}

export default function CompanyListPage() {
  const router = useRouter()
  // --- STATE AND STORE MANAGEMENT ---
  const { users, loading, error, fetchAllUsers, updateUser, deleteUser, fetchUser } = useUserStore()
  const [search, setSearch] = useState("")
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [authorized, setAuthorized] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // --- AUTHORIZATION & DATA FETCHING ---
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      setCheckingAuth(true)
      const currentUser = await fetchUser()
      if (!currentUser) {
        router.push("/login")
        return
      }
      if (currentUser.role === "admin") {
        setAuthorized(true)
        await fetchAllUsers()
      } else {
        setAuthorized(false)
      }
      setCheckingAuth(false)
    }
    checkAuthAndFetchData()
  }, [fetchUser, fetchAllUsers, router])

  // --- MEMOIZED DATA ---
  const companies = useMemo(() => users?.filter((u) => u.role === "company") ?? [], [users])
  const filteredCompanies = useMemo(() => {
    if (!search.trim()) return companies
    const lowercasedSearch = search.toLowerCase()
    return companies.filter(
      (c) =>
        c.name?.toLowerCase().includes(lowercasedSearch) ||
        c.email?.toLowerCase().includes(lowercasedSearch)
    )
  }, [companies, search])

  // --- EVENT HANDLERS (MODALS, EDIT, DELETE) ---
  const handleOpenEditModal = (company) => {
    const companyWithCleanedImage = { ...company, cleanedImageUrl: getCleanImageUrl(company.profile_image_url) }
    setSelectedCompany(companyWithCleanedImage)
    setIsEditModalOpen(true)
  }

  const handleOpenConfirmModal = (company) => {
    setSelectedCompany(company)
    setIsConfirmModalOpen(true)
  }

  const handleCloseModals = () => {
    setSelectedCompany(null)
    setIsEditModalOpen(false)
    setIsConfirmModalOpen(false)
  }

  const handleSaveRole = async (companyId, newRole) => {
    const loadingToast = toast.loading("Updating company role...")
    const formData = new FormData()
    formData.append("role", newRole)
    try {
      await updateUser(companyId, formData)
      toast.success("Company role updated successfully!", { id: loadingToast })
      handleCloseModals()
    } catch (err) {
      toast.error(err.message || "Failed to update role.", { id: loadingToast })
    }
  }

  const handleDeleteCompany = async () => {
    if (!selectedCompany) return
    const loadingToast = toast.loading("Deleting company...")
    handleCloseModals()
    try {
      await deleteUser(selectedCompany.id) // Still uses deleteUser store action
      toast.success("Company deleted successfully!", { id: loadingToast })
    } catch (err) {
      toast.error(err.message || "Failed to delete company.", { id: loadingToast })
    }
  }
  
  // --- RENDER STATES ---
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-indigo-600 rounded-full"></div>
          <p className="font-medium">Checking authorization...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        <div className="flex flex-col items-center gap-4 p-8 bg-red-50 rounded-lg shadow-md">
          <ShieldAlert className="w-12 h-12" />
          <div className="text-center">
            <h2 className="text-xl font-bold">Access Denied</h2>
            <p className="text-red-500">You do not have permission to view this page.</p>
          </div>
        </div>
      </div>
    )
  }

  // --- MAIN RENDER ---
  return (
    <>
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onSave={handleSaveRole}
        user={selectedCompany} // The modal is generic and accepts a 'user' object
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteCompany}
        userName={selectedCompany?.name}
      />

      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto p-6">
          <CompanyPageHeader search={search} onSearchChange={setSearch} />
          <CompanyStats companies={companies} />
          <CompanyTable
            companies={filteredCompanies}
            loading={loading && companies.length === 0} // Show loading skeleton only on initial load
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