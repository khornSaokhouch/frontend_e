'use client';

import Navbar from '../../components/Navbar';
import UserSidebar from '../../components/UserSidebar';

export default function ProfileLayout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Sidebar */}
          <UserSidebar />
          
          {/* Main Content (this is where your page content will go) */}
          <main className="md:col-span-9 lg:col-span-9">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}