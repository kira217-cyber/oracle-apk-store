// RatingsAndReviews.jsx - Updated to show fakeUserName from admin fake reviews
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

// Fetch reviews using real ObjectId (_id)
const fetchReviews = async (apkId) => {
  const { data } = await axios.get(`${API_BASE}/api/reviews/${apkId}`);
  return data;
};

// Fetch single user by ID
const fetchUser = async (userId) => {
  if (!userId) return null;
  try {
    const { data } = await axios.get(`${API_BASE}/api/users/${userId}`);
    return data.user; // Expecting { id, name, email, ... }
  } catch (err) {
    console.error("Failed to fetch user:", err);
    return null;
  }
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

const ReviewItem = ({ review, userData, currentUser }) => {
  const queryClient = useQueryClient();

  const updateHelpful = useMutation({
    mutationFn: (id) =>
      axios.patch(`${API_BASE}/api/reviews/${id}/helpful`, {
        userId: currentUser?.id || currentUser?._id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", review.apk_Id]);
      toast.success("Thank you for your feedback!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Failed to mark as helpful");
    },
  });

  // Determine display name - Updated to support fakeUserName
  let userName = "Anonymous User";

  // 1. Check if it's an admin fake review (highest priority)
  if (review.fakeUserName && review.fakeUserName.trim()) {
    userName = review.fakeUserName.trim();
  }
  // 2. If fetched user data exists (from separate /api/users/:id call)
  else if (userData) {
    if (userData.name && userData.name.trim()) {
      userName = userData.name.trim();
    } else if (userData.email) {
      userName = userData.email.split("@")[0];
    }
  }
  // 3. If userId is already populated in the review object
  else if (review.userId && typeof review.userId === "object") {
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
            <p className="text-sm font-medium text-gray-800">
              {userName}
            </p>
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

const RatingsAndReviews = ({ apkId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  // Main query: fetch reviews + stats using real ObjectId
  const {
    data: reviewData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["reviews", apkId],
    queryFn: () => fetchReviews(apkId),
    enabled: !!apkId,
  });

  // Extract unique userIds
  const userIds =
    reviewData?.data?.reviews
      ?.map((rev) =>
        typeof rev.userId === "string" ? rev.userId : rev.userId?._id
      )
      .filter(Boolean) || [];

  // Parallel fetch users
  const userQueries = useQueries({
    queries: userIds.map((id) => ({
      queryKey: ["user", id],
      queryFn: () => fetchUser(id),
      enabled: !!id && userIds.length > 0,
      staleTime: 1000 * 60 * 10, // 10 minutes
    })),
  });

  // User map
  const userMap = {};
  userQueries.forEach((query, index) => {
    if (query.data) {
      userMap[userIds[index]] = query.data;
    }
  });

  const createReview = useMutation({
    mutationFn: (newReview) => axios.post(`${API_BASE}/api/reviews`, newReview),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews", apkId]);
      toast.success("Review submitted successfully!");
      setModalOpen(false);
      setNewRating(0);
      setNewComment("");
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || "Failed to submit review. Try again."
      );
    },
  });

  const handleSubmit = () => {
    if (!user) return toast.warn("Please login to submit a review");
    if (!apkId) return toast.error("Invalid APK ID");
    if (!newRating) return toast.warn("Please select a rating");

    const payload = {
      apkId,
      userId: user.id || user._id,
      rating: newRating,
      comment: newComment || undefined,
    };

    createReview.mutate(payload);
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

  const reviewContent = reviewData?.data || reviewData || {};
  const average = reviewContent.average
    ? Number(reviewContent.average).toFixed(1)
    : "0.0";
  const total = reviewContent.total || 0;
  const distribution = reviewContent.distribution || {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  const reviews = reviewContent.reviews || [];

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
                  review={{ ...rev, apk_Id: apkId }}
                  userData={userData}
                  currentUser={user}
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
