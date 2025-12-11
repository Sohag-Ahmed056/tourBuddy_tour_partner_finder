import { Request, Response } from "express";

import sendResponse from "../../shared/sendResponse.js";
import stripe from "../../helper/stripe.js";
import { paymentService } from "./payment.service.js";


const createSubscriptionSession = async (req: Request, res: Response) => {

    const userId = req.user?.id;
    console.log(userId);
    console.log(req.body);
    const { planType, price } = req.body;
    const session = await paymentService.createStripeSession(userId as string, planType, price);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Stripe session created successfully",
        data: session
    });
}



const handleStripeWebhook = async (req: Request, res: Response) => {
  console.log("🔥 Webhook hit!");

  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret ="whsec_PxRkV730AwMmnI0qXQ4ewqWR5HzHp9Ei";

  let event;
  try {
 
    event = await stripe.webhooks.constructEventAsync(
      req.body as Buffer,
      sig,
      webhookSecret
    );
    console.log("✅ Webhook signature verified!", event.type);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await paymentService.webhookHandler(event);
    res.status(200).json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook handler error:", err.message);
    res.status(500).send("Webhook handler failed");
  }
};

export const paymentController = {
    createSubscriptionSession,
    handleStripeWebhook
};