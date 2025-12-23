import { Request } from "express";
import { prisma } from "../../lib/prisma.js";
import { fileUploader } from "../../helper/fileUploader.js";
import bcrypt from "bcrypt";
import { IOptions, paginationHelper } from "../../helper/pagination.js";

import { stringSearchableFields } from "./user.constant.js";

import ApiError from "../../error/appError.js";
import { Prisma } from "@prisma/client";






const createTourist = async (req: Request) => {

  // Parse nested data from FormData
  const body = req.body.data ? JSON.parse(req.body.data) : req.body;

  // Optional file upload
  if (req.file) {
    const uploadResult = await fileUploader.uploadToCloudinary(req.file)
    body.tourist.profileImage = uploadResult?.secure_url
  }

  const hashPassword = await bcrypt.hash(body.password, 10);

  try {
    const result = await prisma.$transaction(async (tx: any) => {

      // Create User
      const user = await tx.user.create({
        data: {
          email: body.tourist.email,
          password: hashPassword,
          role: "TOURIST",
        },
      });

      const {
        fullName,
        bio,
        profileImage,
        interests,
        visitedCountries,
        currentLocation,
      } = body.tourist;

      // Create Tourist
      const tourist = await tx.tourist.create({
        data: {
          userId: user.id,
          fullName,
          bio,
          profileImage,
          interests: interests || [],
          visitedCountries: visitedCountries || [],
          currentLocation,
        },
      });

      return { user, tourist };
    });

    return result;
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("Email already exists");
    }

    console.error("Error creating tourist:", error);
    throw error;
  }
};



const createAdmin = async (req: Request) => {
  const hashPassword = await bcrypt.hash(req.body.password, 10);

  const user = await prisma.user.create({
    data: {
      email: req.body.email,
      password: hashPassword, // Consider hashing!
      role: "ADMIN", // explicit but optional
    },
  });

  return user;
}





const getAllUsersFromDB = async (params: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  // Search only in string fields
  if (searchTerm) {
    andConditions.push({
      OR: stringSearchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  // Filters (exact match)
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: { equals: filterData[key] },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  // Fetch users
  const result = await prisma.user.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy: {
      [sortBy || "createdAt"]: sortOrder || "desc",
    },
    include: {
      tourist: true,
      admin: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

 const getMyProfile = async (userId: string) => {
    // Find basic user
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // If Tourist — return tourist-specific profile
    if (user.role === "TOURIST") {
        const tourist = await prisma.tourist.findUnique({
            where: { userId: user.id },
            include: {
                travelPlans: true,
                reviewsReceived: true,
                joinRequestsReceived:true,
                 joinRequestsSent: true,
                subscription: true,
                 _count: {
                    select: {
                        reviewsReceived: true
                    }
                }
            }
        });

        return {
            ...user,
            profile: tourist
        };
    }

    // If Admin — return admin profile
    if (user.role === "ADMIN") {
        const admin = await prisma.admin.findUnique({
            where: { userId: user.id },
        });

        return {
            ...user,
            profile: admin
        };
    }

    // Default fallback
    return user;
};



// Get single profile
 const getSingleProfile = async (userId: string) => {
    // Find basic user
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    // If Tourist — return tourist-specific profile
    if (user.role === "TOURIST") {
        const tourist = await prisma.tourist.findUnique({
            where: { userId: user.id },
            include: {
                travelPlans: true,
                reviewsReceived: {
                    include: {
                        reviewer: {
                            include: { user: true },
                        },
                    },
                },
                joinRequestsReceived: true,
                joinRequestsSent: true,
                subscription: true,
                _count: {
                    select: {
                        reviewsReceived: true,
                    },
                },
            },
        });

        return {
            ...user,
            profile: tourist,
            totalReviewCount: tourist?._count.reviewsReceived || 0,
            reviews: tourist?.reviewsReceived || []
        };
    }

    // For other roles, simply return the user
    return user;
};

const updateUser = async (userId: string, payload: any) => {

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404,"User not found");
  }

  // Only update tourist profile if the user is a TOURIST
  let touristProfile = null;

  if (user.role === "TOURIST") {
    // Build the update object dynamically
    const updateData: any = {
      fullName: payload.fullName,
      bio: payload.bio,
      currentLocation: payload.currentLocation,
      visitedCountries: payload.visitedCountries,
      interests: payload.interests,
    };
      
    console.log(payload.profileImage);
    // Only set profileImage if it's provided
    if (payload.profileImage) {
      updateData.profileImage = payload.profileImage;
    }

    touristProfile = await prisma.tourist.update({
      where: { userId },
      data: updateData,
    });
  }

  return { tourist: touristProfile };
};

const deleteTourist = async (touristId: string) => {

  
  const deletedTourist = await prisma.tourist.delete({
    where: { id: touristId },
  });
  return deletedTourist;
};


export const UserService = {
  createTourist,
  getAllUsersFromDB,
  createAdmin,
  getMyProfile,
  updateUser,
  deleteTourist,
  getSingleProfile
};
