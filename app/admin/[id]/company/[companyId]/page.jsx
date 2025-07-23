'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useCompanyInfoStore } from '../../../../store/useCompanyInfoStore';

export default function CompaniesInfoTable() {
  const { companies, fetchCompanies, loading, error } = useCompanyInfoStore();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  function getDomain(url) {
    try {
      const { hostname } = new URL(url);
      return hostname.replace('www.', ''); // remove www for cleaner look
    } catch {
      return url; // fallback if invalid URL
    }
  }
  

  if (loading) return <div className="p-6 text-indigo-600 font-medium">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 space-y-6 max-w-full overflow-x-auto">
      <h1 className="text-3xl font-extrabold text-slate-900 mb-4">Companies Info</h1>
      <table className="w-full min-w-[800px] border-collapse border border-slate-300 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-indigo-50 text-indigo-700 uppercase font-semibold text-sm tracking-wide">
          <tr>
            <th className="px-5 py-3 text-center">#</th>
            <th className="px-5 py-3 text-left">Company</th>
            <th className="px-5 py-3 text-left max-w-[250px]">Description</th>
            <th className="px-5 py-3 text-left">Website</th>
            <th className="px-5 py-3 text-left">Business Hours</th>
            <th className="px-5 py-3 text-left">Social</th>
            <th className="px-5 py-3 text-left">Address</th>
            <th className="px-5 py-3 text-left">City</th>
            <th className="px-5 py-3 text-left">Country</th>
          </tr>
        </thead>
        <tbody className="bg-white text-slate-800 text-sm">
          {companies.map((company, idx) => (
            <tr
              key={company.id}
              className="hover:bg-indigo-50 transition-colors duration-150 cursor-pointer"
            >
              <td className="px-5 py-3 text-center font-medium">{idx + 1}</td>
              <td className="px-5 py-3 flex items-center gap-3">
                {company.company_image_url ? (
                  <Image
                    src={company.company_image_url}
                    alt={company.company_name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover border border-slate-300"
                  />
                ) : (
                  <div className="w-10 h-10 bg-slate-200 flex items-center justify-center text-xs text-slate-500 rounded-md">
                    No Image
                  </div>
                )}
                <span className="font-semibold">{company.company_name}</span>
              </td>
              <td className="px-5 py-3 max-w-[250px] truncate" title={company.description}>
                {company.description}
              </td>
              <td className="px-5 py-3">
  {company.website_url ? (
    <a
      href={company.website_url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-600 hover:underline"
      title={company.website_url}  // Full URL on hover tooltip
    >
      {getDomain(company.website_url)}
    </a>
  ) : (
    '-'
  )}
</td>

              <td className="px-5 py-3 whitespace-nowrap">{company.business_hours || '-'}</td>
              <td className="px-5 py-3 space-y-1">
                {company.facebook_url && (
                  <a
                    href={company.facebook_url}
                    target="_blank"
                    className="block text-blue-600 hover:underline"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                )}
                {company.instagram_url && (
                  <a
                    href={company.instagram_url}
                    target="_blank"
                    className="block text-pink-600 hover:underline"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                )}
                {company.twitter_url && (
                  <a
                    href={company.twitter_url}
                    target="_blank"
                    className="block text-blue-400 hover:underline"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </a>
                )}
                {company.linkedin_url && (
                  <a
                    href={company.linkedin_url}
                    target="_blank"
                    className="block text-indigo-700 hover:underline"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                )}
                {!company.facebook_url &&
                  !company.instagram_url &&
                  !company.twitter_url &&
                  !company.linkedin_url && <span className="text-slate-400">No social links</span>}
              </td>
              <td className="px-5 py-3 max-w-[180px] truncate" title={company.address}>
                {company.address || '-'}
              </td>
              <td className="px-5 py-3 whitespace-nowrap">{company.city || '-'}</td>
              <td className="px-5 py-3 whitespace-nowrap">{company.country || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
