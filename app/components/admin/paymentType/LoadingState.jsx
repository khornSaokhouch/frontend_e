"use client"

export default function LoadingState({ message = "Loading..." }) {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="text-gray-600 font-medium">{message}</div>
            </div>
        </div>
    );
}