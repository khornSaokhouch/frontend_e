"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, Search, Bell, ChevronDown, UserCircle, LogOut, Settings } from "lucide-react"
import { useNotificationsStore } from "../../store/useNotificationsStore"

// Modern US Flag component
const UsaFlagIcon = () => (
  <div className="h-5 w-7 rounded-sm overflow-hidden border border-gray-200">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 7410 3900">
      <path fill="#b22234" d="M0 0h7410v3900H0z" />
      <path d="M0 450h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0z" fill="#fff" />
      <path fill="#3c3b6e" d="M0 0h3960v2100H0z" />
      <path
        d="m198 210-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM498 420l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM198 630l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM498 840l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM198 1050l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM498 1260l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM198 1470l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM498 1680l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM198 1890l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114z"
        fill="#fff"
      />
    </svg>
  </div>
)

// Modern Dropdown Menu component
const DropdownMenu = ({ children, open, className = "" }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={`absolute right-0 mt-3 w-56 origin-top-right rounded-xl bg-white py-2 shadow-xl ring-1 ring-gray-200 focus:outline-none z-50 ${className}`}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
)

export default function Header({
  user,
  loading,
  onMenuButtonClick,
  onLogoutClick,
  adminId,
  notificationCount,
  clearUnreadCount,
}) {
  const [isProfileOpen, setProfileOpen] = useState(false)
  const [isLanguageOpen, setLanguageOpen] = useState(false)
  const fetchNotifications = useNotificationsStore((state) => state.fetchNotifications)
  const markEmailRead = useNotificationsStore((state) => state.markEmailRead)
  const emails = useNotificationsStore((state) => state.emails)

  const getCleanImageUrl = (url) => {
    if (!url) return "/default-avatar.png"
    const lastHttpIndex = url.lastIndexOf("http")
    return lastHttpIndex > 0 ? url.substring(lastHttpIndex) : url
  }

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleViewNotifications = () => {
    clearUnreadCount()
  }

  const bellHref = `/admin/${adminId}/inbox`

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 md:hidden"
            onClick={onMenuButtonClick}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search anything..."
              className="block w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:w-80"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link
            href={bellHref}
            className="relative p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            onClick={handleViewNotifications}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold text-white shadow-lg"
                aria-label={`${notificationCount} new notifications`}
              >
                {notificationCount > 99 ? "99+" : notificationCount}
              </motion.span>
            )}
          </Link>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setLanguageOpen(!isLanguageOpen)
                setProfileOpen(false)
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              <UsaFlagIcon />
              <span className="hidden text-sm font-medium sm:block">EN</span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isLanguageOpen ? "rotate-180" : ""}`}
              />
            </button>

            <DropdownMenu open={isLanguageOpen}>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                Language
              </div>
              <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <UsaFlagIcon />
                <span>English</span>
              </button>
              <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <div className="h-5 w-7 rounded-sm bg-red-500"></div>
                <span>Spanish</span>
              </button>
              <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <div className="h-5 w-7 rounded-sm bg-blue-500"></div>
                <span>French</span>
              </button>
            </DropdownMenu>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!isProfileOpen)
                setLanguageOpen(false)
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              {loading ? (
                <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200" />
              ) : (
                <div className="relative">
                  <Image
                    src={getCleanImageUrl(user?.profile_image_url) || "/placeholder.svg"}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></div>
                </div>
              )}

              <div className="hidden text-left md:block">
                <p className="text-sm font-semibold text-gray-900">{loading ? "Loading..." : user?.name || "Admin"}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>

              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>

            <DropdownMenu open={isProfileOpen}>
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{user?.name || "Admin"}</p>
                <p className="text-xs text-gray-500">{user?.email || "admin@example.com"}</p>
              </div>

              <Link
                href={`/admin/${adminId}/profile`}
                onClick={() => setProfileOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserCircle className="h-4 w-4" />
                <span>View Profile</span>
              </Link>

              <Link
                href={`/admin/${adminId}/settings`}
                onClick={() => setProfileOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>

              <div className="border-t border-gray-100 mt-1">
                <button
                  onClick={() => {
                    setProfileOpen(false)
                    onLogoutClick()
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
