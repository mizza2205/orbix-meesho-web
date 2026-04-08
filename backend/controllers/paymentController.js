import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config(); // Add this line!

const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, 
      currency: "INR"
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};