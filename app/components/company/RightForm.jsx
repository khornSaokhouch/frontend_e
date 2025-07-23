"use client";

import { useEffect, useState } from "react";;
import {
  Building,
  Globe,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Save,
  Loader2,
} from "lucide-react";
import Image from "next/image";

const InputField = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled,
  type = "text",
}) => (
  <div className="w-full">
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-700 mb-1"
    >
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <input
        id={name}
        name={name}
        type={type}
        value={type === "file" ? undefined : value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="block w-full rounded-md border border-gray-300 pl-10 py-2 shadow-sm
          focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none
          sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed transition"
        aria-disabled={disabled}
      />
    </div>
  </div>
);

const RightForm = ({
  companyData,
  handleInputChange,
  loading,
  revertChanges,
  isNew,
}) => {
  const [imageSrc, setImageSrc] = useState("/default-avatar.png");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // If company_image is a File object (newly selected)
      if (companyData?.company_image instanceof File) {
        const url = URL.createObjectURL(companyData.company_image);
        setImageSrc(url);

        return () => URL.revokeObjectURL(url); // cleanup on unmount or change
      } else if (companyData?.company_image_url) {
        // Use the absolute URL from API if available
        setImageSrc(companyData.company_image_url);
      } else if (typeof companyData?.company_image === "string") {
        // fallback if no absolute url but relative path exists
        setImageSrc(`/storage/${companyData.company_image}`);
      } else {
        setImageSrc("/default-avatar.png");
      }
    }
  }, [companyData?.company_image, companyData?.company_image_url]);

  const handleFileChange = (e) => {
    handleInputChange(e); // forward event as is for proper processing
  };

  return (
    <div className="lg:col-span-2 max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        {/* Profile Header */}
        <section className="flex flex-col items-center mb-8">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-gray-300 shadow-sm">
            <Image
              src={imageSrc}
              alt={`${companyData?.company_name_url ?? "Company"} Logo`}
              fill
              sizes="112px"
              className="object-cover"
              priority
            />
          </div>

          <label
            htmlFor="company_image"
            className="mt-3 cursor-pointer text-blue-600 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
          >
            Change Company Image
          </label>
          <input
            id="company_image"
            name="company_image"
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={loading}
            onChange={handleFileChange}
          />

          <h4 className="mt-4 text-2xl font-semibold text-gray-900 text-center">
            {companyData?.company_name ?? "Company Name"}
          </h4>
          <p className="text-gray-600 text-center">
            {companyData?.city ?? "City"},{" "}
            {companyData?.country ?? "Country"}
          </p>
        </section>

        {/* Company Information */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-5">
            Company Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              icon={Building}
              label="Company Name"
              name="company_name"
              value={companyData?.company_name ?? ""}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              icon={Globe}
              label="Website URL"
              name="website_url"
              type="url"
              value={companyData?.website_url ?? ""}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
          <label
            htmlFor="description"
            className="mt-6 block text-sm font-semibold text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={companyData?.description ?? ""}
            onChange={handleInputChange}
            disabled={loading}
            className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500
              focus:ring-2 focus:ring-blue-400 focus:outline-none sm:text-sm disabled:bg-gray-100
              disabled:cursor-not-allowed transition"
          />
        </section>

        {/* Location & Hours */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-5">
            Location & Hours
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              icon={MapPin}
              label="Address"
              name="address"
              value={companyData?.address ?? ""}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              icon={MapPin}
              label="City"
              name="city"
              value={companyData?.city ?? ""}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              icon={MapPin}
              label="Country"
              name="country"
              value={companyData?.country ?? ""}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              icon={Clock}
              label="Business Hours"
              name="business_hours"
              value={companyData?.business_hours ?? ""}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
        </section>

        {/* Social Media */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-5">
            Social Media
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              icon={Facebook}
              label="Facebook"
              name="facebook_url"
              type="url"
              value={companyData?.facebook_url ?? ""}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              icon={Instagram}
              label="Instagram"
              name="instagram_url"
              type="url"
              value={companyData?.instagram_url ?? ""}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              icon={Twitter}
              label="Twitter"
              name="twitter_url"
              type="url"
              value={companyData?.twitter_url ?? ""}
              onChange={handleInputChange}
              disabled={loading}
            />
            <InputField
              icon={Linkedin}
              label="LinkedIn"
              name="linkedin_url"
              type="url"
              value={companyData?.linkedin_url ?? ""}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
        </section>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3 border-t pt-6">
          <button
            type="button"
            onClick={revertChanges}
            disabled={loading}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {loading
              ? isNew
                ? "Creating..."
                : "Saving..."
              : isNew
              ? "Create Company"
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightForm;
