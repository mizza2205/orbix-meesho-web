import API from "./axios";

const userId = "user123";

// ✅ Checkout
export const checkout = (address) =>
  API.post("/orders/checkout", {
    userId,
    address
  });

// ✅ Get all orders
export const getOrders = () =>
  API.get("/orders");

// ✅ Update order status
export const updateOrderStatus = (id, status) =>
  API.put(`/orders/${id}`, { status });