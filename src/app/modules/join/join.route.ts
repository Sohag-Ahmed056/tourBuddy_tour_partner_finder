import { Router } from "express";
import { joinController } from "./join.controller.js";
import auth from "../../middlewares/auth.js";


const router = Router();

router.post('/join-request',auth("TOURIST"), joinController.sendJoinRequest)

router.get('/join-request/sent',auth("TOURIST"), joinController.listSentJoinRequests)
router.get('/join-request/received',auth("TOURIST"), joinController.listReceivedJoinRequests)
router.post('/join-request/respond',auth("TOURIST"), joinController.respondToJoinRequest)
router.delete('/join-request/:id/cancel',auth("TOURIST"), joinController.cancelJoinRequestController)
export const joinRoute = router;