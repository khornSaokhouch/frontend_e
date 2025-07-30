// File: components/UserSidebar.js
"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { useAuthStore } from "../store/authStore";
import { useParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  Home,
  Shield,
  LogOut,
  Edit,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

// --- ConfirmationModal component (no changes needed) ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, confirmText = "Confirm" }) => {
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
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">{confirmText}</button>
        </div>
      </div>
    </div>
  );
};


export default function UserSidebar() {
  // --- ALL YOUR ORIGINAL LOGIC IS PRESERVED ---
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading, fetchUserById } = useUserStore();
  const { logout } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (id) fetchUserById(id);
  }, [id, fetchUserById]);

  const getCleanImageUrl = (url) => {
    if (!url) return "/default-avatar.png";
    const lastHttpIndex = url.lastIndexOf("http");
    if (lastHttpIndex > 0) return url.substring(lastHttpIndex);
    return url;
  };

  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const confirmLogout = () => {
    logout();
    toast.success("You have been logged out.");
    router.push("/");
  };
  // --- END OF YOUR LOGIC ---

  const navLinks = [
    { name: "Profile", href: `/profile/${id}/myprofile`, icon: User },
    { name: "Edit", href: `/profile/${id}/edit`, icon: Edit },
    { name: "Orders", href: `/profile/${id}/orders`, icon: Package },
    { name: "Favorites", href: `/profile/${id}/favorites`, icon: Heart },
    { name: "Addresses", href: "/addresses", icon: Home },
    { name: "Security", href: "/security", icon: Shield },
  ];

  if (loading) {
    // --- Skeleton Loader for the new design ---
    return (
      <aside className="lg:w-80 lg:flex-shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-sm animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="mt-6 h-10 bg-gray-200 rounded-lg"></div>
          <div className="mt-2 h-10 bg-gray-200 rounded-lg"></div>
          <div className="mt-2 h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </aside>
    );
  }

  if (!user) return null;
  const imageUrl = getCleanImageUrl(user.profile_image_url);

  return (
    <>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        confirmText="Yes, Logout"
      >
        Are you sure you want to end your session and log out?
      </ConfirmationModal>

      {/* --- NEW RESPONSIVE JSX STRUCTURE --- */}
      <aside className="lg:w-80 lg:flex-shrink-0">
        {/* Profile Card (Visible on all screen sizes) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm lg:hidden">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <Image src={imageUrl} alt="User Profile" fill className="rounded-full object-cover" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.name || "User"}</h2>
              <p className="text-sm text-gray-500">{user.email || ""}</p>
            </div>
          </div>
        </div>

        {/* This is the new responsive navigation container */}
        <div className="lg:sticky lg:top-24">
          {/* Desktop Sidebar (hidden on mobile) */}
          <div className="hidden lg:block bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-center mb-6">
              <div className="relative w-28 h-28 mx-auto mb-4">
                <Image src={imageUrl} alt="User Profile" fill sizes="112px" className="rounded-full object-cover" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{user.name || "User"}</h2>
              <p className="text-sm text-gray-500">{user.email || ""}</p>
            </div>
            <nav>
              <ul className="space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.name}>
                      <Link href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${isActive ? "bg-orange-100 text-orange-700" : "text-gray-600 hover:bg-gray-100"}`}>
                        <link.icon className="w-5 h-5" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button onClick={handleLogoutClick} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          
          {/* Mobile Horizontal Nav (hidden on desktop) */}
          <nav className="lg:hidden mt-6">
            <div className="flex space-x-2 overflow-x-auto pb-4 -mx-4 px-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap ${isActive ? "bg-orange-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
              {/* Mobile Logout Button */}
              <button onClick={handleLogoutClick} className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap bg-red-50 text-red-600 hover:bg-red-100">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}