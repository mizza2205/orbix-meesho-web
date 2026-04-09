import API from "./axios";

// ✅ Get all products
export const getProducts = (params) =>
  API.get("/products", { params });

// ✅ Get single product
export const getProductById = (id) =>
  API.get(`/products/${id}`);

// ✅ Add product (admin)
export const addProduct = (data) =>
  API.post("/products", data);

// ✅ Update product
export const updateProduct = (id, data) =>
  API.put(`/products/${id}`, data);

// ✅ Delete product
export const deleteProduct = (id) =>
  API.delete(`/products/${id}`);