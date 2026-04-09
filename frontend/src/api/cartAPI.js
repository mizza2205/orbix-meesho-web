import API from "./axios";

// const userId = "user123";

export const addToCarts = (userId, productId) =>
  API.post("/cart/add", { userId, productId });
export const getCart = (userId) => API.get(`/cart/${userId}`);
export const removeFromCart = (userId, productId) =>
  API.delete("/cart/remove", { data: { userId, productId } });
export const updateCart = (userId, productId, quantity) =>
  API.put("/cart/update", { userId, productId, quantity });
