export default function CartLoading() {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }