// app/admin/companies/components/CompanyPageHeader.jsx
"use client"

import { Search } from "lucide-react"

export function CompanyPageHeader({ search, onSearchChange }) {
  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Management</h1>
          <p className="mt-2 text-gray-600">View and manage all registered companies.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-80 rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-sm bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>
    </div>
  )
}