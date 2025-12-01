import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import router from "./app/routes";
import { paymentController } from "./app/modules/payment/payment.controller";

dotenv.config();
const app = express();

// ------------------ WEBHOOK FIRST ---------------------------------
app.post(
  "/webhook",
  express.raw({ type: "application/json" }), // ⬅ keeps raw body
  paymentController.handleStripeWebhook
);

// ------------------ GLOBAL MIDDLEWARE -----------------------------
app.use(express.json()); // now safe
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------ MAIN ROUTES -----------------------------------
app.use("/api/v1", router);

// ------------------ TEST ------------------------------------------
app.get("/", (req, res) => {
  res.json({ message: "Bun + Express API is running 🚀" });
});

export default app;