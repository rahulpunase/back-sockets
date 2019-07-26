import { isUserActive } from '../permissions/permissions.controller';
import { logger } from '../../middlewares/logger.middleware';
import uniqid from 'uniqid';

export const transaction = {
    "START_TRANSACTION" : async (connection) => {
        return await connection.query("START TRANSACTION");
    },
    "ROLLBACK_TRANSACTION": async (connection) => {
        logger("<--- ROLLING BACK --->");
        return await connection.query("ROLLBACK");
    },
    "COMMIT_TRANSACTION": async (connection) => {
        return await connection.query("COMMIT");
    }
}


/** 
 * Checks if the given @field is empty
 * @field
 * @res
 * @fieldname
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
        if (print)
            logger(" => " + sql);
        return await connection.query(sql);
    } catch (e) {
        throw new Error(e);
    }
}

/**
 * 
 */
const createGroupForTwo = async (connection) => {
    const groupId = uniqid("grp_");
    try {
        let query = "INSERT INTO `new_schema_test`.`group` (`groupId`, `name`, `createdAt`, `isActive`) VALUES (?, '--ONE-TO-ONE--', now(), 1)";
        const res = await sqlFormatter(connection, query, [groupId], false);
        return groupId;
    } catch(e) {
        throw new Error(e);
    }
}

const ifGroupDoesntExists = async (connection, users) => {
    try {
        const query = "select groupId, count(groupId) as groupNo  from `user_group` where userId in (?, ?) group by groupId having groupNo > 1";
        let [rows] = await sqlFormatter(connection, query, users, false);
        if(rows.length > 0) {
            return rows[0].groupId;
        } else {
            return false;
        }
    } catch (e) {
        throw new Error(e);
    }
}

export const insertUsersToTheGroup = async (connection, users) => {
    let groupId;
    try {
        groupId = await ifGroupDoesntExists(connection, users);
        if(!groupId) {
            // if group doesn't exists ...
            const _groupId = await createGroupForTwo(connection);
            const vals = "(?, '" + _groupId + "', now(), 1)";
            const comma = ", ";
            let query = "INSERT INTO `new_schema_test`.`user_group` (`userId`, `groupId`, `createdAt`, `isActive`) VALUES ";
            users.forEach(function(user, i) {
                if(i === users.length - 1) {
                    // last
                    query += vals;
                } else {
                    query += vals + comma;
                }
            });
            await sqlFormatter(connection, query, users, true);
            return _groupId;
        } else {
            return groupId;
        }
    } catch(e) {
        throw new Error(e);
    }
}

export const createConversationWithGroup = async (connection, groupId) => {
    return "sdjsdbabsdiasdalsd";
}