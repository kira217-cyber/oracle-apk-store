// Backend: routes/reviewAndCommentRoutes.js
import express from 'express';
import mongoose from 'mongoose';
import Review from '../models/ReviewAndComment.js'; // Adjust path if needed

const router = express.Router();

// POST: Create a new review
router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Get reviews and stats for a specific app
router.get('/:appId', async (req, res) => {
  try {
    const appId = req.params.appId;

    // Get latest 5 reviews with user populated
    const reviews = await Review.find({ appId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'firstName lastName');

    // Aggregate for average and total
    const aggregate = await Review.aggregate([
      { $match: { appId: new mongoose.Types.ObjectId(appId) } },
      {
        $group: {
          _id: null,
          average: { $avg: '$rating' },
          total: { $sum: 1 },
        },
      },
      { $project: { average: { $round: ['$average', 1] }, total: 1 } },
    ]);

    // Aggregate for distribution (floored rating)
    const dist = await Review.aggregate([
      { $match: { appId: new mongoose.Types.ObjectId(appId) } },
      { $group: { _id: { $floor: '$rating' }, count: { $sum: 1 } } },
    ]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    dist.forEach((d) => {
      if (d._id >= 1 && d._id <= 5) {
        distribution[d._id] = d.count;
      }
    });

    const stats = aggregate[0] || { average: 0, total: 0 };

    res.json({ reviews, ...stats, distribution });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH: Increment helpful count
router.patch('/:id/helpful', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;