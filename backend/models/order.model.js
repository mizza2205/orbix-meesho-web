import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,

  items: Array,

  totalAmount: Number,

  address: {
    name: String,
    address: String,
    phone: String
  },

  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered"],
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);