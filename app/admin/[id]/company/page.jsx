"use client";
import React, { useEffect } from "react";
import { useCompanyStore } from "../../../store/useCompanyStore";

export default function SellersPage() {
  const { companies, loading, error, fetchCompanies } = useCompanyStore();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Sellers</h1>

      {loading && (
        <div className="text-center text-gray-500 py-6">Loading sellers...</div>
      )}

      {error && (
        <div className="text-center text-red-600 py-6">Error: {error}</div>
      )}

      {!loading && !error && companies.length === 0 && (
        <div className="text-center text-gray-500 py-6">No sellers found.</div>
      )}

      {!loading && !error && companies.length > 0 && (
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b border-gray-300">Name</th>
              <th className="p-3 border-b border-gray-300">Company Name</th>
              <th className="p-3 border-b border-gray-300">Email</th>
              <th className="p-3 border-b border-gray-300">Phone</th>
              <th className="p-3 border-b border-gray-300">Country/Region</th>
              <th className="p-3 border-b border-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((seller) => (
              <tr key={seller.id} className="hover:bg-gray-50">
                <td className="p-3 border-b border-gray-200">{seller.name}</td>
                <td className="p-3 border-b border-gray-200">{seller.company_name}</td>
                <td className="p-3 border-b border-gray-200">{seller.email}</td>
                <td className="p-3 border-b border-gray-200">{seller.phone_number}</td>
                <td className="p-3 border-b border-gray-200">{seller.country_region}</td>
                <td className="p-3 border-b border-gray-200 capitalize">{seller.status || "pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
