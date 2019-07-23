import { QUERY_TO_USER, errorType } from '../../queries/queries';
import { logger } from '../../middlewares/logger.middleware';
export const isUserActive = async (connection, username, res) => {
    try {
        const [rows, fields] = await connection.execute(QUERY_TO_USER, [username]);
        if(rows[0].user > 0) {
            return true;
        } else {
            connection.release();
            res.status(401).json({
                message: "User is inactive",
                error: errorType.USER_INACTIVE
            });
        }
    } catch (e) {
        throw new Error(e);
    }
}
export const isEmailVerified = async (connection, username, res) => {
    try {
        const QUERY_TO_VERIFY_EMAILUSER = "SELECT `isEmailVerified` as isEmailVerified from user_login where `username` = ?"
        const [rows, fields] = await connection.execute(QUERY_TO_VERIFY_EMAILUSER, [username]);
        if(rows[0].isEmailVerified == 1) {
            return true;
        } else {
            connection.release();
            logger("")
            res.status(200).json({
                success: true,
                loggedIn: false,
                error: errorType.EMAIL_NOT_VERIFIED,
                message: "Your Email is not verified"
            });
        }
    } catch (e) {
        throw new Error(e);
    }
}