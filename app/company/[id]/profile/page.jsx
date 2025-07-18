'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
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
  UploadCloud,
  Loader2,
  AlertCircle,
} from 'lucide-react';

import { useCompanyInfoStore } from '../../../store/useCompanyInfoStore';

// Input field component with flexible input type
const InputField = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled,
  type = 'text',
}) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  </div>
);

// Format date helper
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export default function CompanyProfilePage() {
  const { id } = useParams();

  const {
    companyData,
    loading,
    error,
    fetchCompanyInfo,
    setFieldValue,
    saveCompanyInfo,
    revertChanges,
  } = useCompanyInfoStore();

  useEffect(() => {
    fetchCompanyInfo(id);
  }, [id]);

  const isNew = !companyData?.id;

  const handleInputChange = (e, pathOverride = null) => {
    const path = pathOverride || e.target.name;
    const value = e.target.value;
    setFieldValue(path, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveCompanyInfo();
  };

  if (loading && !companyData) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <span className="ml-3 text-gray-500">Loading Company Profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          <div>
            <p className="font-bold">An Error Occurred</p>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!companyData) {
    return (
      <div className="text-center text-gray-500 py-10">
        <p>Company data could not be loaded.</p>
        <p className="text-sm">Please check the company ID or try again later.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-xl font-bold mb-4">{isNew ? 'Add New Company' : 'Edit Company'}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <Image
                src={companyData.company_image || '/default-company-logo.png'}
                alt={`${companyData.company_name} Logo`}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{companyData.company_name}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {companyData.location?.city}, {companyData.location?.country}
            </p>
            <button
              type="button"
              className="mt-4 w-full flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              <UploadCloud className="w-4 h-4" /> Change Photo
            </button>
          </div>

          {!isNew && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-3 mb-4">About Company</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {companyData.description || 'No description provided.'}
              </p>
              <div className="mt-6 text-xs text-gray-400 space-y-2">
                <p>Created: {formatDate(companyData.created_at)}</p>
                <p>Updated: {formatDate(companyData.updated_at)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="space-y-8">
              {/* Company Info */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <InputField
                    icon={Building}
                    label="Company Name"
                    name="company_name"
                    value={companyData.company_name}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <InputField
                    icon={Globe}
                    label="Website URL"
                    name="website_url"
                    value={companyData.website_url}
                    onChange={handleInputChange}
                    disabled={loading}
                    type="url"
                  />
                </div>
                <div className="mt-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={companyData.description}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100"
                  />
                </div>
              </section>

              {/* Location & Hours */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900">Location & Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <InputField
                    icon={MapPin}
                    label="Address"
                    name="location.address"
                    value={companyData.location?.address}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <InputField
                    icon={MapPin}
                    label="City"
                    name="location.city"
                    value={companyData.location?.city}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <InputField
                    icon={MapPin}
                    label="Country"
                    name="location.country"
                    value={companyData.location?.country}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  <InputField
                    icon={Clock}
                    label="Business Hours"
                    name="business_hours"
                    value={companyData.business_hours}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </section>

              {/* Social Media */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900">Social Media</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <InputField
                    icon={Facebook}
                    label="Facebook"
                    name="social_links.facebook"
                    value={companyData.social_links?.facebook}
                    onChange={handleInputChange}
                    disabled={loading}
                    type="url"
                  />
                  <InputField
                    icon={Instagram}
                    label="Instagram"
                    name="social_links.instagram"
                    value={companyData.social_links?.instagram}
                    onChange={handleInputChange}
                    disabled={loading}
                    type="url"
                  />
                  <InputField
                    icon={Twitter}
                    label="Twitter"
                    name="social_links.twitter"
                    value={companyData.social_links?.twitter}
                    onChange={handleInputChange}
                    disabled={loading}
                    type="url"
                  />
                  <InputField
                    icon={Linkedin}
                    label="LinkedIn"
                    name="social_links.linkedin"
                    value={companyData.social_links?.linkedin}
                    onChange={handleInputChange}
                    disabled={loading}
                    type="url"
                  />
                </div>
              </section>
            </div>

            {/* Buttons */}
            <div className="mt-8 pt-6 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={revertChanges}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {loading ? (isNew ? 'Creating...' : 'Saving...') : (isNew ? 'Create Company' : 'Save Changes')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
