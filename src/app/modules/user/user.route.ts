import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { UserValidation } from "./user.validation";
import auth from "../../middlewares/auth";


const router = Router();

router.post(
    "/create-tourist",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = UserValidation.createTouristValidationSchema.parse(JSON.parse(req.body.data))
        return UserController.createTourist(req, res, next)
    }
)

router.post("/create-admin",auth("ADMIN"), UserController.createAdmin);

router.get("/all", UserController.getAllUsersFromDB);
router.get("/my-profile",auth("TOURIST"), UserController.getMyProfile);
router.put("/update-user", fileUploader.upload.single('file'),auth("TOURIST"), UserController.updateUser);


export const userRoutes = router;