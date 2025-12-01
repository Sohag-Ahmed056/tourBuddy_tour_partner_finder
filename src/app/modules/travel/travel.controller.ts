import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { TravelService } from "./travel.service";
import sendResponse from "../../shared/sendResponse";

const createTour = catchAsync(async (req: Request, res: Response) => {
    const touristId= req.user?.id as string;
    console.log(touristId);
    const payload = req.body;

    const result = await TravelService.createTour({ payload, touristId });

    res.status(201).json({
        statusCode: 201,
        success: true,
        message: "Travel plan created successfully",
        data: result,
    });
});


const getAllTravelPlans = catchAsync(async (req: Request, res: Response) => {
    const result = await TravelService.getAllTours();

   sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Travel plans retrieved successfully",
        data: result,
    });
});
export const TravelController = {
    createTour,
    getAllTravelPlans,
}