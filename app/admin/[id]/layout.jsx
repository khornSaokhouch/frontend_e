"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useUserStore } from "../../store/userStore"
import { useAuthStore } from "../../store/authStore"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, X } from "lucide-react"
import toast from "react-hot-toast"
import Header from "../../components/admin/Header"
import Sidebar from "../../components/admin/Sidebar"
import { useNotificationsStore } from "../../store/useNotificationsStore"

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, confirmText = "Confirm" }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-pink-500"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
              <div className="text-gray-600">{children}</div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all shadow-lg shadow-red-500/25"
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function AdminLayout({ children }) {
  const { id: adminId } = useParams()
  const router = useRouter()
  const user = useUserStore((state) => state.user)
  const fetchUser = useUserStore((state) => state.fetchUser)
  const loadingUser = useUserStore((state) => state.loading)
  const { logout } = useAuthStore()
  const emails = useNotificationsStore((state) => state.emails)
  const unreadCount = useNotificationsStore((state) => state.unreadCount)
  const fetchNotifications = useNotificationsStore((state) => state.fetchNotifications)
  const clearUnreadCount = useNotificationsStore((state) => state.clearUnreadCount)

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

  useEffect(() => {
    if (!user && adminId) {
      fetchUser(adminId)
    }
  }, [fetchUser, user, adminId])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleLogout = () => {
    setIsLogoutModalOpen(false)
    logout()
    toast.success("You have been logged out.")
    router.push("/login")
  }

  const handleViewNotifications = () => {
    clearUnreadCount()
  }

  return (
    <>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        confirmText="Yes, Logout"
      >
        Are you sure you want to end your session?
      </ConfirmationModal>

      <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-inter">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 z-30">
          <Sidebar adminId={adminId} onLogoutClick={() => setIsLogoutModalOpen(true)} />
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 flex w-72 flex-col z-50 lg:hidden"
              >
                <Sidebar
                  adminId={adminId}
                  onLogoutClick={() => setIsLogoutModalOpen(true)}
                  onClose={() => setSidebarOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex flex-1 flex-col lg:pl-72">
          <Header
            user={user}
            loading={loadingUser}
            adminId={adminId}
            notificationCount={unreadCount}
            onMenuButtonClick={() => setSidebarOpen(true)}
            onLogoutClick={() => setIsLogoutModalOpen(true)}
            clearUnreadCount={clearUnreadCount}
          />

          <main className="flex-1 overflow-auto">
            <div className="p-6 lg:p-8">
              <div className="max-w-7xl mx-auto">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
