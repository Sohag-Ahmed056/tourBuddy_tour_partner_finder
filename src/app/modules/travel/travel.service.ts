import { prisma } from "../../lib/prisma";


export const createTour = async ({ payload, touristId }: { payload: any; touristId: string }) => {
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


export const TravelService = {
    createTour,
    getAllTours,
}