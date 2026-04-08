import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  mrp: Number,
  discount: Number,
  rating: { type: Number, default: 0 },

  images: [String],

  category: String,
  brand: String,

  specifications: {
    material: String,
    color: String,
    weight: String
  },

  variants: [
    {
      size: String,
      color: String,
      stock: Number
    }
  ]
}, { timestamps: true });

export default mongoose.model("Product", productSchema);