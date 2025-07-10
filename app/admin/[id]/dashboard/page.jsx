'use client';

import { useEffect, useMemo } from 'react';
import { useUserStore } from '../../../store/userStore';
import { useAuthStore } from '../../../store/authStore';
import Link from 'next/link';
import Image from 'next/image';
import { Users, UserPlus, ShoppingCart, DollarSign, Loader2 } from 'lucide-react';

/**
 * A reusable card for displaying key statistics.
 */
const StatCard = ({ icon: Icon, title, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { user: adminUser } = useAuthStore(); // The logged-in admin
  const { users, loading, fetchAllUsers } = useUserStore();

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const getCleanImageUrl = (url) => {
    if (!url) return '/default-avatar.png';
    const lastHttpIndex = url.lastIndexOf('http');
    if (lastHttpIndex > 0) return url.substring(lastHttpIndex);
    return url;
  };
  
  // Calculate total users, excluding admins
  const totalUsers = useMemo(() => users?.filter(u => u.role !== 'admin').length ?? 0, [users]);
  
  // Get the 5 most recent users for the activity feed
  const recentUsers = useMemo(() => {
    if (!users || users.length === 0) return [];
    return users
      .filter(u => u.role !== 'admin')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [users]);


  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Welcome back, {adminUser?.name}!
        </h1>
        <p className="mt-1 text-gray-500">Here's a snapshot of your platform today.</p>
      </div>
      
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} title="Total Users" value={loading ? <Loader2 className="animate-spin w-6 h-6"/> : totalUsers.toLocaleString()} color="purple" />
        {/* <StatCard icon={UserPlus} title="New Signups (30d)" value="12" color="pink" /> 
        <StatCard icon={ShoppingCart} title="Total Orders" value="1,402" color="blue" />
        <StatCard icon={DollarSign} title="Total Revenue" value="$27,830" color="green" /> */}
        {/* Note: The values for Signups, Orders, and Revenue are placeholders. You would fetch this data from your backend. */}
      </div>
      
      {/* Recent Activity Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Registrations</h2>
          <p className="text-sm text-gray-500 mt-1">The latest users to join your platform.</p>
        </div>
        <div className="flow-root">
          <ul role="list" className="divide-y divide-gray-200">
            {loading && !users.length ? (
              // Loading Skeleton
              [...Array(5)].map((_, i) => (
                <li key={i} className="p-4 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </li>
              ))
            ) : recentUsers.length > 0 ? (
              recentUsers.map(user => (
                <li key={user.email} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={getCleanImageUrl(user.profile_image_url)}
                        alt={user.name}
                        width={40} height={40}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="truncate text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div>
                      <Link href={`/admin/${user.id}/users`} className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        View
                      </Link>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              // Empty State
              <li className="p-10 text-center text-gray-500">
                No recent user registrations to display.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}