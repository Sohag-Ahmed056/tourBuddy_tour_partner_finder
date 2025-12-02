import { Request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { AuthService } from "./auth.service";

const login = catchAsync(async (req: Request, res: Response) => {
    const result = await AuthService.login(req.body);
    const { accessToken, refreshToken } = result;

    res.cookie("accessToken", accessToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60
    })
    res.cookie("refreshToken", refreshToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 90
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

    const { userId, oldPassword, newPassword } = req.body;
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