"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clock,
  Package,
  Heart,
  Inbox,
  ClipboardList,
  Archive,
  Tag,
  Calendar,
  CheckSquare,
  Users,
  FileText,
  Settings,
  LogOut,
  HomeIcon,
  CassetteTape as CassetteTapeIcon, // Fixed to CassetteTape as CassetteTapeIcon
} from "lucide-react";
import { motion } from "framer-motion";

// --- Data for the links ---
const mainLinks = [
  { href: "dashboard", label: "Dashboard", icon: Clock },
  { href: "users", label: "Users", icon: Users },
  {
    href: "company",
    label: "Company",
    icon: HomeIcon,
    children: [
      { href: "company/company_info", label: "Company_info" },
    ],
  },
  { href: "products", label: "Products", icon: Package },
  { href: "category", label: "Category", icon: CassetteTapeIcon }, // use CassetteTapeIcon here
  { href: "inbox", label: "Inbox", icon: Inbox },
  { href: "status", label: "Status", icon: Archive },
  { href: "orders", label: "Order Lists", icon: ClipboardList },
  { href: "stock", label: "Product Stock", icon: Archive },
];

const pageLinks = [
  { href: "pricing", label: "Pricing", icon: Tag },
  { href: "calendar", label: "Calender", icon: Calendar },
  { href: "todo", label: "To-Do", icon: CheckSquare },
  { href: "contact", label: "Contact", icon: Users },
  { href: "invoice", label: "Invoice", icon: FileText },
  // Add more pages as needed
];

// --- Reusable Nav Item Component ---
const NavItem = ({ href, icon, label, isActive }) => {
  const IconComponent = icon; // Assign the icon to a variable

  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-4 py-3 rounded-lg font-medium transition-colors ${
        isActive
          ? "bg-indigo-600 text-white"
          : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      {IconComponent && <IconComponent className={`h-5 w-5 transition-colors ${isActive ? "text-white" : "text-slate-500"}`} />} {/* Render icon only if it exists */}
      <span>{label}</span>
    </Link>
  );
};

export default function Sidebar({ adminId, onLogoutClick }) {
  // Added onLogoutClick prop
  const pathname = usePathname();

  // Helper to construct full URLs
  const createHref = (slug) => `/admin/${adminId}/${slug}`;

  // Animation Variants for Menu Items
  const menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div className="flex h-full flex-col bg-white">
      {/* Sidebar Header: Logo */}
      <div className="flex h-20 flex-shrink-0 items-center justify-center border-b border-slate-200 px-4">
        <Link href="/" className="transition-opacity hover:opacity-80">
          <h1 className="text-2xl font-bold tracking-tighter">
            <span className="text-indigo-600">Dash</span>
            <span className="text-slate-800">Stack</span>
          </h1>
        </Link>
      </div>

      {/* Main Navigation Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="flex flex-col gap-1">
          {mainLinks.map((link) => (
            <div key={link.label}>
              <NavItem
                href={createHref(link.href)}
                icon={link.icon}
                label={link.label}
                isActive={pathname === createHref(link.href)}
              />
              {link.children && (
                <nav className="ml-6 flex flex-col gap-1">
                  {link.children.map((child) => (
                    <NavItem
                      key={child.label}
                      href={createHref(child.href)}
                      label={child.label}
                      isActive={pathname === createHref(child.href)}
                      // Optional: Add icon if children have icons, else omit
                      icon={child.icon}
                    />
                  ))}
                </nav>
              )}
            </div>
          ))}
        </nav>

        {/* Pages Section */}
        <div className="mt-8">
          <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Pages
          </h3>
          <nav className="mt-2 flex flex-col gap-1">
            {pageLinks.map((link) => (
              <NavItem
                key={link.label}
                href={createHref(link.href)}
                icon={link.icon}
                label={link.label}
                isActive={pathname === createHref(link.href)}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom Section: Settings & Logout */}
      <div className="border-t border-slate-200 p-4">
        <nav className="flex flex-col gap-1">
          <NavItem
            href={createHref("settings")}
            icon={Settings}
            label="Settings"
            isActive={pathname === createHref("settings")}
          />
          {/* Logout is a button, not a link */}
          <button
            onClick={onLogoutClick} // Use the prop here
            className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            <LogOut className="h-5 w-5 text-slate-500" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </motion.div>
  );
}