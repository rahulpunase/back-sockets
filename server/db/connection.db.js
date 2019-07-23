const mysql = require('mysql2/promise');
import { config } from '../db/config.db';
export const pool = mysql.createPool(config);
