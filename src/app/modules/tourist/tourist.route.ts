import { Router } from "express";
import { TouristController } from "./tourist.controller.js";

const router = Router();

router.get('/get-all', TouristController.getAllFromDB );
router.get('/get/:id', TouristController.getByIdFromDB);
router.delete('/delete/:id', TouristController.deleteTouristFromDB);

export const TouristRoutes = router;