import express from 'express';
const router = express.Router();

import { verifyToken } from '../middlewares/auth.middleware';
import { logger } from '../middlewares/logger.middleware';
import { getAllUsers, 
    getConversationIdFromChatterId,
    getConversationDetails
 } from '../controllers/chatapp.controller';

router.get('/getusers', [verifyToken],  getAllUsers);

router.get('/getconversation', [verifyToken], getConversationIdFromChatterId);

router.get('/getconversationdetails', [verifyToken], getConversationDetails);

const appRouter = router;
export default appRouter;