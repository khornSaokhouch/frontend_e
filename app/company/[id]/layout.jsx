// app/admin/[id]/page.jsx
"use client";

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

import Navbar from '../../components/company/Navbar';
import Sidebar from '../../components/company/Sidebar';

import {
  LayoutGrid,
  AlertTriangle,
  Users,
  Settings,
  Package,
  Box,
  Tags,
  TicketPercent,
  Warehouse,
  Receipt,
  Building2,
} from 'lucide-react';

// ConfirmationModal component - Light Mode Only
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, confirmText = 'Confirm' }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
              <div className="text-sm text-slate-600 mt-2">{children}</div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50">
              Cancel
            </button>
            <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id, fetchUser]);
  
  const handleLogout = () => {
    logout();
    toast.success("You have been logged out.");
    router.push('/login');
  };
  
  if (!id) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p>Loading...</p>
      </div>
    );
  }

  const links = [
    { href: `/company/${id}/dashboard`, label: 'Dashboard', icon: LayoutGrid },
    { href: `/company/${id}/order`, label: 'Order Lists', icon: Package },
    { href: `/company/${id}/product`, label: 'Product', icon: Box },
    { href: `/company/${id}/categories`, label: 'Categories', icon: Tags },
    { href: `/company/${id}/promotionCategories`, label: 'Promotion Categories', icon: TicketPercent },
    { href: `/company/${id}/promotions`, label: 'Promotions', icon: TicketPercent },
    { href: `/company/${id}/stores`, label: 'Add Stores', icon: Warehouse },
    { href: `/company/${id}/invoicemanager`, label: 'Invoice Manager', icon: Receipt },
    { href: `/company/${id}/stocks`, label: 'Stocks', icon: Building2 },
    { href: `/company/${id}/accounts`, label: 'Accounts', icon: Users },
    { href: `/company/${id}/setting`, label: 'Setting', icon: Settings },
  ];

  const currentPage = links.find(link => pathname.startsWith(link.href));
  const pageTitle = currentPage ? currentPage.label : 'Dashboard';
  const profileLink = `/company/${id}/profile`;

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
      
      <div className="flex h-screen bg-white font-sans">
        <aside className="hidden md:flex md:w-72 md:flex-shrink-0">
          <Sidebar links={links} />
        </aside>

        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-20 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 z-30 h-full w-72 md:hidden"
              >
                <Sidebar links={links} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar 
            user={user}
            loadingUser={loadingUser}
            onMenuButtonClick={() => setSidebarOpen(true)}
            onLogoutClick={() => setIsLogoutModalOpen(true)}
            pageTitle={pageTitle}
            profileLink={profileLink}
          />

          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="container mx-auto px-6 py-10 md:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}