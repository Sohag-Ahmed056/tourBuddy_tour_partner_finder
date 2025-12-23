import { Request, Response } from 'express';
import { ChatServices } from './chat.service';
 // Access the socket instance
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';
import { getIO } from '../../../socket';

const accessChat =catchAsync( async (req: Request, res: Response) => {
  
    const userId = req.user?.id; // From Auth Middleware
    const { travelPlanId, otherUserId } = req.body;

    const result = await ChatServices.createOrGetConversation(travelPlanId, userId as string, otherUserId);

   sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Chat created successfully",
        data: result, 
  
});

});

const sendMessage = catchAsync(async (req: Request, res: Response) => {
  
    const userId = req.user?.id;
    const { conversationId, content } = req.body;

    // 1. Save Message to Database
    const savedMessage = await ChatServices.sendMessage(conversationId, userId as string, content);

    // 2. Emit Real-time Event via Socket.io
    // This sends the message to everyone listening in this specific chat room
    const io = getIO();
    io.to(conversationId).emit('new_message', savedMessage);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Message sent successfully",
      data: savedMessage
    });
  } );


// backend/controllers/chat.controller.ts
const getMyChats = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  
  const result = await ChatServices.getMyConversations(id, userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Conversation retrieved successfully",
    data: result
  });
});

const getMyChatlist = catchAsync(async (req: Request, res: Response) => {

const userId = req.user?.id;

const result = await ChatServices.getMyChatlist(userId as string);



sendResponse(res, {

statusCode: 200,

success: true,

message: "Conversations retrieved successfully",

data: result

});

} );

export const ChatControllers = {
  accessChat,
  sendMessage,
  getMyChats,
  getMyChatlist
};