import { Router } from "express";
import { ReviewController } from "./review.controller.js";
import auth from "../../middlewares/auth.js";

const router = Router();

router.post("/create-review",auth("TOURIST"), ReviewController.createReview);

export const reviewRoutes = router;