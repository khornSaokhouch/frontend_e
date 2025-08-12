"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Users,
  Building2,
  Inbox,
  ShoppingCart,
  BarChart3,
  Tag,
  Calendar,
  CheckSquare,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  Dot,
  Store,
  CreditCard,
  Truck,
  ListOrdered,
  X,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

// Main navigation links
const mainLinks = [
  { href: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "from-blue-500 to-blue-600" },
  { href: "users", label: "Users", icon: Users, color: "from-green-500 to-green-600" },
  {
    href: "company",
    label: "Manage Company",
    icon: Building2,
    color: "from-purple-500 to-purple-600",
    children: [{ href: "/allcompany", label: "Company"}, 
      { href: "/store", label: "Store"}
    ],
  },
  { href: "products", label: "Products", icon: Package, color: "from-orange-500 to-orange-600" },
  { href: "paymenttype", label: "Payment Types", icon: CreditCard, color: "from-emerald-500 to-emerald-600" },
  { href: "category", label: "Categories", icon: Tag, color: "from-pink-500 to-pink-600" },
  { href: "inbox", label: "Inbox", icon: Inbox, color: "from-indigo-500 to-indigo-600" },
  { href: "orderstatus", label: "Order Status", icon: ShoppingCart, color: "from-red-500 to-red-600" },
  { href: "shippingmethod", label: "Shipping", icon: Truck, color: "from-cyan-500 to-cyan-600" },
  { href: "order-lines", label: "Order Lines", icon: ListOrdered, color: "from-yellow-500 to-yellow-600" },
]

// Secondary page links
const pageLinks = [
  { href: "analytics", label: "Analytics", icon: BarChart3, color: "from-violet-500 to-violet-600" },
  { href: "calendar", label: "Calendar", icon: Calendar, color: "from-teal-500 to-teal-600" },
  { href: "todo", label: "Tasks", icon: CheckSquare, color: "from-rose-500 to-rose-600" },
  { href: "invoice", label: "Invoices", icon: FileText, color: "from-amber-500 to-amber-600" },
]

// Navigation item component
const NavItem = ({
  href,
  icon: Icon,
  label,
  isActive,
  hasChildren,
  isExpanded,
  onToggle,
  isChild = false,
  color = "from-gray-500 to-gray-600",
}) => {
  const baseClasses = `group flex items-center justify-between w-full px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
    isChild ? "text-sm pl-12 ml-2" : ""
  }`

  const activeClasses = isActive
    ? `bg-gradient-to-r ${color} text-white shadow-lg shadow-${color.split("-")[1]}-500/25 transform scale-[1.02]`
    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:scale-[1.01]"

  const content = (
    <div className="flex items-center gap-3">
      {Icon && (
        <div
          className={`p-1.5 rounded-lg transition-all ${
            isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200"
          }`}
        >
          <Icon
            className={`h-4 w-4 transition-colors ${
              isActive ? "text-white" : "text-gray-600 group-hover:text-gray-700"
            }`}
          />
        </div>
      )}
      {isChild && !Icon && (
        <div className="w-6 h-6 flex items-center justify-center">
          <Dot className="h-4 w-4 text-gray-400" />
        </div>
      )}
      <span className="truncate">{label}</span>
    </div>
  )

  const chevron = (
    <ChevronRight
      className={`h-4 w-4 transition-transform duration-200 ${
        isExpanded ? "rotate-90" : ""
      } ${isActive ? "text-white" : "text-gray-400"}`}
    />
  )

  if (hasChildren) {
    return (
      <button onClick={onToggle} className={`${baseClasses} ${activeClasses} w-full`}>
        {content}
        {chevron}
      </button>
    )
  }

  return (
    <Link href={href} className={`${baseClasses} ${activeClasses}`}>
      {content}
      {hasChildren && chevron}
    </Link>
  )
}

// Collapsible section component
const CollapsibleSection = ({ link, adminId, pathname, isExpanded, onToggle }) => {
  const createHref = (slug) => `/admin/${adminId}/${slug}`

  return (
    <div>
      <NavItem
        href={createHref(link.href)}
        icon={link.icon}
        label={link.label}
        isActive={pathname === createHref(link.href)}
        hasChildren={!!link.children}
        isExpanded={isExpanded}
        onToggle={onToggle}
        color={link.color}
      />
      <AnimatePresence>
        {isExpanded && link.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1">
              {link.children.map((child) => (
                <NavItem
                  key={child.label}
                  href={createHref(child.href)}
                  label={child.label}
                  isActive={pathname === createHref(child.href)}
                  isChild={true}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Sidebar({ adminId, onLogoutClick, onClose }) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState(new Set())

  const createHref = (slug) => `/admin/${adminId}/${slug}`

  const toggleExpanded = (label) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(label)) {
      newExpanded.delete(label)
    } else {
      newExpanded.add(label)
    }
    setExpandedItems(newExpanded)
  }

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.02,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.div
      className="flex h-full flex-col bg-white/95 backdrop-blur-xl border-r border-gray-200/50 w-72 shadow-xl"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200/50">
        <Link href="/" className="flex items-center space-x-3 transition-all hover:scale-105">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 shadow-lg">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Commerce
              </span>
              {/* <span className="text-gray-800">Hub</span> */}
            </h1>
            <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
          </div>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Main Navigation */}
        <motion.nav variants={itemVariants}>
          <div className="mb-6">
            <div className="flex items-center gap-2 px-4 mb-4">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Main Menu</h3>
            </div>
            <div className="space-y-2">
              {mainLinks.map((link) => (
                <motion.div key={link.label} variants={itemVariants}>
                  {link.children ? (
                    <CollapsibleSection
                      link={link}
                      adminId={adminId}
                      pathname={pathname}
                      isExpanded={expandedItems.has(link.label)}
                      onToggle={() => toggleExpanded(link.label)}
                    />
                  ) : (
                    <NavItem
                      href={createHref(link.href)}
                      icon={link.icon}
                      label={link.label}
                      isActive={pathname === createHref(link.href)}
                      color={link.color}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pages Section */}
          <div>
            <div className="flex items-center gap-2 px-4 mb-4">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Analytics & Tools</h3>
            </div>
            <div className="space-y-2">
              {pageLinks.map((link) => (
                <motion.div key={link.label} variants={itemVariants}>
                  <NavItem
                    href={createHref(link.href)}
                    icon={link.icon}
                    label={link.label}
                    isActive={pathname === createHref(link.href)}
                    color={link.color}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200/50 p-4 bg-gray-50/50">
        <div className="space-y-2">
          <NavItem
            href={createHref("settings")}
            icon={Settings}
            label="Settings"
            isActive={pathname === createHref("settings")}
            color="from-gray-500 to-gray-600"
          />
          <button
            onClick={onLogoutClick}
            className="group flex w-full items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:scale-[1.01]"
          >
            <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-all">
              <LogOut className="h-4 w-4 text-gray-600 group-hover:text-red-500 transition-colors" />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
