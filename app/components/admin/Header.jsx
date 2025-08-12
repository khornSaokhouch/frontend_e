"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, Search, Bell, ChevronDown, UserCircle, LogOut, Settings, Globe, Zap } from "lucide-react"
import { useNotificationsStore } from "../../store/useNotificationsStore"

const LanguageIcon = ({ country }) => {
  const flags = {
    US: "🇺🇸",
    ES: "🇪🇸",
    FR: "🇫🇷",
    DE: "🇩🇪",
  }

  return (
    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm">
      {flags[country] || "🌐"}
    </div>
  )
}

const DropdownMenu = ({ children, open, className = "" }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={`absolute right-0 mt-3 w-64 origin-top-right rounded-2xl bg-white/95 backdrop-blur-xl py-2 shadow-2xl ring-1 ring-gray-200/50 focus:outline-none z-50 ${className}`}
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
  const [currentTime, setCurrentTime] = useState(new Date())

  const fetchNotifications = useNotificationsStore((state) => state.fetchNotifications)

  useEffect(() => {
    fetchNotifications()
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [fetchNotifications])

  const handleViewNotifications = () => {
    if (clearUnreadCount) clearUnreadCount()
  }

  const bellHref = `/admin/${adminId}/inbox`

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all lg:hidden"
            onClick={onMenuButtonClick}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              className="block w-full pl-11 pr-4 py-3 text-sm bg-gray-50/80 border border-gray-200/50 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white transition-all sm:w-96 placeholder:text-gray-400"
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-lg">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Time Display */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50/80 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-1">
            <button className="p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all">
              <Zap className="h-4 w-4" />
            </button>
          </div>

          {/* Notifications */}
          <Link
            href={bellHref}
            className="relative p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-all group"
            onClick={handleViewNotifications}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-1.5 text-xs font-bold text-white shadow-lg"
              >
                {notificationCount > 99 ? "99+" : notificationCount}
              </motion.span>
            )}
          </Link>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setLanguageOpen(!isLanguageOpen)
                setProfileOpen(false)
              }}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100/80 transition-all"
            >
              <LanguageIcon country="US" />
              <span className="hidden sm:block text-sm font-medium">EN</span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${isLanguageOpen ? "rotate-180" : ""}`}
              />
            </button>
            <DropdownMenu open={isLanguageOpen}>
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-semibold text-gray-900">Language</span>
                </div>
              </div>
              {[
                { code: "US", name: "English", native: "English" },
                { code: "ES", name: "Spanish", native: "Español" },
                { code: "FR", name: "French", native: "Français" },
                { code: "DE", name: "German", native: "Deutsch" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LanguageIcon country={lang.code} />
                  <div className="text-left">
                    <div className="font-medium">{lang.name}</div>
                    <div className="text-xs text-gray-500">{lang.native}</div>
                  </div>
                </button>
              ))}
            </DropdownMenu>
          </div>

          <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block" />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen(!isProfileOpen)
                setLanguageOpen(false)
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100/80 transition-all"
            >
              {loading ? (
                <div className="h-9 w-9 animate-pulse rounded-full bg-gradient-to-br from-gray-200 to-gray-300" />
              ) : (
                <div className="relative">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
                    <Image
                      src={user?.profile_image_url || "/placeholder.svg?height=32&width=32"}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="h-full w-full rounded-full object-cover bg-white"
                      unoptimized
                      priority
                    />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white"></div>
                </div>
              )}
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900">{loading ? "Loading..." : user?.name || "Admin"}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
              />
            </button>
            <DropdownMenu open={isProfileOpen}>
              <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5">
                    <Image
                      src={user?.profile_image_url || "/placeholder.svg?height=40&width=40"}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="h-full w-full rounded-full object-cover bg-white"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{user?.name || "Admin"}</p>
                    <p className="text-xs text-gray-500">{user?.email || "admin@example.com"}</p>
                  </div>
                </div>
              </div>
              <div className="py-2">
                <Link
                  href={`/admin/${adminId}/profile`}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserCircle className="h-4 w-4" />
                  <span>View Profile</span>
                </Link>
                <Link
                  href={`/admin/${adminId}/settings`}
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </div>
              <div className="border-t border-gray-100 py-2">
                <button
                  onClick={() => {
                    setProfileOpen(false)
                    onLogoutClick()
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
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
