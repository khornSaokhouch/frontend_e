'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, Users, UserCircle, LogOut, Menu, X, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

// A reusable Modal component (no changes needed here)
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, confirmText = 'Confirm' }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-opacity-60 z-50 flex justify-center items-center p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
        >
          <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          </div>
          <div className="text-sm text-gray-600 mb-6">{children}</div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


export default function AdminLayout({ children }) {
  const { id } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const loadingUser = useUserStore((state) => state.loading);
  const { logout } = useAuthStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const links = [
    { href: `/admin/${id}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `/admin/${id}/users`, label: 'Users', icon: Users },
    { href: `/admin/${id}/category`, label: 'Category', icon: UserCircle },
  ];
  
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  

  const getCleanImageUrl = (url) => {
    if (!url) return '/default-avatar.png';
    const lastHttpIndex = url.lastIndexOf('http');
    if (lastHttpIndex > 0) return url.substring(lastHttpIndex);
    return url;
  };

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out.");
    router.push('/login');
  };

  // ✅ UPDATED: SidebarContent with new styling for a white background
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="text-2xl font-bold tracking-wide text-gray-800">Admin Panel</Link>
      </div>
      <nav className="flex-grow px-2 py-4">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-purple-100 text-purple-700' // Active state style
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900' // Inactive state style
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        confirmText="Yes, Logout"
      >
        Are you sure you want to end your admin session?
      </ConfirmationModal>

      <div className="flex h-screen bg-gray-100 font-sans">
        {/* ✅ UPDATED: Static Sidebar for Desktop with white background */}
        <aside className="hidden md:flex md:flex-shrink-0 w-64 bg-white border-r border-gray-200">
          <SidebarContent />
        </aside>

        {/* ✅ UPDATED: Mobile Sidebar with white background */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-opacity-50 z-20 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full w-64 bg-white z-30 md:hidden"
              >
                <SidebarContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header (no changes needed here) */}
          <header className="bg-white shadow-sm">
            <div className="container mx-auto flex items-center justify-between px-6 py-3">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-600">
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-semibold text-gray-700 hidden md:block">
                {links.find(l => l.href === pathname)?.label || 'Admin'}
              </h2>
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 text-left">
                  {loadingUser ? (
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                  ) : (
                    <Image
                      src={getCleanImageUrl(user?.profile_image_url)}
                      alt="Admin"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  )}
                   <div className='hidden md:block'>
                    <p className="font-semibold text-sm text-gray-800">{loadingUser ? 'Loading...' : user?.name}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-10 overflow-hidden border"
                    >
                      <Link href={`/admin/${user.id}/profile`} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <UserCircle className="w-5 h-5" /> Profile
                      </Link>
                      <button onClick={() => setIsLogoutModalOpen(true)} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-5 h-5" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* Main Content (no changes needed here) */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}