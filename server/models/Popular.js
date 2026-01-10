import mongoose from 'mongoose';

const popularPromotionSchema = new mongoose.Schema(
  {
    app_id: {
      type: String,
      required: true,
    },
    image: {
      type: String, // e.g., /uploads/filename.jpg
      required: true,
    },
  },
  { timestamps: true }
);

const PopularPromotion = mongoose.model('PopularPromotion', popularPromotionSchema);

export default PopularPromotion;