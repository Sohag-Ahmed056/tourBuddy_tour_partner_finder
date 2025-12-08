import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { UserService } from "./user.service";
import pick from "../../helper/pick";
import { stringSearchableFields } from "./user.constant";
import { fileUploader } from "../../helper/fileUploader";


const createTourist= catchAsync(async(req: Request, res: Response)=>{
    console.log("file",req.file);

    const result = await UserService.createTourist(req);

    sendResponse
    (res,{
        statusCode:201,
        success:true,
        message:"Tourist created successfully",
        data:result
    })

})


const createAdmin= catchAsync(async(req: Request, res: Response)=>{


    const result = await UserService.createAdmin(req);

    sendResponse
    (res,{
        statusCode:201,
        success:true,
        message:"Admin created successfully",
        data:result
    })

})




const getAllUsersFromDB = async (req: Request, res: Response) => {
  try {
  
     const filters = pick(req.query, stringSearchableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    
    // searchTerm, role, email, etc.

    // const options = {
    //   page: Number(req.query.page) || 1,
    //   limit: Number(req.query.limit) || 10,
    //   sortBy: req.query.sortBy as string,
    //   sortOrder: (req.query.sortOrder as "asc" | "desc") || "desc",
    // };

    const result = await UserService.getAllUsersFromDB(filters, options);

    // send response using your helper
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users fetched successfully",
      data: result.data,
      meta: result.meta, // include pagination info
    });
  } catch (error: any) {
    console.log("Error in getAllUsersController:", error);
  }
};

  
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;

    const result = await UserService.getMyProfile(userId);

    
    sendResponse(res, { 
        statusCode: 200,
        success: true,
        message: "User fetched successfully",
        data: result,
    }); 
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;

  // Parse payload from FormData JSON if sent as "data"
  const payload = req.body.data ? JSON.parse(req.body.data) : req.body;

  // Optional file upload
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file);
    if (uploadResult) {
      payload.profileImage = uploadResult.secure_url;
    }
  }

  const result = await UserService.updateUser(userId, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const touristId= req.body.id;

  const result = await UserService.deleteTourist(touristId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});



export const UserController = {
    createTourist,
    getAllUsersFromDB,
    createAdmin,
    getMyProfile,
    updateUser,
    deleteUser
};