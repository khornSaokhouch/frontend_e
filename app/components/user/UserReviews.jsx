"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useReviewStore } from "../../store/useReviewStore" // adjust path as needed
import { toast } from "react-hot-toast"
import { Edit, Trash2, User, MessageSquare } from "lucide-react"
import { StarRating } from "../user/product-details-components/review/star-rating"
import { ConfirmationModal } from "../user/product-details-components/review/confirmation-modal"
import { formatDistanceToNow } from "date-fns"

// A simple component to show an alert to non-logged-in users.
const LoginPrompt = () => (
  <div className="my-8 rounded-md border border-slate-300 bg-slate-50 p-4">
    <div className="flex">
      <div className="flex-shrink-0">
        <User className="h-5 w-5 text-slate-500" aria-hidden="true" />
      </div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-slate-800">
          Join the conversation
        </h3>
        <div className="mt-2 text-sm text-slate-700">
          <p>
            You must be logged in to leave a review.
            {/* You can add a <Link> component here to your login page */}
          </p>
        </div>
      </div>
    </div>
  </div>
)

const REVIEW_LIMIT = 5;

export default function ProductReviews({ productId, userId }) {
  const { reviews, loading, error, fetchReviews, createReview, updateReview, deleteReview } =
    useReviewStore()

  // State for adding a new review
  const [newReviewText, setNewReviewText] = useState("")
  const [newRating, setNewRating] = useState(5)

  // State for editing an existing review
  const [editingReviewId, setEditingReviewId] = useState(null)
  const [editingReviewText, setEditingReviewText] = useState("")
  const [editingRating, setEditingRating] = useState(5)

  // State for the delete confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [reviewToDeleteId, setReviewToDeleteId] = useState(null)

  // State to control showing all reviews
  const [showAllReviews, setShowAllReviews] = useState(false);


  useEffect(() => {
    if (productId) {
      fetchReviews(null, productId)
    }
  }, [productId, fetchReviews])

  // Memoize sorted reviews to prevent re-sorting on every render
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }, [reviews])

  // Memoize the list of reviews to display (either all or a slice)
  const reviewsToShow = useMemo(() => {
    if (showAllReviews) {
      return sortedReviews;
    }
    return sortedReviews.slice(0, REVIEW_LIMIT);
  }, [sortedReviews, showAllReviews])


  const handleAddReview = async (e) => {
    e.preventDefault()
    if (!newReviewText.trim()) {
      return toast.error("Please write a review before submitting.")
    }
    try {
      await createReview({
        user_id: userId,
        product_id: productId,
        review_text: newReviewText.trim(),
        rating: newRating,
      })
      toast.success("Review added successfully!")
      setNewReviewText("")
      setNewRating(5)
    } catch (err) {
      toast.error(err.message || "Failed to add review.")
    }
  }

  const startEdit = (review) => {
    setEditingReviewId(review.id)
    setEditingReviewText(review.review_text || "")
    setEditingRating(review.rating || 5)
  }

  const cancelEdit = () => {
    setEditingReviewId(null)
  }

  const saveEdit = async (id) => {
    if (!editingReviewText.trim()) {
      return toast.error("Review text cannot be empty.")
    }
    try {
      await updateReview(id, { review_text: editingReviewText.trim(), rating: editingRating })
      toast.success("Review updated!")
      cancelEdit()
    } catch (err) {
      toast.error(err.message || "Failed to update review.")
    }
  }

  const openDeleteConfirm = (id) => {
    setReviewToDeleteId(id)
    setIsConfirmModalOpen(true)
  }

  const closeDeleteConfirm = () => {
    setReviewToDeleteId(null)
    setIsConfirmModalOpen(false)
  }

  const handleConfirmDelete = async () => {
    if (!reviewToDeleteId) return
    try {
      await deleteReview(reviewToDeleteId)
      toast.success("Review deleted!")
    } catch (err) {
      toast.error(err.message || "Failed to delete review.")
    } finally {
      closeDeleteConfirm()
    }
  }

  return (
    <>
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
      >
        Are you sure you want to permanently delete this review? This action cannot be undone.
      </ConfirmationModal>

      <div className="w-full max-w-8xl mx-auto bg-white p-6 sm:p-8 my-8 font-sans">
        {/* --- REVERTED HEADER UI --- */}
        <h3 className="text-3xl font-bold text-gray-900 mb-8">
          Customer Reviews ({reviews.length})
        </h3>
        
        {/* --- LOGIN CHECK & REVIEW FORM --- */}
        {userId ? (
          <div className="bg-slate-50 p-6 rounded-lg mb-10 border border-slate-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Leave a Review</h3>
            <div className="mb-4">
              <StarRating rating={newRating} onRatingChange={setNewRating} />
            </div>
            <textarea
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              rows={4}
              placeholder="Share your thoughts..."
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-base"
            />
            <button
              onClick={handleAddReview}
              disabled={loading}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {loading ? "Posting..." : "Post Review"}
            </button>
          </div>
        ) : (
          <LoginPrompt />
        )}

        {/* --- LOADING, ERROR, AND EMPTY STATES --- */}
        {loading && reviews.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500">Loading reviews...</p>
          </div>
        )}
        {error && (
            <div className="text-center py-16">
                <p className="text-red-600">Error: {error}</p>
            </div>
        )}
        {sortedReviews.length === 0 && !loading && !error && (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No reviews yet</h3>
            <p className="mt-1 text-base text-gray-500">Be the first to share your thoughts!</p>
          </div>
        )}

        {/* --- REVIEW LIST (NOW USES `reviewsToShow`) --- */}
        <div className="space-y-8 divide-y divide-gray-200">
          {reviewsToShow.map((review) => {
            const isUserReview = String(review.user_id) === String(userId)
            const isEditing = editingReviewId === review.id

            const userInitial = review.user?.name
              ? review.user.name.split(" ").map((n) => n[0]).join("").toUpperCase()
              : "A"

            return (
              <article key={review.id} className="pt-8 first:pt-0">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                   <div className="flex-shrink-0">
                    {review.user?.profile_image_url ? (
                        <img
                        className="h-11 w-11 rounded-full object-cover ring-1 ring-gray-200"
                        src={review.user.profile_image_url}
                        alt=""
                        />
                    ) : (
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-lg font-semibold text-gray-600">
                        {userInitial}
                        </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      // --- EDITING VIEW ---
                      <div>
                        <StarRating rating={editingRating} onRatingChange={setEditingRating} />
                        <textarea
                          value={editingReviewText}
                          onChange={(e) => setEditingReviewText(e.target.value)}
                          rows={4}
                          className="w-full mt-3 p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="mt-3 flex items-center space-x-3">
                          <button
                            onClick={() => saveEdit(review.id)}
                            className="px-4 py-1.5 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-4 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // --- DISPLAY VIEW ---
                      <div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-base font-semibold text-gray-900">
                              {review.user?.name || "Anonymous User"}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <StarRating rating={review.rating} readOnly={true} starSize="h-4 w-4" />
                               <p className="text-sm text-gray-500">
                                · {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                               </p>
                            </div>
                          </div>

                          {isUserReview && (
                            <div className="flex items-center space-x-0.5 flex-shrink-0 ml-4">
                              <button
                                onClick={() => startEdit(review)}
                                title="Edit review"
                                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-indigo-600 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteConfirm(review.id)}
                                title="Delete review"
                                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4 space-y-4 text-base text-gray-700 leading-relaxed">
                            <p>{review.review_text}</p>
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* --- VIEW ALL BUTTON --- */}
        {sortedReviews.length > REVIEW_LIMIT && !showAllReviews && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAllReviews(true)}
              className="px-6 py-2.5 font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View All {reviews.length} Reviews
            </button>
          </div>
        )}
      </div>
    </>
  )
}