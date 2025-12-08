import { Request, Response } from "express";


import catchAsync from "../../shared/catchAsync.js";
import { TouristService } from "./tourist.service.js";
import sendResponse from "../../shared/sendResponse.js";
import { touristFilterableFields } from "./tourist.constant.js";
import pick from "../../helper/pick.js";

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, touristFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await TouristService.getAllFromDB(filters, options);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tourist retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await TouristService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tourist fetched successfully',
        data: result,
    });
});

const deleteTouristFromDB = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await TouristService.deleteTourist(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tourist deleted successfully',
        data: result,
    });
});


export const TouristController = {
    getAllFromDB,
    getByIdFromDB,
    deleteTouristFromDB,
}