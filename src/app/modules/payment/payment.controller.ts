import { Request, Response } from "express";
import { paymentService } from "./payment.service";

import sendResponse from "../../shared/sendResponse";
import stripe from "../../helper/stripe";


const createSubscriptionSession = async (req: Request, res: Response) => {

    const userId = req.user?.id;
    console.log(userId);
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
        const webhookSecret = "whsec_7aa0e876564d7172ed1ebbda82f18cd6c740ac93ff44efecbf654c0d71bf3f1c"
    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(req.body, sig!, webhookSecret);

    const response = await paymentService.webhookHandler(event);


    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Webhook handled successfully",
        data: response
    });
};

export const paymentController = {
    createSubscriptionSession,
    handleStripeWebhook
};