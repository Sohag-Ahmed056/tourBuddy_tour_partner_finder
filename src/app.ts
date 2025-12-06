import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import router from "./app/routes";
import { paymentController } from "./app/modules/payment/payment.controller";
import cors from 'cors'

dotenv.config();
const app = express();

// ------------------ WEBHOOK HANDLER ---------------------------------
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleStripeWebhook
);

// ------------------ GLOBAL MIDDLEWARE -----------------------------
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true //
}))
// ------------------ MAIN ROUTES -----------------------------------
app.use("/api/v1", router);

// ------------------ TEST ------------------------------------------
app.get("/", (req, res) => {
  res.json({ message: "Don't worry, I'm running smoothly!" });
});

app.use((req: Request, res: Response, next) => {
  console.log("Cookies:", req.cookies);
  next();
})
export default app;
