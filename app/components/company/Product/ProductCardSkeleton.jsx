export default function ProductCardSkeleton() {
    return (
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden animate-pulse">
        <div className="w-full h-40 bg-slate-200"></div>
        <div className="p-4">
          <div className="h-5 w-3/4 rounded bg-slate-200 mb-2"></div>
          <div className="h-3 w-full rounded bg-slate-200 mb-1"></div>
          <div className="h-3 w-1/2 rounded bg-slate-200"></div>
          <div className="h-6 w-1/4 rounded-full bg-slate-200 my-4"></div>
          <div className="flex justify-end">
            <div className="h-8 w-20 rounded bg-slate-200"></div>
          </div>
        </div>
      </div>
    );
  }