// app/components/company/Navbar.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Bell, MessageSquare, Menu, Settings, LogOut } from 'lucide-react';

const getCleanImageUrl = (url) => {
  if (!url) return '/default-avatar.png';
  const lastHttpIndex = url.lastIndexOf('http');
  if (lastHttpIndex > 0) return url.substring(lastHttpIndex);
  return url;
};

export default function Navbar({ user, loadingUser, onMenuButtonClick, onLogoutClick, pageTitle, profileLink }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-6 md:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuButtonClick}
            className="md:hidden text-slate-600 hover:text-slate-800"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800">
            {pageTitle || 'Dashboard'}
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md text-sm hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <Plus className="w-4 h-4" />
            Post Product
          </button> */}

          <button className="relative w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
          </button>

          <button className="relative w-10 h-10 flex items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          <div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center">
              {loadingUser ? (
                <div className="w-10 h-10 bg-slate-300 rounded-full animate-pulse" />
              ) : (
                <Image
                  src={getCleanImageUrl(user?.profile_image_url)}
                  alt={user?.name || 'Admin'}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-md shadow-lg z-20 overflow-hidden ring-1 ring-slate-900/5"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className='p-2'>
                    <div className="px-2 py-2 text-left">
                        <p className="text-sm font-semibold text-slate-800">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className='h-px bg-slate-200 my-1' />
                    <Link href={profileLink} className="flex items-center gap-3 w-full px-2 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-100">
                      <Settings className="w-5 h-5" /> Settings & Profile
                    </Link>
                    <button onClick={onLogoutClick} className="flex items-center gap-3 w-full px-2 py-2 text-sm text-red-600 rounded-md hover:bg-red-50">
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}