import { Router } from "express";
import { TouristController } from "./tourist.controller";

const router = Router();

router.get('/get-all', TouristController.getAllFromDB );
router.get('/get/:id', TouristController.getByIdFromDB);

export const TouristRoutes = router;