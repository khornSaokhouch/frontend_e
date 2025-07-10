'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Package, Heart, ShoppingCart } from 'lucide-react';

// Reusable SVG icon for the logo.
const TechLogoIcon = (props) => (
  <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="logoGradient" x1="12" y1="20" x2="28" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F472B6"/> {/* Pink */}
        <stop offset="1" stopColor="#A78BFA"/> {/* Purple */}
      </linearGradient>
    </defs>
    <path d="M12 10H28" stroke="url(#logoGradient)" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M20 10V30" stroke="url(#logoGradient)" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M16 30C16 27.7909 17.7909 26 20 26C22.2091 26 24 27.7909 24 30" stroke="url(#logoGradient)" strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
);

export default function Navbar() {
  const router = useRouter();
  const { user: authUser } = useAuthStore();
  const { user: userProfile, fetchUser } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (authUser?.id) {
      fetchUser();
    }
  }, [authUser, fetchUser]);
  
  const getCleanImageUrl = (url) => {
    if (!url) {
      return '/default-avatar.png';
    }
    const lastHttpIndex = url.lastIndexOf('http');
    if (lastHttpIndex > 0) {
      return url.substring(lastHttpIndex);
    }
    return url;
  };

  const imageUrl = userProfile ? getCleanImageUrl(userProfile.profile_image_url) : '/default-avatar.png';

  return (
    <div className="w-full p-4 font-sans">
      <header className="bg-white w-full max-w-screen-1xl mx-auto rounded-xl shadow-lg px-4 sm:px-6 lg:px-8">
        
        {/* Top Row */}
        <div className="flex items-center justify-between h-20 gap-4 md:gap-8">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-1">
              <TechLogoIcon className="h-8 w-8 md:h-9 md:w-9" />
              <span className="hidden sm:inline text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text whitespace-nowrap">
                E-COMMERCES
              </span>
            </Link>
          </div>

          <div className="flex-1 min-w-0 max-w-2xl">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                name="search"
                placeholder="DJI phantom"
                className="w-full h-12 py-3 pl-4 pr-11 text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="flex-shrink-0">
            {userProfile ? (
              // ✅ FIXED: Icons now have a consistent circular style
              <div className="flex items-center gap-4">
                <Link 
                  href="/favorites" 
                  title="Favorites" 
                  className="flex items-center justify-center w-11 h-11 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <Heart className="h-6 w-6 text-gray-600" />
                </Link>
                <Link 
                  href="/cart" 
                  title="Cart" 
                  className="flex items-center justify-center w-11 h-11 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <ShoppingCart className="h-6 w-6 text-gray-600" />
                </Link>
                <Link href={`/profile/${userProfile.id}/myprofile`} className="block group">
  <div className="w-11 h-11 relative rounded-full overflow-hidden ring-2 ring-purple-400 group-hover:ring-purple-600 transition-all duration-200">
    <Image
      src={imageUrl}
      alt="User Profile"
      fill
      sizes="44px"
      className="object-cover"
      key={imageUrl}
    />
  </div>
</Link>

              </div>
            ) : (
              // Login/Register buttons
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-pink-500 border border-pink-500 rounded-lg hover:bg-pink-600 transition-colors whitespace-nowrap"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <nav className="flex items-center justify-between h-14 text-sm font-bold text-gray-800">
          <div className="flex items-center gap-6 md:gap-10">
            <div className="flex items-center gap-2 text-gray-600 font-medium">
              <MapPin className="h-5 w-5 flex-shrink-0" />
              <span className="hidden md:inline">Cambodia</span>
            </div>
            <div className="flex items-center gap-4 md:gap-8">
              <Link href="/" className="hover:text-pink-600 transition-colors">Home</Link>
              <Link href="/store" className="hover:text-pink-600 transition-colors">Store</Link>
              <Link href="/faq" className="hover:text-pink-600 transition-colors">FQA</Link>
              <Link href="/orders" className="flex items-center gap-2 hover:text-pink-600 transition-colors">
                <Package className="h-5 w-5 text-gray-500" />
                <span>Orders</span>
              </Link>
            </div>
          </div>
          <div>
            <Link href="/sell" className="hover:text-pink-600 transition-colors whitespace-nowrap">
              Become a seller
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
}