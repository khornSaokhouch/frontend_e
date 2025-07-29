"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaTelegram } from "react-icons/fa";


const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 font-sans pt-12 pb-4">
      {/* Top Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-8"> {/* Aligned items to the top */}
          <h2 className="text-2xl font-semibold text-gray-800 max-w-md">
            Enjoy your shopping with TECHNESS the biggest online market.
          </h2>
          <button className="rounded-full border border-gray-400 text-gray-700 py-2 px-6 hover:bg-gray-100 transition-colors text-sm font-semibold">
            Contact Us
          </button>
        </div>

        <hr className="border-gray-300 mb-8" />

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About TECHNESS */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800 uppercase tracking-wider">
              About TECHNESS
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              TECHNESS is the leading online marketplace where you can buy and
              sell everything from cars, motorcycles, mobile phones, computers,
              electronics, furniture, books, pets, foods, and more. TECHNESS
              connects buyers and sellers across the country, making it easy
              and convenient to find what you need or sell what you don't want.
            </p>
            {/* Social Icons */}
            <div className="flex mt-4 space-x-3">
              <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                <FaFacebook size={20} />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                <FaInstagram size={20} />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                <FaTiktok size={20} />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                <FaTwitter size={20} />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
                <FaTelegram size={20} />
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="block text-xs text-gray-600 hover:text-gray-800 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="block text-xs text-gray-600 hover:text-gray-800 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="block text-xs text-gray-600 hover:text-gray-800 transition-colors">
                  Work
                </Link>
              </li>
              <li>
                <Link href="#" className="block text-xs text-gray-600 hover:text-gray-800 transition-colors">
                  Career
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800 uppercase tracking-wider">
              Help
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-xs text-gray-600 hover:text-gray-800 transition-colors">
                  Customer Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-gray-600 hover:text-gray-800 transition-colors">
                  Delivery Details
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-gray-600 hover:text-gray-800 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-gray-600 hover:text-gray-800 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Useful Information */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800 uppercase tracking-wider">
              Useful Information
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-xs text-gray-600 hover:text-gray-800 transition-colors">
                  Safety Tip
                </Link>
              </li>
              <li>
                <Link href="#" className="text-xs text-gray-600 hover:text-gray-800 transition-colors">
                  Ads Posting Rule
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="bg-black text-white text-center py-4">
        <p className="text-xs">© Copyright Rimel 2022. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;