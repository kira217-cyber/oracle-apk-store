// RatingsAndReviews.jsx - Final Version with Single User Fetch Fallback
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  FaArrowRight,
  FaEllipsisV,
  FaMobileAlt,
  FaStar,
  FaTabletAlt,
  FaUserCircle,
} from "react-icons/fa";
import axios from "axios";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from "@tanstack/react-query";
import { toast } from "react-toastify";

const API_BASE = `${import.meta.env.VITE_API_URL}`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Fetch all reviews for the app (backend populates userId minimally or as ObjectId)
const fetchReviews = async (appId) => {
  const { data } = await axios.get(`${API_BASE}/api/reviews/${appId}`);
  return data;
};

// Fetch single user by ID (your existing route: GET /api/users/:id)
const fetchUser = async (userId) => {
  if (!userId) return null;
  const { data } = await axios.get(`${API_BASE}/api/users/${userId}`);
  return data.user; // { id, name, email, ... }
};

const StarRatingInput = ({ rating, setRating }) => {
  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`text-3xl cursor-pointer transition-colors duration-200 ${
            rating >= star ? "text-[#FFD700]" : "text-gray-300"
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
};

const ReviewItem = ({ review, userData }) => {
  const queryClient = useQueryClient();

  const updateHelpful = useMutation({
    mutationFn: (id) => axios.patch(`${API_BASE}/api/reviews/${id}/helpful`),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", review.appId]);
      toast.success("Thank you for your feedback!");
    },
    onError: () => {
      toast.error("Failed to mark as helpful");
    },
  });

  // Determine display name - priority: fetched user > review.userId object > fallback
  let userName = "Anonymous User";

  if (userData) {
    // From fetchUser API call
    if (userData.name && userData.name.trim()) {
      userName = userData.name.trim();
    } else if (userData.email) {
      userName = userData.email.split("@")[0];
    }
  } else if (review.userId && typeof review.userId === "object") {
    // If backend already populated some fields
    if (review.userId.name && review.userId.name.trim()) {
      userName = review.userId.name.trim();
    } else if (review.userId.email) {
      userName = review.userId.email.split("@")[0];
    }
  }

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-3xl text-gray-400 flex-shrink-0" />
          <div>
            {/* This will now show real name (e.g., "Hablu Ali") */}
            <p className="text-sm font-medium text-gray-800">{userName}</p>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-sm ${
                    i < review.rating ? "text-green-600" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 ml-2">
                {formatDate(review.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <FaEllipsisV className="text-gray-500 text-sm cursor-pointer hover:text-gray-700 transition" />
      </div>

      {review.comment && (
        <p className="text-sm text-gray-700 mt-3 leading-relaxed">
          {review.comment}
        </p>
      )}

      <p className="text-xs text-gray-500 mt-3">
        {review.helpful || 0} people found this review helpful
      </p>

      <div className="flex items-center gap-3 mt-3">
        <span className="text-sm text-gray-600">
          Did you find this helpful?
        </span>
        <button
          onClick={() => updateHelpful.mutate(review._id)}
          className="border px-4 py-1.5 rounded-full text-sm cursor-pointer hover:bg-green-50 transition"
        >
          Yes
        </button>
        <button className="border px-4 py-1.5 rounded-full text-sm cursor-pointer hover:bg-red-50 transition">
          No
        </button>
      </div>
    </div>
  );
};

const RatingsAndReviews = ({ appId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  // Main query: fetch reviews + stats
  const {
    data: reviewData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews", appId],
    queryFn: () => fetchReviews(appId),
    enabled: !!appId,
  });

  // Extract unique userIds from reviews (only if userId is string/ObjectId)
  const userIds =
    reviewData?.reviews
      ?.map((rev) =>
        typeof rev.userId === "string" ? rev.userId : rev.userId?._id
      )
      .filter(Boolean) || [];

  // Parallel fetch all needed users (only if not already populated as object)
  const userQueries = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ["user", id],
      queryFn: () => fetchUser(id),
      enabled: !!id && reviewData?.reviews?.length > 0,
      staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    })),
  });

  // Create map: userId → user data
  const userMap = {};
  userQueries.forEach((query, index) => {
    if (query.data) {
      userMap[userIds[index]] = query.data;
    }
  });

  const createReview = useMutation({
    mutationFn: (newReview) => axios.post(`${API_BASE}/api/reviews`, newReview),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", appId]);
      toast.success("Review submitted successfully!");
      setModalOpen(false);
      setNewRating(0);
      setNewComment("");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Failed to submit review. Try again."
      );
    },
  });

  const handleSubmit = () => {
    if (!user) {
      toast.warn("Please login to submit a review");
      return;
    }
    if (newRating === 0) {
      toast.warn("Please select a star rating");
      return;
    }

    createReview.mutate({
      appId,
      userId: user.id || user._id,
      rating: newRating,
      comment: newComment.trim() || null,
    });
  };

  if (isLoading)
    return (
      <div className="py-12 text-center text-gray-600">Loading reviews...</div>
    );

  if (error)
    return (
      <div className="py-12 text-center text-red-600">
        Error loading reviews. Please try again later.
      </div>
    );

  const average = reviewData?.average
    ? Number(reviewData.average).toFixed(1)
    : "0.0";
  const total = reviewData?.total || 0;
  const distribution = reviewData?.distribution || {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  const reviews = reviewData?.reviews || [];

  return (
    <>
      <div>
        {/* Header */}
        <div className="flex gap-6 items-center mt-6 mb-3">
          <h2 className="text-2xl font-semibold text-gray-800">
            Ratings and reviews
          </h2>
          <span className="text-xl text-gray-400 p-2 cursor-pointer hover:bg-gray-200 hover:rounded-full transition">
            <FaArrowRight />
          </span>
        </div>

        {/* Device Toggle */}
        <div className="flex gap-2 mb-6">
          <button className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium cursor-pointer">
            <FaMobileAlt /> Phone
          </button>
          <button className="flex items-center gap-2 border px-4 py-1.5 rounded-full text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition">
            <FaTabletAlt /> Tablet
          </button>
        </div>

        {/* Rating Summary */}
        <div
          className="flex gap-10 cursor-pointer hover:bg-gray-50 p-6 rounded-xl transition duration-200"
          onClick={() =>
            user
              ? setModalOpen(true)
              : toast.warn("Please login to rate this app")
          }
        >
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-800">{average}</h1>
            <div className="flex justify-center mt-2 gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-2xl ${
                    i < Math.floor(average) ? "text-green-600" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {total.toLocaleString()} reviews
            </p>
          </div>

          <div className="flex-1 space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star] || 0;
              const percentage = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-5 text-right">
                    {star}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-green-600 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div className="mt-10">
          {reviews.length === 0 ? (
            <p className="text-center text-gray-500 py-12 text-lg">
              No reviews yet. Be the first to review this app!
            </p>
          ) : (
            reviews.map((rev) => {
              const reviewerId =
                typeof rev.userId === "string" ? rev.userId : rev.userId?._id;
              const userData = userMap[reviewerId];

              return (
                <ReviewItem
                  key={rev._id}
                  review={{ ...rev, appId }}
                  userData={userData}
                />
              );
            })
          )}
        </div>

        {/* What's New */}
        <div className="hidden md:block mt-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">What’s new</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            Bug fixes and performance improvements. <br />
            Our continuous efforts are to make the app more stable and
            rewarding.
          </p>
        </div>
      </div>

      {/* Submit Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-8">
              Rate this app
            </h2>

            <div className="mb-8 text-center">
              <StarRatingInput rating={newRating} setRating={setNewRating} />
              <p className="mt-4 text-sm text-gray-600">
                {newRating > 0
                  ? `You rated ${newRating} star${newRating > 1 ? "s" : ""}`
                  : "Tap the stars to rate"}
              </p>
            </div>

            <textarea
              className="w-full border border-gray-300 rounded-xl p-4 focus:outline-none focus:border-green-600 resize-none transition"
              rows={6}
              placeholder="Share your experience (optional)..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setNewRating(0);
                  setNewComment("");
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={createReview.isPending || newRating === 0}
                className="px-6 py-3 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {createReview.isPending ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RatingsAndReviews;
