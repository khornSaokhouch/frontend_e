"use client"; // For Next.js App Router

import React from 'react';
import Link from 'next/link';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
  FaLock
} from 'react-icons/fa';

const EcommerceFooter = () => {
  return (
    <footer className="bg-white text-gray-800 font-sans">
      {/* Section 1: Newsletter Signup */}
      {/* <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Join Our World</h2>
          <p className="text-gray-600 mb-6">Get 15% off your first order and stay up-to-date with our latest news and offers.</p>
          <form className="flex flex-col sm:flex-row justify-center items-center gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full sm:w-auto flex-grow px-4 py-3 rounded-md border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div> */}

      {/* Section 2: Main Footer Links */}
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Social */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">TECHNESS</h3>
            <p className="text-gray-600 text-sm mb-4">
              Your one-stop shop for the latest and greatest in tech.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors"><FaFacebookF size={20} /></Link>
              <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors"><FaTwitter size={20} /></Link>
              <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors"><FaInstagram size={20} /></Link>
              <Link href="#" className="text-gray-500 hover:text-blue-600 transition-colors"><FaLinkedinIn size={20} /></Link>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="font-semibold text-gray-800 uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">New Arrivals</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Best Sellers</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Laptops</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Smartphones</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Accessories</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-semibold text-gray-800 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">FAQ</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Shipping & Returns</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Column 4: About Us */}
          <div>
            <h4 className="font-semibold text-gray-800 uppercase tracking-wider mb-4">About Us</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Our Story</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Careers</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: Bottom Bar with Copyright and Payment Icons */}
      <div className="bg-white py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm gap-4">
          <p className="text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} TECHNESS. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 border border-gray-300 rounded-md p-1">
              <FaLock className="text-green-500" />
              <span className="text-gray-600 text-xs font-semibold">SSL SECURED</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
                <FaCcVisa size={28} />
                <FaCcMastercard size={28} />
                <FaCcPaypal size={28} />
                <FaCcAmex size={28} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EcommerceFooter;