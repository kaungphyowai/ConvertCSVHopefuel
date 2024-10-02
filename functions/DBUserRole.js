// Import the db function from the db.js file
import db from "../database/db.js";

// Function for inserting data into the database
export default async function insertToUserRoleDB(walletData) {
  const result =await db("INSERT INTO UserRole (UserRole) VALUES (?)", [
    walletData,
  ]);

  return result.insertId;
}
