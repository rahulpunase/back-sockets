import { pool } from '../db/connection.db';
import passwordHash from 'password-hash';
import uniqid from 'uniqid';
import { emptyCheck, sqlFormatter } from './common/controllers.common';
import jsonwebtoken from 'jsonwebtoken';
import { logger } from '../middlewares/logger.middleware';
import { isUserActive, isEmailVerified } from '../controllers/permissions/permissions.controller';
import { reg, DEFAULT_IMAGEPATH, QUERY_TO_CHECKEMAIL, QUERY_TO_USERNAME, QUERY_TO_MATCH, erMsg } from '../queries/queries';

export const registerUser = async (req, res, next) => {
    let connection = null;
    let sql = "";
    try {
        connection = await pool.getConnection();
        const { firstName, lastName, username, email, password } = req.body;

        emptyCheck(firstName, res, 'First Name');
        emptyCheck(lastName, res, 'Last Name');
        emptyCheck(username, res, 'Username');
        emptyCheck(email, res, 'Email');
        emptyCheck(password, res, 'Password');

        const uid = uniqid();
        const uLid = uniqid("ulid");
        const detailId = uniqid("did");
        await connection.query("START TRANSACTION");

        await sqlFormatter(connection, reg.QUERY_FOR_USERS, [uid, 'Mr', firstName, lastName], true);
        await sqlFormatter(connection, reg.QUERY_FOR_USERLOGIN, 
            [uLid, uid, username, email, passwordHash.generate(password)], true);
        await sqlFormatter(connection, reg.QUERY_FOR_USERDETAILS, 
            [detailId, uid, email, "", "", "", "", DEFAULT_IMAGEPATH, 1, ""], true);
        
        await connection.query("COMMIT");
        res.json({ success: true })
    }
    catch (e) {
        Object.assign(e, { ROLLBACK: true });
        logger("ROLLING BACK");
        await connection.query("ROLLBACK");
        next(e)
    }
}

export const loginUser = async (req, res, next) => {
    let connection = null;
    try {
        connection = await pool.getConnection();
        const { username, password } = req.body;
        logger("Trying to login => " + username);
        emptyCheck(username, res, 'User Name');
        emptyCheck(password, res, 'Password');

        if (await isUserActive(connection, username, res)) {
                await connection.query("START TRANSACTION");
                const [rows, fields] = await connection.query(QUERY_TO_MATCH, [username]);
                await connection.query("COMMIT");
                if (rows.length > 0) {
                    if (passwordHash.verify(password, rows[0].password)) {
                        logger("Logged in successfully => " + username);
                        const user = rows[0];
                        const token = jsonwebtoken.sign({
                            exp: Math.floor(Date.now() / 1000) + (60 * 60),
                            data: {
                                userLoginId: user.userLoginId,
                                userId: user.userId,
                                userName: user.userName,
                                email: user.email
                            }
                        }, 'picarts');
                        connection.release();
                        res.json({
                            token: token,
                            success: true,
                            loggedIn: true,
                            message: "User logged in",
                        })
                    } else {
                        connection.release();
                        res.json({
                            success: true,
                            loggedIn: false,
                            message: erMsg.dnm
                        })
                    }
                } else {
                    connection.release();
                    res.json({
                        success: true,
                        loggedIn: false,
                        message: "Username is not found"
                    })
                }
        } // isUserActive
    } catch (e) {
        await connection.query("ROLLBACK");
        connection.release();
        next(e);
    }
}

