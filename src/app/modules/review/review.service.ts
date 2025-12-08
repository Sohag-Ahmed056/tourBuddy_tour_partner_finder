import { prisma } from "../../lib/prisma.js";

const createReview= async(travelPlanId:string, reviwerId:string, rating:number, comment:string)=>{

    const reviewer = await prisma.tourist.findUnique({
        where:{
            userId:reviwerId
        }
    });

    if(!reviewer){
        throw new Error("Reviewer not found");
    }

    const travelPlan = await prisma.travelPlan.findUnique({
        where:{
            id:travelPlanId
        },
        include:{
            tourist:true
        }
    });


    if(!travelPlan){
        throw new Error("Travel plan not found");
    }
    
    const targetId = travelPlan.tourist.userId;

    if(targetId === reviwerId){
        throw new Error("You cannot review your own travel plan");
    }

    const existingReview = await prisma.review.findFirst({
        where: {
             reviewerId: reviwerId,
             tripId: travelPlanId,
        }
    });
    if(existingReview){
        throw new Error("You have already reviewed this travel plan");
    }
    
    const review = await prisma.review.create({
        data:{
            reviewerId:reviwerId,
            targetId:targetId,
            tripId:travelPlanId,
            rating,
            comment,
        }
    });

    return review;

}

export const ReviewService = {
    createReview,
}