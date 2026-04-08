import express from "express";
import {
  createOrder,
  getOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/checkout", createOrder);
router.get("/", getOrders);
router.put("/:id", updateOrderStatus);

export default router;