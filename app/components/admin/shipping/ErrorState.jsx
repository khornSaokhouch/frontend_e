// components/admin/shared/ErrorState.js
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-red-600 bg-red-50 p-4">
      <AlertTriangle className="w-8 h-8 mb-4" />
      <p className="font-semibold mb-1">Error fetching data</p>
      <p className="text-sm text-red-500 mb-6">{message}</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
      >
        <RefreshCw className="-ml-1 mr-2 h-5 w-5" />
        Try Again
      </button>
    </div>
  );
}