import { Router } from "express";
import { joinController } from "./join.controller";
import auth from "../../middlewares/auth";


const router = Router();

router.post('/join-request',auth("TOURIST"), joinController.sendJoinRequest)
export const joinRoutes = router;
router.get('/join-request/sent',auth("TOURIST"), joinController.listSentJoinRequests)
router.get('/join-request/received',auth("TOURIST"), joinController.listReceivedJoinRequests)
router.post('/join-request/respond',auth("TOURIST"), joinController.respondToJoinRequest)