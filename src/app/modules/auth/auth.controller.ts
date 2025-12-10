import { Request, Response } from "express";

import catchAsync from "../../shared/catchAsync.js";
import { AuthService } from "./auth.service.js";
import sendResponse from "../../shared/sendResponse.js";


const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    const { accessToken, refreshToken } = result;

    res.cookie("accessToken", accessToken, {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge:60 * 60 * 24
    })
    res.cookie("refreshToken", refreshToken, {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge:  60 * 60 * 24 * 90
    })

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "User loggedin successfully!",
        data: {
            accessToken,
            refreshToken
        }
    })
})


const changePassword = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const { oldPassword, newPassword } = req.body;
    const result = await AuthService.changePassword(userId, oldPassword, newPassword);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password changed successfully!",
        data: result
    })
})
export const AuthController = {
    login,
    changePassword
}