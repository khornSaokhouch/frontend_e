"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "../store/authStore";
import { useUserStore } from "../store/userStore";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Search,
  MapPin,
  Package,
  Heart,
  ShoppingCart,
  Menu,
  LogIn,
  X,
} from "lucide-react";

// Reusable SVG icon for the logo
const TechLogoIcon = (props) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient
        id="logoGradient"
        x1="12"
        y1="20"
        x2="28"
        y2="20"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#F472B6" />
        <stop offset="1" stopColor="#A78BFA" />
      </linearGradient>
    </defs>
    <path
      d="M12 10H28"
      stroke="url(#logoGradient)"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M20 10V30"
      stroke="url(#logoGradient)"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M16 30C16 27.7909 17.7909 26 20 26C22.2091 26 24 27.7909 24 30"
      stroke="url(#logoGradient)"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

export default function Navbar() {
  const { id } = useParams();
  const router = useRouter();
  const { user: authUser } = useAuthStore();
  const { user: userProfile, fetchUserById } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (authUser?.id) {
      fetchUserById(authUser.id);
    }
  }, [authUser, fetchUserById]);

  const getCleanImageUrl = (url) => {
    if (!url) {
      return "/default-avatar.png";
    }
    const lastHttpIndex = url.lastIndexOf("http");
    if (lastHttpIndex > 0) {
      return url.substring(lastHttpIndex);
    }
    return url;
  };

  const imageUrl = userProfile
    ? getCleanImageUrl(userProfile.profile_image_url)
    : "/default-avatar.png";

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
  ];

  return (
    <div className="w-full p-2 font-sans">
      <header className="bg-white w-full max-w-screen-2xl mx-auto rounded-xl shadow-lg px-4 py-4 sm:px-6 lg:px-8">
        {/* Top Row - Compact Layout */}
        <div className="flex items-center justify-between h-16">
          {/* Mobile Menu Button, Logo, & Navigation Items */}
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden text-gray-600 hover:text-gray-800 focus:outline-none mr-3"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" /> // Close icon when menu is open
              ) : (
                <Menu className="h-5 w-5" /> // Menu icon when menu is closed
              )}
            </button>

            {/* Logo & Navigation Items */}
            <div className="flex items-center gap-8 space-x-10">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-1">
                <TechLogoIcon className="h-6 w-6" />
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text whitespace-nowrap">
                  E-COMMERCES
                </span>
              </Link>

              {/* Navigation Items (Visible on larger screens) */}
              <div className="hidden md:flex items-center gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="hover:text-pink-600 transition-colors  whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href={id ? `/user/${authUser?.id}/become-a-company` : "/login"}
                  className="hover:text-pink-600 transition-colors whitespace-nowrap"
                >
                  Become a seller
                </Link>
              </div>
            </div>

            <div>
            </div>
          </div>

          {/* Search Bar - Responsive Width */}
          <div className="relative hidden sm:flex flex-grow max-w-md mx-4">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              name="search"
              placeholder="Search..."
              className="w-full h-10 py-2 pl-3 pr-10 text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
              autoComplete="off"
            />
          </div>

          {/* User Profile/Actions */}
          <div className="flex items-center space-x-3">
            {userProfile ? (
              <>
                {/* Icons and Profile Image on Small Screens */}
                <div className="sm:hidden flex items-center space-x-2">
                  <Link
                    href={`/profile/${authUser?.id}/favorites`}
                    title="Favorites"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Heart className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/user/${authUser?.id}/shopping-cart`}
                    title="Cart"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Link>
                  <Link
                    href={`/profile/${userProfile.id}/myprofile`}
                    className=""
                  >
                    <div className="w-8 h-8 relative rounded-full overflow-hidden ring-2 ring-purple-400 group-hover:ring-purple-600 transition-all duration-200">
                      <Image
                        src={imageUrl}
                        alt="User Profile"
                        fill
                        sizes="32px"
                        className="object-cover"
                        key={imageUrl}
                      />
                    </div>
                  </Link>
                </div>

                {/* Icons on Larger Screens */}
                <div className="hidden sm:flex items-center gap-4">
                  <Link
                    href={`/profile/${authUser?.id}/favorites`}
                    title="Favorites"
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <Heart className="h-5 w-5 text-gray-600" />
                  </Link>
                  <Link
                    href={`/user/${authUser?.id}/shopping-cart`}
                    title="Cart"
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                  </Link>
                  <Link
                    href={`/profile/${userProfile.id}/myprofile`}
                    className="block group"
                  >
                    <div className="w-10 h-10 relative rounded-full overflow-hidden ring-2 ring-purple-400 group-hover:ring-purple-600 transition-all duration-200">
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
              </>
            ) : (
              // Login/Register Buttons
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

        {/* Mobile Menu (Hidden by default) */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-gray-100 p-4 rounded-md shadow-md">
            {/* Search Bar within Mobile Menu */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                name="search"
                placeholder="Search..."
                className="w-full h-10 py-2 pl-3 pr-10 text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                autoComplete="off"
              />
            </div>

            <nav className="flex flex-col items-start gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="hover:text-pink-600 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href={id ? `/user/${authUser?.id}/become-a-company` : "/login"}
                className="hover:text-pink-600 transition-colors"
              >
                Become a seller
              </Link>
            </nav>
            <div className="flex flex-col items-start gap-4">
              <Link
                href="/products"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 mr-1" />
                Store
              </Link>
              <Link
                href="/faq"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Package className="h-5 w-5 mr-1" />
                FAQ
              </Link>
              <Link
                href="/orders"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ShoppingCart className="h-5 w-5 mr-1" />
                Orders
              </Link>
            </div>
          </div>
        )}

        {/* Location and Cart Icons (Visible on larger screens) */}
        <div className="hidden md:flex items-center space-x-10 text-sm">
          <Link
            href="/location"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <MapPin className="h-5 w-5" />
            <span className="ml-1">Location : Cambodia</span>
          </Link>
          <Link
            href="/products"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="ml-1">Store</span>
          </Link>
          <Link
            href="/faq"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Package className="h-5 w-5" />
            <span className="ml-1">FAQ</span>
          </Link>
          <Link
            href="/products"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="ml-1">Products</span>
          </Link>
          <Link
            href="/orders"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            <span className="ml-1">Orders</span>
          </Link>


         
        </div>

        {/* Desktop Navigation (Hidden on Small Screens) */}
      </header>
    </div>
  );
}