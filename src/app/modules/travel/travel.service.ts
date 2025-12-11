import ApiError from "../../error/appError.js";
import { prisma } from "../../lib/prisma.js";


 const createTour = async ({ payload, touristId }: { payload: any; touristId: string }) => {
    
    const subscription = await prisma.subscriptionPlan.findUnique({
        where: { userId: touristId, isActive: true },
    });

    // 2️⃣ Count user travel plans
    const travelCount = await prisma.travelPlan.count({
        where: { touristId },
    });

    // 3️⃣ If user has no subscription and more than 3 plans -> block
    if (!subscription && travelCount >= 3) {
        throw new Error("Free users can create only 3 travel plans. Please subscribe to continue.");
    }
    
  
// 4️⃣ Create travel plan
    const result = await prisma.travelPlan.create({
        data: {
            title: payload.title,
            destination: payload.destination,
            city: payload.city,
            startDate: new Date(payload.startDate),   // FIX
            endDate: new Date(payload.endDate),       // FIX
            budgetMin: payload.budgetMin,
            budgetMax: payload.budgetMax,
            travelType: payload.travelType,
            description: payload.description,
            visibility: payload.visibility,
            touristId
        }
    });
    return result;
}


// const getAllTours = async () => {
//     const result = await prisma.travelPlan.findMany({
//         include: {
//             tourist: {
//                 include: {
//                     user: true
//                 }
//             }
//         }
//     });

//     return result;
// };


const getAllTours = async (filters?: {
    destination?: string;
    city?: string;
    travelType?: string;
    budgetMin?: number;
    budgetMax?: number;
    startDate?: Date;
    endDate?: Date;
    search?: string;
}) => {
    const where: any = {
        visibility: true, // Only show visible travel plans
    };

    // Apply search filter (searches across multiple fields)
    if (filters?.search) {
        where.OR = [
            { title: { contains: filters.search, mode: 'insensitive' } },
            { destination: { contains: filters.search, mode: 'insensitive' } },
            { city: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
            {
                tourist: {
                    fullName: { contains: filters.search, mode: 'insensitive' }
                }
            }
        ];
    }

    // Apply specific filters
    if (filters?.destination) {
        where.destination = { contains: filters.destination, mode: 'insensitive' };
    }

    if (filters?.city) {
        where.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters?.travelType) {
        where.travelType = filters.travelType;
    }

    // Budget range filter
    if (filters?.budgetMin !== undefined || filters?.budgetMax !== undefined) {
        where.AND = where.AND || [];
        
        if (filters.budgetMin !== undefined) {
            where.AND.push({
                OR: [
                    { budgetMin: { gte: filters.budgetMin } },
                    { budgetMax: { gte: filters.budgetMin } }
                ]
            });
        }

        if (filters.budgetMax !== undefined) {
            where.AND.push({
                OR: [
                    { budgetMin: { lte: filters.budgetMax } },
                    { budgetMax: { lte: filters.budgetMax } }
                ]
            });
        }
    }

    // Date range filters
    if (filters?.startDate) {
        where.startDate = { gte: filters.startDate };
    }

    if (filters?.endDate) {
        where.endDate = { lte: filters.endDate };
    }

    const result = await prisma.travelPlan.findMany({
        where,
        include: {
            tourist: {
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                            // Don't include password
                        }
                    }
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return result;
};







const getSingleTour = async (id: string) => {
  const result = await prisma.travelPlan.findUnique({
    where: { id },
    include: {
      tourist: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(404,"Travel plan not found");
  }

  return result;
};


const updateTravelPlan = async ({
  travelPlanId,
  touristId,
  payload,

}: {
  travelPlanId: string;
  touristId: string;
  payload: any;
}) => {
  //1 Check user subscription
  const subscription = await prisma.subscriptionPlan.findUnique({
    where: { userId: touristId, isActive: true },
  });

  // 2 Count user travel plans
  const travelCount = await prisma.travelPlan.count({
    where: { touristId },
  });

  // 3 Free users → max 3 plans
  if (!subscription && travelCount >= 5) {
    throw new Error(
      "Free users can update only 3 travel plans. Please subscribe to continue."
    );
  }

  // 4 Ensure travel plan exists
  const existingPlan = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId },
  });

  if (!existingPlan) {
    throw new Error("Travel plan not found.");
  }

  // 5 Ensure ownership
  if (existingPlan.touristId !== touristId) {
    throw new Error("Unauthorized: You can update only your own travel plans.");
  }

  // 6 Perform partial update
  const updated = await prisma.travelPlan.update({
    where: { id: travelPlanId },
    data: {
      title: payload.title ?? existingPlan.title,
      destination: payload.destination ?? existingPlan.destination,
      city: payload.city ?? existingPlan.city,
      startDate: payload.startDate
        ? new Date(payload.startDate)
        : existingPlan.startDate,
      endDate: payload.endDate
        ? new Date(payload.endDate)
        : existingPlan.endDate,
      budgetMin: payload.budgetMin ?? existingPlan.budgetMin,
      budgetMax: payload.budgetMax ?? existingPlan.budgetMax,
      travelType: payload.travelType ?? existingPlan.travelType,
      description: payload.description ?? existingPlan.description,
      visibility: payload.visibility ?? existingPlan.visibility,
    },
  });

  return updated;
};


const deleteTravelPlan = async (
  travelPlanId: string,
  userId: string
) => {

  const existingPlan = await prisma.travelPlan.findUnique({
    where: { id: travelPlanId }
  });

  if (!existingPlan) {
    throw new Error("Travel plan not found");
  }

  if (existingPlan.touristId !== userId) {
    throw new Error("You are not allowed to delete this travel plan");
  }

  // OPTIONAL: Delete related join requests
  await prisma.joinRequest.deleteMany({
    where: { travelPlanId }
  });
  await prisma.review.deleteMany({
  where: { tripId: travelPlanId }
});


  // Delete the travel plan
  const deletedPlan = await prisma.travelPlan.delete({
    where: { id: travelPlanId }
  });

  return deletedPlan;
};


export const TravelService = {
    createTour,
    getAllTours,
    updateTravelPlan,
    deleteTravelPlan,
    getSingleTour,
}