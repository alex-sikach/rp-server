import pg from 'pg';
// @ts-ignore
import * as dotenv from 'dotenv';
dotenv.config();
const pool = new pg.Pool({
    "connectionString": process.env.DB_CONNECTION_STRING,
    "ssl": { rejectUnauthorized: false }
});
export default pool;
