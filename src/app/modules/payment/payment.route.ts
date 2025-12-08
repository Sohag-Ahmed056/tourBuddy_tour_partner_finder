import express, { Router } from "express";
import { paymentController } from "./payment.controller.js";
import auth from "../../middlewares/auth.js";


const router = Router();

router.post('/subscribe',auth("TOURIST"), paymentController.createSubscriptionSession);


export const paymentRoute = router;