import { Request } from "express";
import { prisma } from "../../lib/prisma";
import { fileUploader } from "../../helper/fileUploader";
import bcrypt from "bcrypt";
import { IOptions, paginationHelper } from "../../helper/pagination";
import { Prisma } from "../../../../prisma/generated/prisma/browser";
import { enumSearchableFields, stringSearchableFields } from "./user.constant";

const createTourist = async (req: Request) => {



    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file)
        req.body.tourist.profileImage = uploadResult?.secure_url
    }

    const hashPassword = await bcrypt.hash(req.body.password, 10);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the user
      const user = await tx.user.create({
        data: {
          email: req.body.tourist.email,
          password: hashPassword, // Consider hashing!
          role: "TOURIST", // explicit but optional
        },
      });

    
      const {
        fullName,
        bio,
        profileImage,
        interests,
        visitedCountries,
        currentLocation,
      } = req.body.tourist;

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
  } catch (error) {
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


const updateUser = async (userId: string, payload: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new Error("User not found");
  }

  

  // If the user is TOURIST, update tourist profile
  let touristProfile = null;

  if (user.role === "TOURIST") {
    touristProfile = await prisma.tourist.update({
      where: { userId },
      data: {
        fullName: payload.fullName,
        profileImage: payload.profileImage,
        currentLocation: payload.currentLocation,
        visitedCountries: payload.visitedCountries,
        interests: payload.interests,

      
        bio: payload.bio,
      }
    });
  }

  return {
    tourist: touristProfile
  };
};


export const UserService = {
  createTourist,
  getAllUsersFromDB,
  createAdmin,
  getMyProfile,
  updateUser,
};
