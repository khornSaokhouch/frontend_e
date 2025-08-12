// components/admin/shared/LoadingState.js
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
      <Loader2 className="w-8 h-8 animate-spin mb-4" />
      <p>{message}</p>
    </div>
  );
}