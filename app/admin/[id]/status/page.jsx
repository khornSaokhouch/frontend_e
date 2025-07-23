"use client";
import React, { useEffect } from "react";
import { useCompanyStore } from "../../../store/useCompanyStore";

export default function SellersPage() {
  const { companies, loading, error, fetchCompanies } = useCompanyStore();

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">All Sellers</h1>

      {loading && (
        <div className="text-center text-indigo-600 py-6">Loading sellers...</div>
      )}

      {error && (
        <div className="text-center text-red-600 py-6">Error: {error}</div>
      )}

      {!loading && !error && companies.length === 0 && (
        <div className="text-center text-slate-500 py-6">No sellers found.</div>
      )}

      {!loading && !error && companies.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow border border-slate-200 bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-medium">
              <tr>
                <th className="px-4 py-3 border-b">#</th>
                <th className="px-4 py-3 border-b">Name</th>
                <th className="px-4 py-3 border-b">Company</th>
                <th className="px-4 py-3 border-b">Email</th>
                <th className="px-4 py-3 border-b">Phone</th>
                <th className="px-4 py-3 border-b">Region</th>
                <th className="px-4 py-3 border-b">Status</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 divide-y divide-slate-100">
              {companies.map((seller, index) => (
                <tr key={seller.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-500 font-semibold">{index + 1}</td>
                  <td className="px-4 py-3">{seller.name}</td>
                  <td className="px-4 py-3">{seller.company_name}</td>
                  <td className="px-4 py-3">{seller.email}</td>
                  <td className="px-4 py-3">{seller.phone_number}</td>
                  <td className="px-4 py-3">{seller.country_region}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        seller.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : seller.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {seller.status || "pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
