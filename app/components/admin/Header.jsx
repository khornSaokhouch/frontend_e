'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, Bell, ChevronDown, UserCircle, LogOut } from 'lucide-react';

// A simple SVG component for the US Flag. For a real app, you might use a library like 'react-flags-select'.
const UsaFlagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-7 rounded-sm" viewBox="0 0 7410 3900">
    <path fill="#b22234" d="M0 0h7410v3900H0z"/>
    <path d="M0 450h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0zm0 600h7410v300H0z" fill="#fff"/>
    <path fill="#3c3b6e" d="M0 0h3960v2100H0z"/>
    <path d="m198 210-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM498 420l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM198 630l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM498 840l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM198 1050l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM498 1260l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM198 1470l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM498 1680l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zM198 1890l-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114zm600 0-61 185 159-114h-196l159 114z" fill="#fff"/>
  </svg>
);

// A reusable Dropdown Menu component
const DropdownMenu = ({ children, open, className }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className={`absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10 ${className}`}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export default function Header({ user, loading, onMenuButtonClick, onLogoutClick, adminId }) {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isLanguageOpen, setLanguageOpen] = useState(false);
  
  const getCleanImageUrl = (url) => {
    if (!url) return '/default-avatar.png'; // Make sure you have a default avatar in /public
    const lastHttpIndex = url.lastIndexOf('http');
    return lastHttpIndex > 0 ? url.substring(lastHttpIndex) : url;
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
      
      {/* --- Left Side --- */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          type="button"
          className="text-slate-500 hover:text-slate-700 md:hidden"
          onClick={onMenuButtonClick}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Global Search Bar */}
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            className="block w-full rounded-full border-transparent bg-slate-100 py-2 pl-10 pr-4 text-sm focus:border-indigo-500 focus:bg-white focus:ring-indigo-500 sm:w-64"
          />
        </div>
      </div>

      {/* --- Right Side --- */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Bell */}
        <button type="button" className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <Bell className="h-6 w-6" />
          {/* Notification Badge */}
          <span className="absolute right-2 top-2 block h-2 w-2 rounded-full bg-red-500 ring-1 ring-white" />
        </button>

        {/* Language Switcher */}
        <div className="relative">
          <button
            onClick={() => { setLanguageOpen(!isLanguageOpen); setProfileOpen(false); }}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 transition hover:bg-slate-100"
          >
            <UsaFlagIcon />
            <span className="hidden text-sm font-medium text-slate-700 sm:block">English</span>
            <ChevronDown className="h-5 w-5 text-slate-400" />
          </button>
          <DropdownMenu open={isLanguageOpen}>
            <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Spanish</a>
            <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">French</a>
          </DropdownMenu>
        </div>
        
        {/* Divider */}
        <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!isProfileOpen); setLanguageOpen(false); }}
            className="flex items-center gap-2 rounded-full p-1 text-left transition hover:bg-slate-100"
          >
            {loading ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
            ) : (
              <Image
                src={getCleanImageUrl(user?.profile_image_url)}
                alt="Admin"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            )}
            <div className="hidden text-sm md:block">
              <p className="font-semibold text-slate-800">{loading ? 'Loading...' : user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-500">Admin</p>
            </div>
            <ChevronDown className="h-5 w-5 text-slate-400" />
          </button>
          
          <DropdownMenu open={isProfileOpen}>
            <Link
              href={`/admin/${adminId}/profile`}
              onClick={() => setProfileOpen(false)}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              <UserCircle className="h-5 w-5" /> Profile
            </Link>
            <button
              onClick={() => { setProfileOpen(false); onLogoutClick(); }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" /> Logout
            </button>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}