"use-client";

import React from "react";
import { PlusCircle, XCircle, Loader2 } from "lucide-react";

export const CategoryCardSkeleton = () => (
  <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg animate-pulse">
    <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>
    <div className="flex-grow h-5 bg-gray-200 rounded"></div>
  </div>
);

export default function CategoryCard({ category, type, onAction, loading }) {
  const isAttach = type === 'attach';
  const ActionIcon = isAttach ? PlusCircle : XCircle;
  const iconColor = isAttach ? 'text-green-500' : 'text-red-500';
  const hoverColor = isAttach ? 'hover:text-green-700' : 'hover:text-red-700';

  return (
    <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:border-indigo-300">
      <img
        src={category.image_url || `https://placehold.co/64x64/E2E8F0/4A5568?text=${category.name.charAt(0)}`}
        alt={category.name}
        className="w-12 h-12 rounded-md object-cover mr-4 flex-shrink-0"
      />
      <span className="flex-grow font-medium text-gray-800 truncate">{category.name}</span>
      <button
        onClick={() => onAction(category.id)}
        disabled={loading}
        aria-label={isAttach ? `Attach ${category.name}` : `Detach ${category.name}`}
        className={`ml-4 p-1 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isAttach ? 'focus:ring-green-500' : 'focus:ring-red-500'}`}
      >
        {loading ? (
          <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
        ) : (
          <ActionIcon className={`w-6 h-6 ${iconColor} ${hoverColor}`} />
        )}
      </button>
    </div>
  );
}