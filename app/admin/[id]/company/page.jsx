'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../../store/userStore';

export default function CompanyListPage() {
  const router = useRouter();
  const { user, fetchUser, users, fetchAllUsers, loading, error } = useUserStore();

  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    async function init() {
      const currentUser = await fetchUser();

      if (!currentUser) {
        router.push('/login'); // Redirect to login if no user
        return;
      }

      if (currentUser.role === 'admin') {
        setAuthorized(true);
        await fetchAllUsers();
      } else {
        setAuthorized(false);
      }

      setCheckingAuth(false);
    }
    init();
  }, [fetchUser, fetchAllUsers, router]);

  if (checkingAuth || loading) {
    return <div className="p-6 text-indigo-600 font-medium">Loading...</div>;
  }

  if (!authorized) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        Access Denied: You do not have permission to view this page.
      </div>
    );
  }

  // Filter companies from all users
  const companies = users.filter((u) => u.role === 'company');

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Companies List</h1>

      {error && <p className="text-red-600">{error}</p>}

      {companies.length === 0 ? (
        <p className="text-gray-600">No companies found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-sm border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase font-medium">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Profile Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {companies.map((company, index) => (
                <tr key={company.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    {company.profile_image_url ? (
                      <img
                        src={company.profile_image_url}
                        alt={company.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <div className="h-12 w-12 flex items-center justify-center bg-slate-100 text-slate-400 text-xs rounded">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{company.name}</td>
                  <td className="px-4 py-3">{company.email}</td>
                  <td className="px-4 py-3 capitalize">{company.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
