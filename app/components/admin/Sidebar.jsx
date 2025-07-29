"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Building2,
  Inbox,
  ShoppingCart,
  BarChart3,
  Archive,
  Tag,
  Calendar,
  CheckSquare,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  Dot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// Main navigation links
const mainLinks = [
  { href: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "users", label: "Users", icon: Users },
  {
    href: "company",
    label: "Company",
    icon: Building2,
    children: [
      { href: "/allcompany", label: "All Company" } // 👈 new item
    ],
  },
  { href: "products", label: "Products", icon: Package },
  { href: "paymenttype", label: "PaymentType", icon: Package },
  { href: "category", label: "Categories", icon: Tag },
  { href: "inbox", label: "Inbox", icon: Inbox },
  { href: "orderstatus", label: "OrderStatus", icon: ShoppingCart },
  { href: "shippingmethod", label: "ShippingMethod", icon: Archive },
  { href: "order-lines", label: "OrderLineManager", icon: Package },
];

// Secondary page links
const pageLinks = [
  { href: "analytics", label: "Analytics", icon: BarChart3 },
  { href: "calendar", label: "Calendar", icon: Calendar },
  { href: "todo", label: "Tasks", icon: CheckSquare },
  { href: "invoice", label: "Invoices", icon: FileText },
];

// Navigation item component
const NavItem = ({ href, icon: Icon, label, isActive, hasChildren, isExpanded, onToggle, isChild = false }) => {
  const baseClasses = `group flex items-center justify-between w-full px-4 py-3 rounded-md font-medium transition-colors duration-200 ${
    isChild ? "text-sm pl-10" : ""
  }`;

  const activeClasses = isActive
    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25"
    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

  const content = (
    <div className="flex items-center gap-3">
      {Icon && (
        <Icon
          className={`h-5 w-5 transition-colors ${
            isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
          }`}
        />
      )}
      {isChild && !Icon && <Dot className="h-4 w-4 text-gray-400" />}
      <span className="truncate">{label}</span>
    </div>
  );

  const chevron = (
    <ChevronRight
      className={`h-4 w-4 transition-transform duration-200 ${
        isExpanded ? "rotate-90" : ""
      } ${isActive ? "text-white" : "text-gray-400"}`}
    />
  );

  if (hasChildren) {
    return (
      <button onClick={onToggle} className={`${baseClasses} ${activeClasses} w-full`}>
        {content}
        {chevron}
      </button>
    );
  }

  return (
    <Link href={href} className={`${baseClasses} ${activeClasses}`}>
      {content}
      {hasChildren && chevron}
    </Link>
  );
};

// Collapsible section component
const CollapsibleSection = ({ link, adminId, pathname, isExpanded, onToggle }) => {
  const createHref = (slug) => `/admin/${adminId}/${slug}`;

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
            <div className="mt-1 space-y-1">
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
  );
};

export default function Sidebar({ adminId, onLogoutClick }) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState(new Set());

  const createHref = (slug) => `/admin/${adminId}/${slug}`;

  const toggleExpanded = (label) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      className="flex h-full flex-col bg-white border-r border-gray-200 w-72"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-center px-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
            <Package className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-blue-600">Admin</span>
              <span className="text-gray-800">Panel</span>
            </h1>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-6">
        {/* Main Navigation */}
        <motion.nav className="space-y-2" variants={itemVariants}>
          <div className="mb-4">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main Menu</h3>
            <div className="space-y-1">
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
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pages Section */}
          <div>
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pages</h3>
            <div className="space-y-1">
              {pageLinks.map((link) => (
                <motion.div key={link.label} variants={itemVariants}>
                  <NavItem
                    href={createHref(link.href)}
                    icon={link.icon}
                    label={link.label}
                    isActive={pathname === createHref(link.href)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="space-y-1">
          <NavItem
            href={createHref("settings")}
            icon={Settings}
            label="Settings"
            isActive={pathname === createHref("settings")}
          />
          <button
            onClick={onLogoutClick}
            className="group flex w-full items-center gap-3 px-4 py-3 rounded-md font-medium text-gray-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5 text-gray-500 group-hover:text-red-500 transition-colors" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}