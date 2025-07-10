'use client';

import { useEffect, useState } from 'react'; // Import useState
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { useParams, useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { User, Package, Heart, Home, Shield, LogOut, Loader2, Edit, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

// A reusable Modal component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, confirmText = 'Confirm' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
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
          <button 
            onClick={onConfirm}
            className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UserSidebar() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading, fetchUserById } = useUserStore();
  const { logout } = useAuthStore();
  
  // ✅ 1. Add state to control the logout modal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUserById(id);
    }
  }, [id, fetchUserById]);

  const getCleanImageUrl = (url) => {
    if (!url) return '/default-avatar.png';
    const lastHttpIndex = url.lastIndexOf('http');
    if (lastHttpIndex > 0) return url.substring(lastHttpIndex);
    return url;
  };

  // ✅ 2. Update logout handler to open the modal
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };
  
  // ✅ 3. Create a function to perform the actual logout
  const confirmLogout = () => {
    logout();
    toast.success("You have been logged out.");
    router.push('/');
  };

  const navLinks = [
    { name: 'My Profile', href: `/profile/${id}/myprofile`, icon: User },
    { name: 'Edit Profile', href: `/profile/${id}/edit`, icon: Edit },
    { name: 'My Orders', href: '/orders', icon: Package },
    { name: 'Favorites', href: '/favorites', icon: Heart },
    { name: 'Shipping Addresses', href: '/addresses', icon: Home },
    { name: 'Login & Security', href: '/security', icon: Shield },
  ];

  if (loading) {
    // Loading skeleton remains the same
    return (
      <aside className="md:col-span-3 lg:col-span-3">
        <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col animate-pulse">
            <div className="mx-auto w-28 h-28 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>
            <div className="space-y-3 mt-2">
                <div className="h-10 bg-gray-200 rounded-lg"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
                <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
        </div>
      </aside>
    );
  }

  if (!user) return null;

  const imageUrl = getCleanImageUrl(user.profile_image_url);

  return (
    <>
      {/* ✅ 4. Add the modal component to the JSX */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        confirmText="Yes, Logout"
      >
        Are you sure you want to end your session and log out?
      </ConfirmationModal>
    
      <aside className="md:col-span-3 lg:col-span-3">
        <div className="bg-white p-6 rounded-xl shadow-lg h-full flex flex-col">
          <div className="text-center mb-6">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <Image src={imageUrl} alt="User Profile" layout="fill" className="rounded-full object-cover" priority />
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user.name || 'User'}</h2>
            <p className="text-sm text-gray-500">{user.email || ''}</p>
          </div>
          <nav className="flex-grow">
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${ isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
                      <link.icon className="w-5 h-5" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-6 pt-6 border-t border-gray-200">
            {/* ✅ 5. Change the onClick handler for the button */}
            <button
              onClick={handleLogoutClick}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}