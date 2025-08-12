// app/admin/companies/components/CompanyTable.jsx
"use client"

import { ShieldAlert, Building2 } from "lucide-react"
import { CompanyTableRow } from "./CompanyTableRow"

const LoadingState = () => (
  <tr>
    <td colSpan="4" className="text-center py-12">
      <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
        <div className="animate-spin h-8 w-8 border-2 border-gray-300 border-t-emerald-600 rounded-full"></div>
        <p className="font-medium">Loading companies...</p>
      </div>
    </td>
  </tr>
)

const ErrorState = ({ error }) => (
  <tr>
    <td colSpan="4" className="text-center py-12">
      <div className="flex flex-col items-center justify-center gap-3 text-red-500">
        <ShieldAlert className="w-12 h-12" />
        <div>
          <p className="font-semibold text-lg">Error loading companies</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    </td>
  </tr>
)

const EmptyState = ({ searchTerm }) => (
  <tr>
    <td colSpan="4" className="text-center py-12">
      <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
        <Building2 className="w-12 h-12" />
        <div>
          <p className="font-semibold text-lg">No companies found</p>
          <p className="text-sm">{searchTerm ? "Try adjusting your search" : "No companies have registered yet."}</p>
        </div>
      </div>
    </td>
  </tr>
)

export function CompanyTable({ companies, loading, error, searchTerm, onEdit, onDelete }) {
  const hasCompanies = companies.length > 0
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">All Companies</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Registered</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && <LoadingState />}
            {!loading && error && <ErrorState error={error} />}
            {!loading && !error && !hasCompanies && <EmptyState searchTerm={searchTerm} />}
            {!loading && !error && hasCompanies && companies.map((company, index) => (
              <CompanyTableRow key={company.id} company={company} index={index} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}