import express from 'express';
const router = express.Router();

import { pool } from '../db/connection.db';

router.get('/getusers', async function (req, res, next) {
    let connection = null;
     try {
        const query = "SELECT u.`firstName`, u.`lastName`, l.`userLoginId`, l.`userId`, l.`userName`, l.`email` FROM `new_schema_test`.`user_login` l  inner join `new_schema_test`.`users` u on u.userId = l.userId where l.`rowstate` = 1";
        connection = await pool.getConnection();
        const sql = connection.format(query);
        const [rows, fields] = await connection.query(sql)
        connection.release();
        res.json(rows);
     } catch (e) {
        connection.release();
        next(e);
         //res.json(e);
     }
});

const appRouter = router;
export default appRouter;