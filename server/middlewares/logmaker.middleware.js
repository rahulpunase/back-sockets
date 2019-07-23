import { logger } from '../middlewares/logger.middleware';

export const logMaker = (req, res, next) => {
    if(req.originalUrl)
        logger("ORIGINAL URL:=> " + req.originalUrl);
    if(req.path)
        logger("PATH:=> "+req.path);
    next();    
}