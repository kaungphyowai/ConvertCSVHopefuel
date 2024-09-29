// Import the db function from the db.js file
import db from "../database/db.js";

// Function for inserting data into the database
export default async function insertToCurrencyDB(currencyData) {
  const result = await db("INSERT INTO Currency (CurrencyCode) VALUES (?)", [
    currencyData
  ]);
console.log("Curreny Id :",result.insertId);
  return result.insertId;
}
