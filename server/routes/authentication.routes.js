const express = require('express');
const router = express.Router();
import { logMaker } from '../middlewares/logmaker.middleware';
import { registerUser, loginUser } from '../controllers/authentication.controllers';

router.post("/registeruser", [logMaker], registerUser);
router.post("/loginuser", [logMaker], loginUser);

export default router;