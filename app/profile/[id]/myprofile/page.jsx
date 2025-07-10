'use client';

import { useEffect } from 'react';
import { useUserStore } from '../../../store/userStore';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function MyProfilePage() {
  const { id } = useParams();
  const { user, loading, error, fetchUserById } = useUserStore();

  // The user data is already being fetched by the sidebar,
  // but fetching it here ensures this component is self-contained.
  useEffect(() => {
    if (id) {
      fetchUserById(id);
    }
  }, [id, fetchUserById]);

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
      </div>
    );
  }
  
  if (error || !user) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg">
          <p className="text-red-500">Could not load profile information.</p>
      </div>
    )
  }

  return (
    // This is the main content that will be displayed to the right of the sidebar
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Account Overview</h1>
      <p className="text-gray-600 mb-8">
        Welcome back, {user.name}! Here you can find your recent activity and manage your account details.
      </p>
      
      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-gray-700 mb-2">Personal Information</h3>
            <p className="text-sm text-gray-600">
              <strong>Name:</strong> {user.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Email:</strong> {user.email}
            </p>
            <Link href={`/profile/${id}/edit`} className="text-purple-600 hover:underline text-sm font-semibold mt-4 inline-block">
              Edit Details →
            </Link>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold text-gray-700 mb-2">Recent Order</h3>
            <p className="text-sm text-gray-600">You have no recent orders.</p>
            <Link href="/orders" className="text-purple--600 hover:underline text-sm font-semibold mt-4 inline-block">
              View All Orders →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}