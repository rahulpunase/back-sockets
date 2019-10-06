import { isUserActive } from '../permissions/permissions.controller';
import { logger } from '../../middlewares/logger.middleware';
/** 
 * Checks if the given @field is empty
 * @field
 * @res
 * @fieldName
 * 
*/
export function emptyCheck(field, res, fieldName) {
    if (field === null || field === "" || field === undefined) {
        res.json({
            success: false,
            errorMessage: fieldName + " is not provided"
        });
    }
    return;
}
/** 
 * This function fetches the user data from db
 * parameters required
 * @connection
 * @userId
 * @username
 * @details
 * @next
 * 
*/
export const fetchUserData = async (connection, userId, userName, details, res) => {
    try {
        if (await isUserActive(connection, userName, res)) {
            const QUERY = "SELECT `userLoginId`, `userId`, `userName`, `email` FROM " +
                "`new_schema_test`.`user_login` where userName = ? and userId = ?";
            const QUERY_WITH_DETAILS = "";
            const [rows, fields] = await connection.query(QUERY, [userName, userId]);
            return rows;
        }
    } catch (e) {
        throw new Error(e);
    }
}
/** 
 * This function fetches the user data from db
 * parameters required
 * @connection = connection object
 * @query = string
 * @options = []
 * @print = boolean
 * 
*/
export const sqlFormatter = async (connection, query, options, print) => {
    try {
        const sql = connection.format(query, 
            options);
        if(print)    
            logger(" => " + sql);
        return await connection.query(sql);
    } catch(e) {
        throw new Error(e);
    }
}