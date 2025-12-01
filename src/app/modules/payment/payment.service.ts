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

const webhookHandler=async(event:any)=>{

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const planType = session.metadata.planType;
      const price = Number(session.metadata.price);

      // Save Payment
      await prisma.payment.create({
        data: {
          userId,
          amount: price,
          status: "SUCCESS",
          transactionId: session.id,
        },
      });

     
      

      await prisma.subscriptionPlan.upsert({
        where: { userId },
        update: {
          isActive: true,
          startDate: new Date(),
          endDate: new Date(Date.now() + (planType === "MONTHLY" ? 30 : 365) * 24 * 60 * 60 * 1000)
        },
        create: {
          userId,
          package: planType,
          price,
          endDate: new Date(Date.now() + (planType === "MONTHLY" ? 30 : 365) * 24 * 60 * 60 * 1000)
        }
      });

      console.log("✓ Subscription Activated for", userId);
    }

}

// const verifyPayment = async (session_id: string): Promise<VerifyPaymentResult> => {
//   const session = await stripe.checkout.sessions.retrieve(session_id);

//   if (session.payment_status === "paid") {
//     const userId = session.metadata?.userId as string;
//     const planType = session.metadata?.planType as string;
//     const price = Number(session.metadata?.price);

//     // Avoid duplicate payments
//     const existingPayment = await prisma.payment.findUnique({
//       where: { transactionId: session.id },
//     });

//     if (!existingPayment) {
//       await prisma.payment.create({
//         data: {
//           userId,
//           amount: price,
//           status: "SUCCESS",
//           transactionId: session.id,
//         },
//       });

//       await prisma.subscriptionPlan.upsert({
//         where: { userId },
//         update: {
//           isActive: true,
//           startDate: new Date(),
//           endDate: new Date(
//             Date.now() + (planType === "MONTHLY" ? 30 : 365) * 24 * 60 * 60 * 1000
//           ),
//         },
//         create: {
//           userId,
//           package: planType,
//           price,
//           endDate: new Date(
//             Date.now() + (planType === "MONTHLY" ? 30 : 365) * 24 * 60 * 60 * 1000
//           ),
//         },
//       });

//       console.log("✓ Subscription Activated for", userId);
//     }

//     return { success: true, message: "Payment successful and subscription activated." };
//   } else {
//     return { success: false, message: "Payment not completed yet." };
//   }
// };




export const paymentService = {
  createStripeSession,
  webhookHandler
};

