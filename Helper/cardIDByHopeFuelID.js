
import db from "../database/db.js";
export default async function cardIDByHopeFuelID(hopeID) {
    try {
        // Query to find the user with the given username and email
        const rows = await db(
            'SELECT c.CustomerId, c.Name, c.CardID FROM Transactions t JOIN Customer c ON t.CustomerID = c.CustomerId WHERE t.HopeFuelID = ?',
            [hopeID]
        );

        // Check if a user was found
        if (rows.length > 0) {
            // Return the user row
            return rows[0]
        } else {
            return null; // No user found
        }
    } catch (error) {
        console.error('Error checking user:', error);
        return false; // Return false in case of an error
    }
  }
  
  

