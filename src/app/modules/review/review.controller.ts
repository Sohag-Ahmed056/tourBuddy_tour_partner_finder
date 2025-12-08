import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { ReviewService } from "./review.service.js";
import sendResponse from "../../shared/sendResponse.js";


const createReview= catchAsync(async(req:Request,res:Response)=>{

    const {travelPlanId, rating, comment} = req.body;
    const reviwerId = req.user?.id ;

    const result = await ReviewService.createReview(travelPlanId, reviwerId as string, rating, comment);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Review created successfully",
        data: result,
    });

})

export const ReviewController = {
    createReview,
}