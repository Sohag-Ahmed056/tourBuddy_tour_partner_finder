import { NextFunction, Request, Response } from "express";
import ApiError from "../error/appError";
import { jwtHelper } from "../helper/jwtHelper";
import { JwtPayload } from "jsonwebtoken";

const auth = (...roles: string[]) => {
    return async (req: Request , res: Response, next: NextFunction) => {
        console.log("cookies", req.cookies);
        try {
            const token =  req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
            
            if (!token) {
                throw new ApiError(401, "You are not authorized!")
            }

            const verifyUser = jwtHelper.verifyToken(token, "abcd") as { id: string; email: string; role: string } & JwtPayload

          
                req.user = verifyUser;
                console.log(verifyUser);

            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new ApiError(404, "You are not in the required role!")
            }

            next();
        }
        catch (err) {
            next(err)
        }
    }
}

export default auth;