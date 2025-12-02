import { prisma } from "../../lib/prisma";


export const createTour = async ({ payload, touristId }: { payload: any; touristId: string }) => {
    
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


const getAllTours = async () => {
    const result = await prisma.travelPlan.findMany({
        include: {
            tourist: {
                include: {
                    user: true
                }
            }
        }
    });

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
  // 1 Check user subscription
  const subscription = await prisma.subscriptionPlan.findUnique({
    where: { userId: touristId, isActive: true },
  });

  // 2 Count user travel plans
  const travelCount = await prisma.travelPlan.count({
    where: { touristId },
  });

  // 3 Free users → max 3 plans
  if (!subscription && travelCount >= 3) {
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
}