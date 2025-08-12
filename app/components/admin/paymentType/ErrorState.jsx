"use client"

import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorState({ message = "An error occurred", onRetry }) {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-red-600 font-semibold text-lg">Error Loading Data</div>
                <div className="text-gray-600">{message}</div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onRetry}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
                >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                </motion.button>
            </div>
        </div>
    );
}