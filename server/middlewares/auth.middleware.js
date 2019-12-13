import jsonwebtoken from 'jsonwebtoken';
import { logger } from '../middlewares/logger.middleware';
export function verifyToken(req, res, next) {
    const AuthHeader = req.headers.authorization;
    if(!AuthHeader) {
        logger([
            "Authentication failed due to no token provided.",
            "URL String =>" + req.originalUrl
        ]);
        res.status(401).json({
            message: "No token provided"
        })
    } else {
        const token = AuthHeader.substring(7, AuthHeader.length);
        jsonwebtoken.verify(token, 'picarts', function (err, decoded) {
            if(err) {
                logger([
                    "Authentication failed due token error.",
                    "URL String =>" + req.originalUrl
                ]);
                res.status(401).json({
                    message: "Incorrect token"
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
}