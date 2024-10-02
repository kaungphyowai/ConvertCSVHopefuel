// Import the db function from the db.js file
import db from "../database/db.js";

// Function for inserting data into the database
export default async function insertToWalletDB(walletData) {
  const result = await db("INSERT INTO Wallet (WalletName, CurrencyId) VALUES (?, ?)", [
    walletData, 1
  ]);

  return result.insertId;
}
