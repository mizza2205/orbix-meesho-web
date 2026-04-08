import express from "express";
import {
  getProducts,
  getSingleProduct,
  addProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

// GET all products + filters
router.get("/", getProducts);

// GET single product
router.get("/:id", getSingleProduct);

// ADMIN: Add product
router.post("/", addProduct);

// ADMIN: Update product
router.put("/:id", updateProduct);

// ADMIN: Delete product
router.delete("/:id", deleteProduct);

export default router;