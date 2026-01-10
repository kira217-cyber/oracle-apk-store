import mongoose from 'mongoose';

const mostDownloadSchema = new mongoose.Schema(
  {
    app_id: {
      type: String,
      required: true,
      unique: true, // One entry per app_id
    },
  },
  { timestamps: true }
);

const MostDownload = mongoose.model('MostDownload', mostDownloadSchema);

export default MostDownload;