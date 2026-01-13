// routes/reviewAndCommentRoutes.js
import express from "express";
import mongoose from "mongoose";
import Review from "../models/ReviewAndComment.js"; // Make sure path is correct

const router = express.Router();


// POST - Create new review (supports both real users and admin fake reviews)
router.post("/", async (req, res) => {
  const {
    apkId,
    userId,
    rating,
    comment,
    fakeUserName,
    isAdminFake = false,          // default false → normal user flow
    createdAt,                    // optional custom date from admin
  } = req.body;

  // Basic required fields (common for both)
  if (!apkId || !rating) {
    return res.status(400).json({
      success: false,
      error: "apkId and rating Need!",
    });
  }

  if (!mongoose.isValidObjectId(apkId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid APK ID format (must be valid ObjectId)",
    });
  }

  // Rating validation
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      error: "Rating must be an integer between 1 and 5.",
    });
  }

  try {
    let reviewData = {
      apk_Id: new mongoose.Types.ObjectId(apkId),
      rating: Number(rating),
      comment: comment?.trim() ? comment.trim() : undefined,
    };

    // ────────────────────────────────────────────────
    // Normal user flow (client app)
    // ────────────────────────────────────────────────
    if (!isAdminFake) {
      if (!userId) {
        return res.status(400).json({
          success: false,
          error: "userId is required (for normal users)",
        });
      }

      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid userId format",
        });
      }

      // Check duplicate review for real user
      const existingReview = await Review.findOne({
        apk_Id: reviewData.apk_Id,
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (existingReview) {
        return res.status(409).json({
          success: false,
          error: "You have already reviewed this app",
        });
      }

      reviewData.userId = new mongoose.Types.ObjectId(userId);
    }

    // ────────────────────────────────────────────────
    // Admin fake review flow
    // ────────────────────────────────────────────────
    else {
      if (!fakeUserName || !fakeUserName.trim()) {
        return res.status(400).json({
          success: false,
          error: "fakeUserName is required (for fake reviews)",
        });
      }

      // For fake reviews: no real userId
      reviewData.userId = null;
      reviewData.fakeUserName = fakeUserName.trim();

      // Optional custom creation date from admin
      if (createdAt) {
        const customDate = new Date(createdAt);
        if (!isNaN(customDate.getTime())) {
          reviewData.createdAt = customDate;
        }
      }

      // Optional: mark as admin-created
      reviewData.createdByAdmin = true;
    }

    // Create and save the review
    const review = new Review(reviewData);
    await review.save();

    res.status(201).json({
      success: true,
      message: isAdminFake
        ? "Fake review added successfully."
        : "Fake review added successfully.",
      data: review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    // Handle mongoose validation or duplicate key errors nicely
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Duplicate review (Multiple reviews from the same user are prohibited)",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to create review",
      details: error.message,
    });
  }
});

// GET - Get reviews + stats for an app
router.get("/:apkId", async (req, res) => {
  try {
    const { apkId } = req.params;

    if (!mongoose.isValidObjectId(apkId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid APK ID format (must be valid ObjectId)",
      });
    }

    const objectId = new mongoose.Types.ObjectId(apkId);

    // Get latest reviews (with user info)
    const reviews = await Review.find({ apk_Id: objectId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "firstName lastName email profilePicture")
      .lean();

    // Stats: average & total count
    const stats = await Review.aggregate([
      { $match: { apk_Id: objectId } },
      {
        $group: {
          _id: null,
          average: { $avg: "$rating" },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          average: { $round: ["$average", 1] },
          total: 1,
        },
      },
    ]);

    // Rating distribution (1★ → 5★)
    const distributionResult = await Review.aggregate([
      { $match: { apk_Id: objectId } },
      {
        $group: {
          _id: { $floor: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    distributionResult.forEach((item) => {
      if (item._id >= 1 && item._id <= 5) {
        distribution[item._id] = item.count;
      }
    });

    const result = {
      success: true,
      data: {
        reviews,
        average: stats[0]?.average || 0,
        total: stats[0]?.total || 0,
        distribution,
      },
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch reviews",
      details: error.message,
    });
  }
});

// PATCH - Mark review as helpful (one time per user)
router.patch("/:id/helpful", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      error: "userId is required",
    });
  }

  if (!mongoose.isValidObjectId(userId)) {
    return res.status(400).json({
      success: false,
      error: "Invalid userId format",
    });
  }

  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: "Review not found",
      });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Already marked helpful by this user
    if (review.helpfulBy.includes(userObjectId)) {
      return res.status(409).json({
        success: false,
        error: "You have already marked this review as helpful",
      });
    }

    review.helpful += 1;
    review.helpfulBy.push(userObjectId);

    await review.save();

    res.json({
      success: true,
      message: "Marked as helpful",
      helpful: review.helpful,
    });
  } catch (error) {
    console.error("Helpful update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update helpful count",
      details: error.message,
    });
  }
});

// PATCH or PUT - Update review (admin only)
router.put("/:id", async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: "Review not found" });

    const { rating, comment } = req.body;

    if (rating !== undefined) {
      if (!Number.isInteger(rating) || rating < 1 || rating > 5)
        return res.status(400).json({ error: "Invalid rating" });
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment?.trim() || undefined;
    }

    await review.save();
    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: "Not found" });
    res.json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
