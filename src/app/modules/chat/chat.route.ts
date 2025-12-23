import express from 'express';
import { ChatControllers } from './chat.controller';
import auth from '../../middlewares/auth'; // Your existing auth middleware
import { UserRole } from '@prisma/client';



const router = express.Router();

// Initialize or Retrieve a chat (Requires 'otherUserId' and 'travelPlanId')
router.post(
  '/access', 
  auth(UserRole.TOURIST), 
  ChatControllers.accessChat
);

// Send a message
router.post(
  '/message', 
  auth(UserRole.TOURIST), 
  ChatControllers.sendMessage
);

// Get list of all my conversations
router.get(
  '/my-chats/:id', 
  auth(UserRole.TOURIST), 
  ChatControllers.getMyChats
);
router.get(
  '/chat-list', 
  auth(UserRole.TOURIST), 
  ChatControllers.getMyChatlist
);

export const ChatRoutes = router;