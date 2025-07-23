'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Bell, MessageSquare, Menu, UserCircle, LogOut } from 'lucide-react';

// A small utility function to handle image URLs
const getCleanImageUrl = (url) => {
  if (!url) return '/default-avatar.png'; // Provide a path to a default image
  const lastHttpIndex = url.lastIndexOf('http');
  if (lastHttpIndex > 0) return url.substring(lastHttpIndex);
  return url;
};

export default function Navbar({ user, loadingUser, onMenuButtonClick, onLogoutClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-slate-100">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          <button onClick={onMenuButtonClick} className="md:hidden text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-slate-800">
            Overview
          </h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Post Product Button */}
          <button className="hidden sm:flex items-center gap-2 px-5 py-2 bg-blue-500 text-white font-semibold rounded-xl text-sm hover:bg-blue-600 transition-colors">
            <Plus className="w-4 h-4" />
            Post Product
          </button>

          {/* Chat Icon Button */}
          <button className="relative w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
            <MessageSquare className="w-5 h-5 text-gray-500" />
            <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
          </button>

          {/* Bell Icon Button */}
          <button className="relative w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5 text-red-400" />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full ring-2 ring-red-400" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center">
              {loadingUser ? (
                <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
              ) : (
                <Image
                src={getCleanImageUrl(user?.profile_image_url)}
                alt="Admin"
                width={40}
                height={40}
                style={{ height: "auto" }}
                className="rounded-full object-cover"
              />              
              )}
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20 overflow-hidden border border-gray-200"
                >
                  <Link href={`/company/${user?.id}/profile`} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <UserCircle className="w-5 h-5" /> Profile
                  </Link>
                  <button onClick={onLogoutClick} className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}