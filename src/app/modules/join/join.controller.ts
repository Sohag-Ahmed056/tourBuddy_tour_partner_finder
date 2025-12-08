import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { joinRequestService } from "./join.service.js";
import sendResponse from "../../shared/sendResponse.js";

const sendJoinRequest = catchAsync(async (req:Request, res:Response) => {
    const { id, message } = req.body;
    console.log("Request Body:", req.body); // Debugging line
    const senderId = req.user?.id; // Assuming req.user contains the authenticated user's info

    const joinRequest = await joinRequestService.sendJoinRequest(senderId as string, id, message);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Join request sent successfully",
        data: joinRequest
    });
});


const cancelJoinRequestController = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params; // requestId
    const userId = req.user?.id as string;

    const result = await joinRequestService.cancelJoinRequest(id, userId);

    res.status(200).json({
        success: true,
        message: "Join request cancelled successfully",
        data: result,
    });
});



const listSentJoinRequests = catchAsync(async (req:Request, res:Response) => {
    const touristId = req.user?.id;

    const joinRequests = await joinRequestService.listSentJoinRequests(touristId as string);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Sent join requests retrieved successfully",
        data: joinRequests
    });
});

const listReceivedJoinRequests = catchAsync(async (req:Request, res:Response) => {
    const touristId = req.user?.id;

    const joinRequests = await joinRequestService.listReceivedJoinRequests(touristId as string);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Received join requests retrieved successfully",
        data: joinRequests
    });
});

const respondToJoinRequest = catchAsync(async (req:Request, res:Response) => {
    const receiverId = req.user?.id;
    const { requestId, accept } = req.body;

   const response = await joinRequestService.respondToJoinRequest(requestId, receiverId as string, accept);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Join request response recorded successfully",
        data: response
    });
});



export const joinController = {
    sendJoinRequest,
    listSentJoinRequests,
    listReceivedJoinRequests,
    respondToJoinRequest,
    cancelJoinRequestController
}