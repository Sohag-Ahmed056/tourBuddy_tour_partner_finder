import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller.js";
import { fileUploader } from "../../helper/fileUploader.js";
import { UserValidation } from "./user.validation.js";
import auth from "../../middlewares/auth.js";


const router = Router();

router.post(
    "/create-tourist",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createTouristValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createTourist(req, res, next)
    }
)

router.post("/create-admin", UserController.createAdmin);
router.delete("/delete", UserController.deleteUser);

router.get("/all", UserController.getAllUsersFromDB);
router.get("/my-profile",auth("TOURIST", "ADMIN"), UserController.getMyProfile);
router.post("/update-user", fileUploader.upload.single('file'),auth("TOURIST"), UserController.updateUser);
router.get("/get-user/:id", UserController.getSingleProfile);

export const userRoutes = router;