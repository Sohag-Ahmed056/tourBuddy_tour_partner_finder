import express, { Router } from "express";
import { paymentController } from "./payment.controller";
import auth from "../../middlewares/auth";


const router = Router();

router.post('/subscribe',auth("TOURIST"), paymentController.createSubscriptionSession);


export const paymentRoute = router;