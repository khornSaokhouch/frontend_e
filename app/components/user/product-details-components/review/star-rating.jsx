"use client"

import React, { useState } from "react"
import { Star } from 'lucide-react'

export const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
const [hoverRating, setHoverRating] = useState(0)

return (
  <div className="flex items-center space-x-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-6 w-6 transition-colors ${!readOnly ? "cursor-pointer" : ""} ${(hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
        onClick={() => !readOnly && onRatingChange?.(star)}
        onMouseEnter={() => !readOnly && setHoverRating(star)}
        onMouseLeave={() => !readOnly && setHoverRating(0)}
        fill={(hoverRating || rating) >= star ? "currentColor" : "none"}
        stroke={(hoverRating || rating) >= star ? "currentColor" : "currentColor"}
      />
    ))}
  </div>
)
}
