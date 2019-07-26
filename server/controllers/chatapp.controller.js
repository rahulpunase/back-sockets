import { pool } from '../db/connection.db';
import { insertUsersToTheGroup, transaction, createConversationWithGroup } from '../controllers/common/controllers.common';

export const getAllUsers = async (req, res, next) => {
   let connection = null;
   try {
      const query = "SELECT u.`firstName`, u.`lastName`, l.`userLoginId`, l.`userId`, l.`userName`, l.`email` FROM `new_schema_test`.`user_login` l  inner join `new_schema_test`.`users` u on u.userId = l.userId where l.`rowstate` = 1 and l.`userId`!=?";
      connection = await pool.getConnection();
      const sql = connection.format(query, [req.decoded.data.userId]);
      //   logger("SQL GET USERS =>" + sql)
      const [rows, fields] = await connection.query(sql)
      connection.release();
      res.json(rows);
   } catch (e) {
      connection.release();
      next(e);
      //res.json(e);
   }
}

export const getUserInfoFromId = async (req, res, next) => {
   let connection = null;
   let groupId;
   let conversationId;
   try {
      const query = "SELECT u.`firstName`, u.`lastName`, l.`userId` FROM `new_schema_test`.`user_login` l  inner join `new_schema_test`.`users` u on u.userId = l.userId where l.`rowstate` = 1 and l.`userId`= ?";
      connection = await pool.getConnection();
      const users = [
         req.decoded.data.userId,
         req.query.chatterId
      ];
      const sql = connection.format(query, [users[1]]);
      // -------- //
      await transaction.START_TRANSACTION(connection);
      const [rows] = await connection.query(sql);

      groupId = await insertUsersToTheGroup(connection, users);
      conversationId =  await createConversationWithGroup(connection, groupId);

      await transaction.COMMIT_TRANSACTION(connection);
      // -------- //
      if (rows.length > 0) {
         res.json({
            success: true,
            result: rows[0],
            groupId: groupId,
            conversationId: conversationId
         })
      } else {
         res.json({
            succeess: false,
            message: "No user found"
         })
      }
   } catch (e) {
      await transaction.ROLLBACK_TRANSACTION(connection);
      connection.release();
      next(e);
   }
}