// File: app/profile/[id]/layout.js (or your path)
'use client';

import Navbar from '../../components/Navbar';
import UserSidebar from '../../components/UserSidebar';

export default function ProfileLayout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/*
          The layout is now a single flex container. 
          On mobile, it's a column. On desktop, it's a row.
        */}
        <div className="flex flex-col lg:flex-row lg:gap-8">
          
          {/* Sidebar (with responsive width) */}
          <UserSidebar />
          
          {/* Main Content (takes up remaining space) */}
          <main className="flex-1 w-full mt-8 lg:mt-0">
            {/* The white card for the content area */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm min-h-[500px]">
              {children}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}