import { Router } from "express";
import { TravelController } from "./travel.controller";
import auth from "../../middlewares/auth";


const router = Router();

router.post('/create-travel-plan',auth("TOURIST"), TravelController.createTour );
// router.get('/get-all-travel-plans', TravelController.getAllTravelPlans );

router.get("/get-all-travel-plans", TravelController.getAllTravelPlans );
router.put('/update-travel-plan/:id',auth("TOURIST"), TravelController.updateTravelPlan );
router.delete('/delete-travel-plan/:id',auth("TOURIST"), TravelController.deleteTravelPlan );
export const TravelRoutes = router;
