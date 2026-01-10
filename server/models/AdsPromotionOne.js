import mongoose from 'mongoose';

const adsPromotionOneSchema = new mongoose.Schema(
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

const AdsPromotionOne = mongoose.model('AdsPromotionOne', adsPromotionOneSchema);

export default AdsPromotionOne;