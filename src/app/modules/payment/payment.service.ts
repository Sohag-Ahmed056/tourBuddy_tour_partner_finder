import stripe from "../../helper/stripe";
import { prisma } from "../../lib/prisma";

const createStripeSession=async(userId:string,planType:string,price:number)=>{

       const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment/success?userId=${userId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: `TravelBuddy ${planType} Package` },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: { userId, planType, price },
    });

    return session;

}

const webhookHandler = async (event: any) => {
   if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId =  "19258548-8774-4dd1-9fc5-391a907750d3"; //  session.metadata.userId;                 
      const planType = "MONTHLY";                                        //session.metadata.planType;
      const price = 25 ;                                     //Number(session.metadata.price);

      console.log("Processing subscription for user:", userId);

      // Save payment
    await prisma.$transaction(async (prismaTx) => {
  // 1️⃣ Create payment
  await prismaTx.payment.create({
    data: {
      userId,
      amount: price,
      status: "SUCCESS",
      transactionId: session.id,
    },
  });

  // 2️⃣ Upsert subscription
  await prismaTx.subscriptionPlan.upsert({
    where: { userId },
    update: {
      isActive: true,
      startDate: new Date(),
      endDate: new Date(
        Date.now() + (planType === "MONTHLY" ? 30 : 365) * 24 * 60 * 60 * 1000
      ),
    },
    create: {
      userId,
      package: planType,
      price,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(
        Date.now() + (planType === "MONTHLY" ? 30 : 365) * 24 * 60 * 60 * 1000
      ),
    },
  });
});

      console.log("✓ Subscription Activated for", userId);
    }
  }

export const paymentService = {
  createStripeSession,
  webhookHandler
};

