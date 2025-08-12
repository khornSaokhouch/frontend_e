"use client"

import { motion } from "framer-motion";
import { Plus, Wallet } from "lucide-react";

export default function EmptyState({ onAddClick, hasSearchTerm }) {
    return (
        <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payment Types Found</h3>
            <p className="text-gray-600 mb-6">
                {hasSearchTerm ? "Try adjusting your search terms" : "Get started by adding your first payment type"}
            </p>
            {!hasSearchTerm && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onAddClick}
                    className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
                >
                    <Plus className="w-4 h-4" />
                    Add Payment Type
                </motion.button>
            )}
        </div>
    );
}