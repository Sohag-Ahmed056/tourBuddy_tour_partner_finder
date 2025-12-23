import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync.js";
import { TravelService } from "./travel.service.js";
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


// const getAllTravelPlans = catchAsync(async (req: Request, res: Response) => {
//     const result = await TravelService.getAllTours();

//    sendResponse(res, {
//         statusCode: 200,
//         success: true,
//         message: "Travel plans retrieved successfully",
//         data: result,
//     });
// });



const getAllTravelPlans = catchAsync(async (req: Request, res: Response) => {
    const { 
        destination, 
        city, 
        travelType, 
        budgetMin, 
        budgetMax, 
        startDate, 
        endDate,
        search 
    } = req.query;

    // Build filters object
    const filters: any = {};

    if (search) {
        filters.search = search as string;
    }

    if (destination) {
        filters.destination = destination as string;
    }

    if (city) {
        filters.city = city as string;
    }

    if (travelType) {
        filters.travelType = travelType as string;
    }

    if (budgetMin) {
        filters.budgetMin = parseInt(budgetMin as string);
    }

    if (budgetMax) {
        filters.budgetMax = parseInt(budgetMax as string);
    }

    if (startDate) {
        filters.startDate = new Date(startDate as string);
    }

    if (endDate) {
        filters.endDate = new Date(endDate as string);
    }

    // Pass filters to service (if no filters provided, it returns all)
    const result = await TravelService.getAllTours(
        Object.keys(filters).length > 0 ? filters : undefined
    );

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

const getAITourSuggestions = catchAsync(async (req: Request, res: Response) => {
    const { preferences } = req.body;

    // 1. Validation: Ensure the user provided travel preferences
    // if (!preferences || typeof preferences !== 'string' || preferences.trim().length < 5) {
    //     return res.status(400).json({
    //         success: false,
    //         message: 'Please provide valid travel preferences (e.g., destination, budget, or activities).',
    //     });
    // }

    // 2. Call the service logic we created earlier
    const result = await TravelService.getAITourSuggestion({ 
        preferences: preferences.trim() 
    });

    // 3. Send the response back to the client
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'AI tour suggestions retrieved successfully',
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
    getSingleTravelPlan,
    getAITourSuggestions
}