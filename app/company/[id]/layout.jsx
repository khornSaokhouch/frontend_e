'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';

import Navbar from '../../components/company/Navbar';
import Sidebar from '../../components/company/Sidebar'; 

// ✅ STEP 1: Import the new custom icons and the standard 'Home' icon.
import { Home, AlertTriangle } from 'lucide-react';
import {
  OrderListsIcon,
  ProductIcon,
  CategoriesIcon,
  CustomersIcon,
  DraftIcon,
  AccountsIcon,
  SettingIcon,
} from '../../components/company/CustomIcons'; // Adjust path if necessary

// ConfirmationModal component (no changes needed)
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, confirmText = 'Confirm' }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
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
      <div className="flex h-screen items-center justify-center bg-slate-100">
        <p>Loading...</p>
      </div>
    );
  }

  // ✅ STEP 2: Update the 'links' array to use the newly imported custom icons.
  const links = [
    { href: `/company/${id}/dashboard`, label: 'Dashboard', icon: Home },
    { href: `/company/${id}/order-lists`, label: 'Order Lists', icon: OrderListsIcon },
    { href: `/company/${id}/product`, label: 'Product', icon: ProductIcon },
    { href: `/company/${id}/categories`, label: 'Categories', icon: CategoriesIcon },
    { href: `/company/${id}/customers`, label: 'Customers', icon: CustomersIcon },
    { href: `/company/${id}/draft`, label: 'Draft', icon: DraftIcon },
    { href: `/company/${id}/accounts`, label: 'Accounts', icon: AccountsIcon },
    { href: `/company/${id}/setting`, label: 'Setting', icon: SettingIcon },
  ];

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

      <div className="flex h-screen bg-slate-100 font-sans">
        {/* The Sidebar component will now receive the correct custom icons */}
        <aside className="hidden md:flex md:w-72 md:flex-shrink-0">
          <Sidebar links={links} pathname={pathname} />
        </aside>

        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 z-30 h-full w-72 md:hidden"
              >
                <Sidebar links={links} pathname={pathname} />
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
          />

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100">
            <div className="container mx-auto px-6 py-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}