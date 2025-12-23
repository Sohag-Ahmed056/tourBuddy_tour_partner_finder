import { prisma } from "../../lib/prisma";


const createOrGetConversation = async (travelPlanId: string, currentUserId: string, otherUserId: string) => {
  
  // Sort IDs to ensure A is always < B (prevents duplicate chats like A-B and B-A)
  const [participantAId, participantBId] = [currentUserId, otherUserId].sort();

  // 1. Check if conversation already exists
  let conversation = await prisma.conversation.findFirst({
    where: {
      travelPlanId,
      participantAId,
      participantBId,
    },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      participantA: { select: { fullName: true, profileImage: true, userId: true } },
      participantB: { select: { fullName: true, profileImage: true, userId: true } },
    },
  });

  if (conversation) {
    return conversation;
  }

  // 2. Security Check: Ensure JoinRequest is ACCEPTED
  const hasAcceptedRequest = await prisma.joinRequest.findFirst({
    where: {
      travelPlanId,
      status: 'ACCEPTED',
      OR: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId }
      ]
    }
  });

  if (!hasAcceptedRequest) {
    throw new Error('Access denied: You can only chat after a Join Request is accepted.');
  }

  // 3. Create new conversation
  conversation = await prisma.conversation.create({
    data: {
      travelPlanId,
      participantAId,
      participantBId,
    },
    include: {
      messages: true,
      participantA: { select: { fullName: true, profileImage: true, userId: true } },
      participantB: { select: { fullName: true, profileImage: true, userId: true } },
    }
  });

  return conversation;
};

const sendMessage = async (conversationId: string, senderId: string, content: string) => {
  // 1. Create the message
  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      content
    },
    include: {
      sender: { select: { fullName: true, profileImage: true, userId: true } }
    }
  });

  // 2. IMPORTANT: Update the conversation's updatedAt timestamp
  // This moves the conversation to the top of the inbox
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() } 
  });

  return message;
};

// backend/services/chat.service.ts
const getMyConversations = async (conversationId: string, userId: string) => {
  const result = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      // Remove 'take: 1' here to get all history
      messages: {
        orderBy: { createdAt: 'asc' } 
      },
      participantA: { select: { fullName: true, profileImage: true, userId: true } },
      participantB: { select: { fullName: true, profileImage: true, userId: true } },
      travelPlan: { select: { id: true, title: true } }
    },
  });

  // Security: Check if user belongs to this chat
  if (result && result.participantAId !== userId && result.participantBId !== userId) {
    throw new Error("Unauthorized access");
  }

  return result;
};

const getMyChatlist = async (userId: string) => {

return await prisma.conversation.findMany({

where: {

OR: [

{ participantAId: userId },

{ participantBId: userId }

]

},

include: {

messages: {

take: 1,

orderBy: { createdAt: 'desc' }

},

participantA: { select: { fullName: true, profileImage: true, userId: true } },

participantB: { select: { fullName: true, profileImage: true, userId: true } },

travelPlan: { select: { id: true, title: true, destination: true } }

},

orderBy: { updatedAt: 'desc' }

});

};

export const ChatServices = {
  createOrGetConversation,
  sendMessage,
  getMyConversations,
  getMyChatlist
};