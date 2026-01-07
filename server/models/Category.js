// models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String, // Stores the path like "/uploads/filename.jpg"
      required: true,
    },
    path: {
      type: String,
      required: true,
      unique: true, // optional: ensure unique paths like /games
      trim: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;