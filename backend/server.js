import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("DB Connected"))
.catch(err => console.log(err));

app.listen(5020, () => console.log("Server running on 5020"));