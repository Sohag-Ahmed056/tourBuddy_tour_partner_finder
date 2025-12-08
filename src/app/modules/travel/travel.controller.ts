import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { TravelService } from "./travel.service";
import sendResponse from "../../shared/sendResponse.js";

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

const getSingleTravelPlan = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await TravelService.getSingleTour(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Travel plan retrieved successfully",
    data: result,
  });
});


const updateTravelPlan = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const payload = req.body;   

    const result = await TravelService.updateTravelPlan({ travelPlanId: id, touristId: req.user?.id as string, payload });

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Travel plan updated successfully",
        data: result,
    });
}); 

const deleteTravelPlan = catchAsync(async (req: Request, res: Response) => {    
    const id = req.params.id; 
    const userId = req.user?.id as string;


    const result = await TravelService.deleteTravelPlan(id, userId);   

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Travel plan deleted successfully",
        data: result,
    });
});     




export const TravelController = {
    createTour,
    getAllTravelPlans,
    updateTravelPlan,
    deleteTravelPlan,
    getSingleTravelPlan
}