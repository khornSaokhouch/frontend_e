"use client";
import React, { useState, useEffect, useRef } from "react";
// FIXED: Import correct icon names from lucide-react
import {
  User,
  Mail,
  Phone,
  Building2, // Correct replacement for HiBuildingOffice2
  MapPin,
  Globe,
} from "lucide-react";
import { useSellerStore } from "../../store/useSellerStore"; // Adjust path as needed

// List of 24 Provinces/Cities in Cambodia
const cambodianProvinces = [
  "Phnom Penh",
  "Banteay Meanchey",
  "Battambang",
  "Kampong Cham",
  "Kampong Chhnang",
  "Kampong Speu",
  "Kampong Thom",
  "Kampot",
  "Kandal",
  "Kep",
  "Koh Kong",
  "Kratié",
  "Mondulkiri",
  "Oddar Meanchey",
  "Pailin",
  "Preah Sihanouk",
  "Preah Vihear",
  "Prey Veng",
  "Pursat",
  "Ratanakiri",
  "Siem Reap",
  "Stung Treng",
  "Svay Rieng",
  "Takéo",
  "Tboung Khmum",
];

export default function BecomeCompanyForm() {
  const { form, loading, error, success, handleChange, submitForm } =
    useSellerStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredProvinces = form.countryRegion
    ? cambodianProvinces.filter((province) =>
        province.toLowerCase().includes(form.countryRegion.toLowerCase())
      )
    : cambodianProvinces;

  const handleProvinceSelect = (province) => {
    const syntheticEvent = {
      target: { name: "countryRegion", value: province },
    };
    handleChange(syntheticEvent);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full mx-auto p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Register Your Company
          </h2>
          <p className="text-gray-500 mt-2">
            Fill out the form below to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700"
              >
                <User className="text-gray-500 w-4 h-4" /> {/* FIXED */}
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" /> {/* FIXED */}
                </div>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700"
              >
                <Building2 className="text-gray-500 w-4 h-4" /> {/* FIXED */}
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" /> {/* FIXED */}
                </div>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Creative Inc."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700"
              >
                <Mail className="text-gray-500 w-4 h-4" /> {/* FIXED */}
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" /> {/* FIXED */}
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700"
              >
                <Phone className="text-gray-500 w-4 h-4" /> {/* FIXED */}
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" /> {/* FIXED */}
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  id="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label
              htmlFor="streetAddress"
              className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700"
            >
              <MapPin className="text-gray-500 w-4 h-4" /> {/* FIXED */}
              Street Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" /> {/* FIXED */}
              </div>
              <input
                type="text"
                name="streetAddress"
                id="streetAddress"
                value={form.streetAddress}
                onChange={handleChange}
                placeholder="123 Innovation Drive"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Province/City Searchable Dropdown */}
          <div>
            <label
              htmlFor="countryRegion"
              className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700"
            >
              <Globe className="text-gray-500 w-4 h-4" /> {/* FIXED */}
              Province / City <span className="text-red-500">*</span>
            </label>
            <div className="relative" ref={dropdownRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" /> {/* FIXED */}
              </div>
              <input
                type="text"
                name="countryRegion"
                id="countryRegion"
                value={form.countryRegion}
                onChange={(e) => {
                  handleChange(e);
                  if (!isDropdownOpen) setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                required
                placeholder="Search or select a province"
                autoComplete="off"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />

              {isDropdownOpen && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredProvinces.length > 0 ? (
                    filteredProvinces.map((province) => (
                      <li
                        key={province}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleProvinceSelect(province)}
                      >
                        {province}
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-2 text-sm text-gray-500">
                      No results found
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div
              className="flex items-center p-4 text-sm text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              <svg
                className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"
              ><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
              {error}
            </div>
          )}
          {success && (
            <div
              className="flex items-center p-4 text-sm text-green-700 bg-green-100 rounded-lg"
              role="alert"
            >
              <svg
                className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"
              ><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
              {success}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 ease-in-out
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-1"
              }`}
            >
              {loading ? "Submitting..." : "Submit Registration"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}