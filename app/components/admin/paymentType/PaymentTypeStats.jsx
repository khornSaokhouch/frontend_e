"use client"

import { motion } from "framer-motion"
import { Wallet, CreditCard } from "lucide-react"

const stats = [
  {
    label: "Total Payment Types",
    icon: Wallet,
    color: "green",
    change: "+12%", // Note: This can be made dynamic if you have historical data
  },
  {
    label: "Active Methods",
    icon: CreditCard,
    color: "blue",
    change: "+8%",
  },
]

export default function PaymentTypeStats({ paymentTypes }) {
  const getStatValue = (label) => {
    // This logic can be expanded as your data model grows
    switch (label) {
      case "Total Payment Types":
      case "Active Methods":
        return paymentTypes.length
      default:
        return 0
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-2xl p-6 border border-gray-200/50 shadow-sm cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{getStatValue(stat.label)}</p>
              <p className={`text-sm text-${stat.color}-600 mt-1`}>{stat.change} from last month</p>
            </div>
            <div className={`w-12 h-12 bg-${stat.color}-100 rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}