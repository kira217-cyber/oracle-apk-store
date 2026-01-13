import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaStar,
  FaEdit,
  FaTrash,
  FaPlus,
  FaUserCircle,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { motion } from "framer-motion";

const API_BASE = `${import.meta.env.VITE_API_URL}`;

const formatDate = (dateString) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StarRatingInput = ({ rating, setRating, disabled = false }) => {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`text-2xl sm:text-3xl cursor-pointer transition-all duration-200 ${
            rating >= star
              ? "text-yellow-400 drop-shadow-md"
              : "text-gray-600 hover:text-yellow-400/70"
          } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          onClick={() => !disabled && setRating(star)}
        />
      ))}
    </div>
  );
};

const ReviewRow = ({ review, onEdit, onDelete }) => {
  const user = review.userId || {};
  const displayName = review.fakeUserName?.trim()
    ? review.fakeUserName.trim()
    : review.userId
    ? review.userId.name?.trim() ||
      (review.userId.email ? review.userId.email.split("@")[0] : "Anonymous")
    : "Anonymous";

  return (
    <tr className="border-b border-blue-900/30 hover:bg-white/5 transition-colors duration-200 group">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <FaUserCircle className="text-3xl text-blue-400/60" />
          <div>
            <div className="font-medium text-gray-100">{displayName}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {user.email || "—"}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4 text-center">
        <div className="text-lg font-semibold text-gray-200">
          {review.rating}
        </div>
        <div className="flex justify-center mt-1">
          <StarRatingInput rating={review.rating} disabled />
        </div>
      </td>
      <td className="p-4 max-w-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          {review.comment || (
            <span className="italic opacity-50">No comment</span>
          )}
        </p>
      </td>
      <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
        {formatDate(review.createdAt)}
      </td>
      <td className="p-4 text-center text-gray-300">{review.helpful || 0}</td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={() => onEdit(review)}
            className="text-blue-400 hover:text-blue-300 transition cursor-pointer"
            title="Edit Review"
          >
            <FaEdit size={20} />
          </button>
          <button
            onClick={() => onDelete(review._id)}
            className="text-red-500 hover:text-red-400 transition cursor-pointer"
            title="Delete Review"
          >
            <FaTrash size={20} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const RatingsAndReviewsController = () => {
  const queryClient = useQueryClient();

  const [selectedApkId, setSelectedApkId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [newReviewMode, setNewReviewMode] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [customDate, setCustomDate] = useState(
    new Date().toISOString().slice(0, 16)
  );

  // Fetch all APKs
  const { data: apksRaw = [], isLoading: apksLoading } = useQuery({
    queryKey: ["admin-all-apks"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BASE}/api/all-apks`); // ← confirm this route
      return Array.isArray(data) ? data : data?.data || data?.apks || [];
    },
  });

  const apks = Array.isArray(apksRaw) ? apksRaw : [];

  // Fetch reviews
  const {
    data: reviewData,
    isLoading: reviewsLoading,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["admin-reviews", selectedApkId],
    queryFn: async () => {
      if (!selectedApkId) return null;
      const { data } = await axios.get(
        `${API_BASE}/api/reviews/${selectedApkId}`
      );
      return data?.data || {};
    },
    enabled: !!selectedApkId,
  });

  const reviews = reviewData?.reviews || [];

  const selectedApk = apks.find((a) => a._id === selectedApkId);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (payload) => axios.post(`${API_BASE}/api/reviews`, payload),
    onSuccess: () => {
      toast.success("Review created successfully");
      resetForm();
      refetchReviews();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.error || "Failed to create"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      axios.put(`${API_BASE}/api/reviews/${id}`, payload),
    onSuccess: () => {
      toast.success("Review updated");
      resetForm();
      refetchReviews();
    },
    onError: (err) =>
      toast.error(err?.response?.data?.error || "Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`${API_BASE}/api/reviews/${id}`),
    onSuccess: () => {
      toast.success("Review deleted");
      setDeleteConfirmId(null);
      refetchReviews();
    },
    onError: () => toast.error("Failed to delete review"),
  });

  const resetForm = () => {
    setRating(0);
    setComment("");
    setUserName("");
    setCustomDate(new Date().toISOString().slice(0, 16));
    setEditReview(null);
    setNewReviewMode(false);
  };

  const handleSubmit = () => {
    if (rating < 1 || rating > 5) return toast.warn("Please select a rating");

    if (editReview) {
      updateMutation.mutate({
        id: editReview._id,
        payload: { rating, comment: comment.trim() || undefined },
      });
    } else if (newReviewMode) {
      if (!userName.trim()) return toast.warn("Please enter reviewer name");
      const payload = {
        apkId: selectedApkId,
        rating,
        comment: comment.trim() || undefined,
        fakeUserName: userName.trim(),
        isAdminFake: true,
        createdAt: customDate ? new Date(customDate).toISOString() : undefined,
      };
      createMutation.mutate(payload);
    }
  };

  const confirmDelete = (id) => setDeleteConfirmId(id);
  const executeDelete = () => {
    if (deleteConfirmId) deleteMutation.mutate(deleteConfirmId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f172a] to-[#111827] text-gray-100 p-4 md:p-8">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-bold mb-6 tracking-tight"
      >
        Ratings & Reviews Control
      </motion.h1>

      {/* APK Selector */}
      <div className="mb-10">
        <label className="block text-sm font-medium text-blue-300 mb-3">
          Select Application
        </label>
        {apksLoading ? (
          <div className="flex items-center gap-3 text-gray-400">
            <FaSpinner className="animate-spin" /> Loading applications...
          </div>
        ) : (
          <select
            value={selectedApkId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedApkId(val);
              if (val) {
                setModalOpen(true);
                resetForm();
              }
            }}
            className="w-full max-w-xl bg-white/5 backdrop-blur-md border border-blue-800/50 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all cursor-pointer"
          >
            <option value="" className="bg-[#0f172a]">
              — Choose an app —
            </option>
            {apks.map((apk) => (
              <option key={apk._id} value={apk._id} className="bg-[#0f172a]">
                {apk.apkTitle || apk.title || "Unnamed App"} • ID:{" "}
                {apk.apk_Id.slice(-7)}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Main Modal */}
      {modalOpen && selectedApkId && (
        <div className="fixed inset-0 bg-black/70 flex items-start justify-center pt-6 md:pt-12 z-50 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-b from-[#0f172a]/95 to-[#0a0e1a]/95 backdrop-blur-xl border border-blue-900/40 rounded-2xl shadow-2xl w-full max-w-6xl mx-4 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-blue-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-blue-100">
                  Reviews for:{" "}
                  {selectedApk?.apkTitle || selectedApk?.title || "App"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  ID: {selectedApkId.slice(-10)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    resetForm();
                    setNewReviewMode(true);
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 rounded-xl text-white font-medium shadow-lg hover:shadow-green-900/40 transition cursor-pointer"
                >
                  <FaPlus /> Add Fake Review
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 bg-white/10 border border-gray-600 rounded-xl hover:bg-white/15 text-gray-200 transition cursor-pointer"
                >
                  Close
                </motion.button>
              </div>
            </div>

            {/* Table / Content */}
            <div className="p-5 md:p-8">
              {reviewsLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <FaSpinner className="text-4xl animate-spin mb-4" />
                  <p>Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-xl">
                    No reviews found for this application yet.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-blue-900/30">
                  <table className="w-full min-w-max">
                    <thead className="bg-blue-950/40">
                      <tr>
                        <th className="p-4 text-left text-blue-300">User</th>
                        <th className="p-4 text-center text-blue-300">
                          Rating
                        </th>
                        <th className="p-4 text-left text-blue-300">Comment</th>
                        <th className="p-4 text-left text-blue-300">Date</th>
                        <th className="p-4 text-center text-blue-300">
                          Helpful
                        </th>
                        <th className="p-4 text-right text-blue-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((review) => (
                        <ReviewRow
                          key={review._id}
                          review={review}
                          onEdit={() => {
                            setEditReview(review);
                            setRating(review.rating);
                            setComment(review.comment || "");
                            setNewReviewMode(false);
                          }}
                          onDelete={confirmDelete}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Form – Edit or Add */}
            {(editReview || newReviewMode) && (
              <div className="border-t border-blue-900/40 p-6 md:p-8 bg-black/30">
                <h3 className="text-xl font-semibold mb-6 text-blue-100">
                  {editReview ? "Edit Review" : "Create Fake Review"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block text-sm text-blue-300 mb-2">
                      Rating *
                    </label>
                    <StarRatingInput rating={rating} setRating={setRating} />
                  </div>

                  {newReviewMode && (
                    <>
                      <div>
                        <label className="block text-sm text-blue-300 mb-2">
                          Reviewer Name *
                        </label>
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="e.g. Ahmed Hasan"
                          className="w-full bg-white/5 border border-blue-800/50 rounded-xl p-3.5 text-gray-200 focus:outline-none focus:border-blue-500 transition cursor-text"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-blue-300 mb-2">
                          Custom Date (optional)
                        </label>
                        <input
                          type="datetime-local"
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          className="w-full bg-white/5 border border-blue-800/50 rounded-xl p-3.5 text-gray-200 focus:outline-none focus:border-blue-500 transition cursor-text"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="mb-8">
                  <label className="block text-sm text-blue-300 mb-2">
                    Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    placeholder="Share your experience..."
                    className="w-full bg-white/5 border border-blue-800/50 rounded-xl p-4 text-gray-200 focus:outline-none focus:border-blue-500 transition resize-y cursor-text"
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={resetForm}
                    className="px-7 py-3 bg-white/10 border border-gray-600 rounded-xl hover:bg-white/15 text-gray-200 transition cursor-pointer"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSubmit}
                    disabled={
                      rating === 0 ||
                      (newReviewMode && !userName.trim()) ||
                      createMutation.isPending ||
                      updateMutation.isPending
                    }
                    className="px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-white font-medium shadow-lg hover:shadow-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer flex items-center gap-2"
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <FaSpinner className="animate-spin" />
                    ) : editReview ? (
                      "Update Review"
                    ) : (
                      "Create Review"
                    )}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-b from-[#0f172a] to-[#0a0e1a] border border-red-900/40 rounded-2xl p-8 max-w-md w-[90%] shadow-2xl"
          >
            <h3 className="text-xl font-bold text-red-300 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-300 mb-8">
              Are you sure you want to permanently delete this review? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-6 py-3 bg-white/10 border border-gray-600 rounded-xl hover:bg-white/15 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-6 py-3 bg-gradient-to-r from-red-700 to-red-600 rounded-xl text-white font-medium hover:brightness-110 transition cursor-pointer flex items-center gap-2"
              >
                {deleteMutation.isPending ? (
                  <FaSpinner className="animate-spin" />
                ) : null}
                Delete Review
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RatingsAndReviewsController;
