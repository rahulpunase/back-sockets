import { pool } from '../db/connection.db';
import { insertUsersToTheGroup, transaction, createConversationWithGroup, sqlFormatter, getUserInfoFromId } from '../controllers/common/controllers.common';

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

export const getConversationIdFromChatterId = async (req, res, next) => {
   let connection = null;
   let groupId;
   let conversationId;
   let chatterInfo;
   try {
      // -------- //
      const users = [
         req.decoded.data.userId,
         req.query.chatterId
      ];
      connection = await pool.getConnection();
      await transaction.START_TRANSACTION(connection);
      chatterInfo = await getUserInfoFromId(connection, users[1]);
      groupId = await insertUsersToTheGroup(connection, users);
      conversationId = await createConversationWithGroup(connection, groupId);
      await transaction.COMMIT_TRANSACTION(connection);
      // -------- //
      connection.release();
      if (chatterInfo) {
         res.json({
            success: true,
            groupId: groupId,
            chatterInfo: chatterInfo,
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

export const getConversationDetails = async (req, res, next) => {
   try {
      const conversationId = req.query.conversationId;
      let chatterInfo;
      let connection = null;
      connection = await pool.getConnection();
      const query = "select `userId` from `user_group` where groupId = (select groupId from `conversation` where cnID = ?) and `userId` != ?";
      const [rows] = await sqlFormatter(connection, query, [conversationId, req.decoded.data.userId], true);
      chatterInfo = await getUserInfoFromId(connection, rows[0].userId);
      connection.release();
      res.json({
         chatterInfo: chatterInfo
      })
   } catch(e) {
      connection.release();
      next(e);
   }
}

