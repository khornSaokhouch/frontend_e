// /app/components/company/categories/CategoryCardSkeleton.jsx

export default function CategoryCardSkeleton() {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden animate-pulse">
        {/* Image Placeholder */}
        <div className="w-full h-40 bg-slate-200"></div>
        
        {/* Content Placeholder */}
        <div className="p-4">
          <div className="h-5 w-3/4 rounded bg-slate-200 mb-2"></div>
          <div className="h-3 w-full rounded bg-slate-200"></div>
          <div className="h-3 w-1/2 rounded bg-slate-200 mt-1"></div>
        </div>
      </div>
    );
  }