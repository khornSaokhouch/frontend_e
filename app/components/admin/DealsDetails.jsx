// components/DealsTable.jsx or components/DealsTable.tsx

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DealsTable = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Calculate start and end index for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  // Get the products for the current page
  const displayedProducts = products.slice(startIndex, endIndex);

  // Determine if there's a next page
  const hasNextPage = endIndex < products.length;

  // Determine if there's a previous page
  const hasPreviousPage = currentPage > 1;

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80">
      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6 border-b border-slate-200/80">
        <h2 className="text-xl font-semibold text-slate-800">
          Deals Details
        </h2>
        <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50">
          October
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold">
            <tr>
              <th scope="col" className="p-4">
                ID
              </th>
              <th scope="col" className="p-4">
                Product Name
              </th>
              <th scope="col" className="p-4">
                Descriptions
              </th>
              <th scope="col" className="p-4">
                Date - Time
              </th>
              <th scope="col" className="p-4">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedProducts.map((product, index) => (
              <tr
                key={product.id}
                className="border-t border-slate-200/80 hover:bg-slate-50/50"
              >
                <td className="p-4 text-slate-600 font-medium">
                  {startIndex + index + 1}
                </td>
                <td className="p-4 font-medium text-slate-800">
                  <div className="flex items-center gap-3">
                    {product.product_image_url ? (
                      <div className="relative w-9 h-9">
                        <Image
                          src={
                            product.product_image_url || "/default_avatar.png"
                          } // Fallback URL if product_image_url is not available
                          alt={product.name}
                          width={36}
                          height={36}
                          style={{ height: "auto", width: "auto" }}
                          className="rounded-md object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-9 h-9 bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400">
                        No Image
                      </div>
                    )}
                    {product.name}
                  </div>
                </td>
                <td className="p-4 text-slate-600">
                  {product.description?.length > 50
                    ? product.description.slice(0, 50) + "..."
                    : product.description || "No description"}
                </td>

                <td className="p-4 text-slate-600">
                  {new Date(product.created_at).toLocaleString()}
                </td>

                <td className="p-4 text-slate-600 font-medium">
                  ${product.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center p-4 space-x-2">
      <span>Page {currentPage}</span>
        <button
          onClick={handlePreviousPage}
          disabled={!hasPreviousPage}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </button>
        
        <button
          onClick={handleNextPage}
          disabled={!hasNextPage}
          className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default DealsTable;