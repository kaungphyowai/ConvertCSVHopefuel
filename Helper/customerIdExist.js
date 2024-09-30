
import db from "../database/db.js";
export default async function customerIdExist(cardID) {
    try {
        // Query to find the user with the given username and email
        const rows = await db(
            'SELECT * FROM Customer WHERE CardID = ?',
            [cardID]
        );

        // Check if a user was found
        if (rows.length > 0) {
            // Return the user row
            return Response.json(rows[0])
        } else {
            return Response.json("false"); // No user found
        }
    } catch (error) {
        console.error('Error checking user:', error);
        return Response.json("false");; // Return false in case of an error
    }
  }
  
  