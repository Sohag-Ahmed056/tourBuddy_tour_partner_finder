
import { prisma } from "../../lib/prisma";

const sendJoinRequest = async(senderId: string,  id: string, message: string) => {
    const travelPlanId = id;

    const receiverTravelPlan = await prisma.travelPlan.findUnique({
        where: {
            id: travelPlanId
        },
        select: {
            touristId: true
        }
    });

    if(!receiverTravelPlan){
        throw new Error("Travel plan not found");
    }

    const receiverId = receiverTravelPlan.touristId; //userID
    if(receiverId === senderId){
        throw new Error("You cannot send a join request to your own travel plan");
    }

    const existingRequest = await prisma.joinRequest.findFirst({
        where: {
            senderId,
            receiverId,
            travelPlanId,
            status: "PENDING"
        }
    });

    if(existingRequest){
        throw new Error("A pending join request already exists for this travel plan");
    }


    //  const subscription = await prisma.subscriptionPlan.findUnique({
    //     where: { userId: senderId, isActive: true }
    // });

    // // 5️ If free user, apply limit
    // const sentCount = await prisma.joinRequest.count({
    //     where: { senderId }
    // });

    // if (!subscription && sentCount >= 10) {
    //     throw new Error("Free users can send only 10 join requests. Subscribe to send unlimited requests.");
    // }


    const joinRequest = await prisma.joinRequest.create({
        data: {
            senderId,
            receiverId,
            travelPlanId,
            message
           
        }
    });

    return joinRequest;
}


const cancelJoinRequest = async (requestId: string, userId: string) => {

    //  Find the join request
    const joinRequest = await prisma.joinRequest.findUnique({
        where: { id: requestId }
    });

    if (!joinRequest) {
        throw new Error("Join request not found");
    }

    //  Only sender can cancel
    if (joinRequest.senderId !== userId) {
        throw new Error("You are not allowed to cancel this join request");
    }

    // Only pending requests can be cancelled
    if (joinRequest.status !== "PENDING") {
        throw new Error("Only pending join requests can be cancelled");
    }

    // Delete the join request
    const deleted = await prisma.joinRequest.delete({
        where: { id: requestId }
    });

    return deleted;
};



const listSentJoinRequests = async(touristId: string) => {
    const joinRequests = await prisma.joinRequest.findMany({
        where: {
            senderId: touristId
        },
        include: {
            travelPlan: true,
            receiver: true
        }
    });

    return joinRequests;
}

const listReceivedJoinRequests = async(touristId: string) => {
    const joinRequests = await prisma.joinRequest.findMany({
        where: {
            receiverId: touristId
        },
        include: {
            travelPlan: true,
            sender: true
        }
    });

    return joinRequests;
}

const respondToJoinRequest = async(requestId: string, receiverId: string, accept: boolean) => {
    const joinRequest = await prisma.joinRequest.findUnique({
        where: {
            id: requestId
        }
    });

    if(!joinRequest){
        throw new Error("Join request not found");
    }

    if(joinRequest.receiverId !== receiverId){
        throw new Error("You are not authorized to respond to this join request");
    }

    if(joinRequest.status !== "PENDING"){
        throw new Error("This join request has already been responded to");
    }

    const updatedRequest = await prisma.joinRequest.update({
        where: {
            id: requestId
        },
        data: {
            status: accept ? "ACCEPTED" : "REJECTED"
        }
    });

    return updatedRequest;
}



export const joinRequestService={
    sendJoinRequest,
    listSentJoinRequests,
    listReceivedJoinRequests,
    respondToJoinRequest,
    cancelJoinRequest
}