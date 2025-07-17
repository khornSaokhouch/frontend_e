'use client';

import { usePathname, useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import Header from '../../components/admin/Header';     // Adjust path if needed
import Sidebar from '../../components/admin/Sidebar';  
import { useNotificationsStore } from '../../store/useNotificationsStore'; // Adjust path // Adjust path if needed

// ConfirmationModal can remain the same as you had before.
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, confirmText = 'Confirm' }) => {
    // ... same code as before
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm"
            >
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-800 pt-1.5">{title}</h2>
                </div>
                <div className="text-sm text-gray-600 mb-6 pl-13">{children}</div>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                    <button onClick={onConfirm} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">{confirmText}</button>
                </div>
            </motion.div>
        </div>
    );
};

export default function AdminLayout({ children }) {
  const { id: adminId } = useParams();
  const router = useRouter();

  const user = useUserStore(state => state.user);
  const fetchUser = useUserStore(state => state.fetchUser);
  const loadingUser = useUserStore(state => state.loading);
  const { logout } = useAuthStore();

  const emails = useNotificationsStore(state => state.emails);
  const unreadCount = useNotificationsStore(state => state.unreadCount);
  const fetchNotifications = useNotificationsStore(state => state.fetchNotifications);
  const clearUnreadCount = useNotificationsStore(state => state.clearUnreadCount);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (!user) fetchUser();
  }, [fetchUser, user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    toast.success("You have been logged out.");
    router.push('/login');
  };

  const handleViewNotifications = () => {
    clearUnreadCount();
  };
  

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

      <div className="flex h-screen bg-slate-100 font-sans">
        {/* --- DESKTOP SIDEBAR --- */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-30">
          <div className="flex min-h-0 flex-1 flex-col border-r border-slate-200 bg-white">
            <Sidebar adminId={adminId} />
          </div>
        </div>

        {/* --- MOBILE SIDEBAR --- */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 flex w-64 flex-col z-50 md:hidden"
              >
                 <Sidebar adminId={adminId} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- MAIN CONTENT & HEADER --- */}
        <div className="flex flex-1 flex-col md:pl-64">
        <Header
        user={user}
        loading={loadingUser}
        adminId={adminId}
        notificationCount={unreadCount}
        onMenuButtonClick={() => setSidebarOpen(true)}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
      />


          <main className="flex-1">
            <div className="py-8 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}