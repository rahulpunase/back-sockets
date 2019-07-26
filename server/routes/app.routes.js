import express from 'express';
const router = express.Router();

import { verifyToken } from '../middlewares/auth.middleware';
import { logger } from '../middlewares/logger.middleware';
import { getAllUsers, getUserInfoFromId } from '../controllers/chatapp.controller';

router.get('/getusers', [verifyToken],  getAllUsers);

router.get('/getuserinfo', [verifyToken], getUserInfoFromId)

const appRouter = router;
export default appRouter;