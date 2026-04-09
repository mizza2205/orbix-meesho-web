import Razorpay from "razorpay";

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // 1. Log to verify the backend is actually receiving the data
    console.log("Incoming Amount:", amount);
    console.log("Checking Keys in Controller:");
console.log("ID starts with:", process.env.RAZORPAY_KEY_ID)
console.log("Secret starts with:", process.env.RAZORPAY_KEY_SECRET)

    // 2. Validation: Razorpay fails on 0, null, or decimals
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid or zero amount" });
    }

    // 3. Environment Variable Check
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error("FATAL: Razorpay keys missing in .env");
      return res.status(500).json({ message: "API keys not configured on server" });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // 4. Conversion: Razorpay expects PAISA (Integer)
    const options = {
      amount: Math.round(Number(amount) * 100), 
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    
    console.log("Razorpay Order Created:", order.id);
    res.status(200).json(order);

  } catch (error) {
    // This will print the specific Razorpay error (e.g., "Unauthorized") to your Terminal
    console.error("RAZORPAY ERROR:", error); 
    res.status(500).json({ message: error.description || "Internal Server Error" });
  }
};