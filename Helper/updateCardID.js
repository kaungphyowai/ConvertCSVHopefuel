

// Function to fetch SupportRegionId from database
import db from "../database/db.js"
export default async function updateCardID(customerID, cardID) {

    try{
    const [rows] = await db(
       'UPDATE Customer SET CardID = ? WHERE CustomerId = ?',
        [cardID, customerID]
    );
    return rows;
}catch(e)
{
    console.log(e)
}
}