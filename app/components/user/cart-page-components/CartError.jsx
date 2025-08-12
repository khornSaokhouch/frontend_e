import { Frown } from "lucide-react";

export default function CartError({ error }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8 bg-white shadow-lg rounded-xl">
        <Frown className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-red-800">Something Went Wrong</h3>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    </div>
  );
}