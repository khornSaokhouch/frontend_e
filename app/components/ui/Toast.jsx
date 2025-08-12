"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react"

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { id, ...toast }
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, toast.duration || 5000)

    return id
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const success = (message, options = {}) => {
    return addToast({
      type: "success",
      message,
      ...options,
    })
  }

  const error = (message, options = {}) => {
    return addToast({
      type: "error",
      message,
      ...options,
    })
  }

  const warning = (message, options = {}) => {
    return addToast({
      type: "warning",
      message,
      ...options,
    })
  }

  const info = (message, options = {}) => {
    return addToast({
      type: "info",
      message,
      ...options,
    })
  }

  return {
    toasts,
    success,
    error,
    warning,
    info,
    removeToast,
  }
}

const Toast = ({ toast, onRemove }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const colors = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      text: "text-green-800",
      progress: "bg-green-500",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      text: "text-red-800",
      progress: "bg-red-500",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "text-yellow-600",
      text: "text-yellow-800",
      progress: "bg-yellow-500",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      text: "text-blue-800",
      progress: "bg-blue-500",
    },
  }

  const Icon = icons[toast.type]
  const colorScheme = colors[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`relative overflow-hidden rounded-2xl border ${colorScheme.bg} ${colorScheme.border} p-4 shadow-lg backdrop-blur-sm max-w-md w-full`}
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${colorScheme.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          {toast.title && <p className={`text-sm font-semibold ${colorScheme.text} mb-1`}>{toast.title}</p>}
          <p className={`text-sm ${colorScheme.text}`}>{toast.message}</p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className={`flex-shrink-0 ${colorScheme.icon} hover:opacity-70 transition-opacity`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: (toast.duration || 5000) / 1000, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-1 ${colorScheme.progress}`}
      />
    </motion.div>
  )
}

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
