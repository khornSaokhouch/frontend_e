// components/Footer.js
import React from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image component
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 py-8 font-sans shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Exclusive / Subscribe */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-800 tracking-wider uppercase">
            Exclusive
          </h3>
          <p className="text-xs mb-2 text-gray-600">Subscribe</p>
          <p className="text-xxs mb-4 text-gray-600">Get 10% off your first order</p>
          <div className="flex items-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-white border border-gray-300 text-gray-700 py-1.5 px-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-xs"
            />
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1.5 px-3 rounded-r-md transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-800 tracking-wider uppercase">
            Support
          </h3>
          <p className="text-xxs mb-1 leading-5 text-gray-600">
            111 Bijoy sarani, Dhaka,
          </p>
          <p className="text-xxs mb-1 leading-5 text-gray-600">DH 1515, Bangladesh.</p>
          <p className="text-xxs mb-1 leading-5 text-gray-600">exclusive@gmail.com</p>
          <p className="text-xxs mb-1 leading-5 text-gray-600">+88015-88888-9999</p>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-800 tracking-wider uppercase">
            Account
          </h3>
          <Link href="#" className="block text-xxs mb-1 hover:text-gray-500">
            My Account
          </Link>
          <Link href="#" className="block text-xxs mb-1 hover:text-gray-500">
            Login / Register
          </Link>
          <Link href="#" className="block text-xxs mb-1 hover:text-gray-500">
            Cart
          </Link>
          <Link href="#" className="block text-xxs mb-1 hover:text-gray-500">
            Wishlist
          </Link>
          <Link href="#" className="block text-xxs mb-1 hover:text-gray-500">
            Shop
          </Link>
        </div>

        {/* Quick Link */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-800 tracking-wider uppercase">
            Quick Link
          </h3>
          <Link href="#" className="block text-xxs mb-1 hover:text-gray-500">
            Privacy Policy
          </Link>
          <Link href="#" className="block text-xxs mb-1 hover:text-gray-500">
            Terms Of Use
          </Link>
          <Link href="#" className="block text-xxs mb-1 hover:text-gray-500">
            FAQ
          </Link>
          <Link href="#" className="block text-xxs mb-1 hover:text-gray-500">
            Contact
          </Link>
        </div>

        {/* Download App */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-gray-800 tracking-wider uppercase">
            Download App
          </h3>
          <p className="text-xxs mb-1 text-gray-600">Save $3 with App New User Only</p>
          <div className="mb-2">
            {/* Replace with your actual QR code image */}
            <Image src="/imageqr.png" alt="QR Code" width={60} height={60} />
          </div>
          <div className="flex flex-col">
            <a href="#" className="mb-0.5">
              {/* Replace with your actual Google Play store image */}
              <Image
                src="/imagegoogle.png"
                alt="Get it on Google Play"
                width={96}
                height={29}
              />
            </a>
            <a href="#">
              {/* Replace with your actual App Store image */}
              <Image
                src="/imageapp.png"
                alt="Download on the App Store"
                width={96}
                height={29}
              />
            </a>
          </div>
          {/* Social Icons */}
          <div className="flex justify-start mt-3 gap-3">
            <a href="#" className="hover:text-gray-500">
              <FaFacebook size={16} />
            </a>
            <a href="#" className="hover:text-gray-500">
              <FaTwitter size={16} />
            </a>
            <a href="#" className="hover:text-gray-500">
              <FaInstagram size={16} />
            </a>
            <a href="#" className="hover:text-gray-500">
              <FaLinkedin size={16} />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-[0.6rem] mt-6 border-t border-gray-200 pt-3 text-gray-600">
        © Copyright Rimel 2022. All right reserved
      </div>
    </footer>
  );
};

export default Footer;