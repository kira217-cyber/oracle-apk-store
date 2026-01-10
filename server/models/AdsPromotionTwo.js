import mongoose from 'mongoose';

const adsPromotionTwoSchema = new mongoose.Schema(
  {
    app_id: {
      type: String,
      required: true,
    },
    image: {
      type: String, // path like /uploads/xxxx.jpg
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('AdsPromotionTwo', adsPromotionTwoSchema);