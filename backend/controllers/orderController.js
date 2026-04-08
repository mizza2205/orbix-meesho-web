import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";

// ✅ CHECKOUT (Cart → Order)
export const createOrder = async (req, res) => {
  try {
    const { userId, address } = req.body;

    const cart = await Cart.findOne({ userId })
      .populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const total = cart.items.reduce((acc, item) => {
      return acc + item.productId.price * item.quantity;
    }, 0);

    const order = await Order.create({
      userId,
      items: cart.items,
      totalAmount: total,
      address,
      status: "pending"
    });

    // clear cart after order
    await Cart.findOneAndDelete({ userId });

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ GET ALL ORDERS
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ UPDATE STATUS (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};