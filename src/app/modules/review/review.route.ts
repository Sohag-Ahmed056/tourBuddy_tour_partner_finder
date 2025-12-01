import { Router } from "express";
import { ReviewController } from "./review.controller";
import auth from "../../middlewares/auth";

const router = Router();

router.post("/create-review",auth("TOURIST"), ReviewController.createReview);

export const reviewRoutes = router;