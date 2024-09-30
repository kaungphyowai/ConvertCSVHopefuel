// Import the db function from the db.js file
import db from "../database/db.js";

// Function for inserting data into the database
export default function insertToWalletDB(walletData, index) {
  console.log("index is " + index)
  const result = db("INSERT INTO Wallet (WalletName, CurrencyId) VALUES (?, ?)", [
    walletData, 1
  ]);

  return result.insertId;
}
