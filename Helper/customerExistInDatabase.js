
import db from "../database/db.js";
export default async function customerExistInDatabase(username, email) {
    try {
        // Query to find the user with the given username and email
        const rows = await db(
            'SELECT * FROM Customer WHERE Name = ? AND Email = ?',
            [username, email]
        );

        // Check if a user was found
        if (rows.length > 0) {
            // Return the user row
            return rows[0]
        } else {
            return "false"; // No user found
        }
    } catch (error) {
        console.error('Error checking user:', error);
        return false; // Return false in case of an error
    }
  }
  
  