import API from "./axios";

// ✅ Create Razorpay order
export const createPaymentOrder = (amount) =>
  API.post("/payment/create-order", { amount });