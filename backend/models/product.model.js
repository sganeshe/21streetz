const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    images: [
      {
        type: String, // Cloudinary or S3 URLs
        required: true,
      }
    ],
    category: {
      type: String,
      required: true,
      trim: true,
    },
    sizes: [
      {
        size: { type: String, required: true }, // e.g., "S", "M", "L", "One Size"
        countInStock: { type: Number, required: true, default: 0 }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;