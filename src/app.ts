import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";


import cors from 'cors'
import { paymentController } from "./app/modules/payment/payment.controller.js";
import router from "./app/routes/index.js";
import globalErrorHandler from "./app/middlewares/globalErrorHandler.js";

dotenv.config();
const app = express();

// ------------------ CORS (before webhook) -------------------------
app.use(cors({
  origin: 'https://tour-buddy-find-your-partner-client.vercel.app/', 
  credentials: true
}));

// ------------------ WEBHOOK HANDLER (MUST BE FIRST) ---------------
// This must come BEFORE express.json() middleware
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleStripeWebhook
);

// ------------------ GLOBAL MIDDLEWARE -----------------------------
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------ MAIN ROUTES -----------------------------------
app.use("/api/v1", router);

// ------------------ TEST ------------------------------------------
app.get("/", (req, res) => {
  res.json({ message: "Don't worry, I'm running smoothly!" });
});
app.use(globalErrorHandler);

export default app;