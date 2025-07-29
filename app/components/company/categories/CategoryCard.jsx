"use client";

import { useState } from "react";
import Image from "next/image";
import { Shapes } from "lucide-react";

export default function CategoryCard({ category }) {
  const [imgSrc, setImgSrc] = useState(category.image_url);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (!imgError) {
      setImgSrc(null);
      setImgError(true);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden group cursor-pointer hover:shadow-lg hover:border-indigo-400 transition-shadow duration-300">
      <div className="relative w-full h-44 bg-slate-50 flex items-center justify-center rounded-t-lg overflow-hidden">
        {imgSrc && !imgError ? (
          <Image
            src={imgSrc}
            alt={category.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
            onError={handleImageError}
            priority
          />
        ) : (
          <Shapes className="w-14 h-14 text-slate-300" />
        )}
      </div>
      <div className="p-4 text-center">
        <h2
          title={category.name}
          className="text-lg font-semibold text-slate-900 truncate"
        >
          {category.name}
        </h2>
      </div>
    </div>
  );
}
