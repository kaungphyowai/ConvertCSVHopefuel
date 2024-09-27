import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DATABASEHOST,
  user: process.env.DATABASEUSER,
  database: process.env.DATABASE,
  password: process.env.DATABASEPASSWORD,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default async function db(query, values) {
  const [result] = await pool.query(query, values);
  return result;
}
