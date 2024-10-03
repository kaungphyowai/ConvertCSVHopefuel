// Import the db function from the db.js file
import db from "../database/db.js";
import calculateExpireDate from "../Helper/calculateExpireDate.js";
import getAgentId from "../Helper/getAgentId.js";
import getInteger from "../Helper/getInteger.js";
import getSupportRegionId from "../Helper/getSupportRegionId.js";
import getWalletId from "../Helper/getWalletId.js";
import insertNoteAndGetId from '../Helper/insertNoteAndGetId.js'


// Function for inserting data into the database
export default async function addNewUser(row) {
    // TODO: formfill person need to match before run in csv.
    const {
        'Date': transactionDate,
        'Name': name,
        'Email': email,
        'Country': userCountry,
        'Total Amount': amount,
        'Month': month,
        'Many Chat ID': manyChatId,
        'Notes': notes,
        'Payment Check': paymentCheck,
        'Wallet': walletName,
        'Support Region': regionName,
        "AgentID": awsId
    } = row;

    const hopeKeys = Object.keys(row).filter(key => key.includes('Hope'));
    const HopefulID = row[hopeKeys[0]]
    console.log(HopefulID)
    const walletId = await getWalletId(walletName);
    const supportRegionId = await getSupportRegionId(regionName);

    if (!supportRegionId || !walletId) {
        throw new Error(`Missing IDs for wallet or support region.`);
    }
    // Insert the note (if any) and get its ID
    const noteId = await insertNoteAndGetId(notes);
// Insert customer into the Customer table

const expireDate = calculateExpireDate(new Date(transactionDate), month)
    const customerResult = await db(
        'INSERT INTO Customer (Name, Email, UserCountry, ManyChatId, ExpireDate) VALUES (?, ?, ?, ?, ?)',
        [name, email, userCountry, manyChatId, expireDate]
    );
    const customerId = customerResult.insertId;

    // Insert the transaction into the Transactions table
    let HopeFuel = parseInt(getInteger(HopefulID))
    let result = await db(
        `INSERT INTO Transactions (
            CustomerID, SupportRegionID, WalletID, Amount, 
            PaymentCheck, TransactionDate, Month, HopefulID, NoteID, PaymentDenied
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            customerId, supportRegionId, walletId, amount,
            1, new Date(transactionDate), month, HopeFuel, noteId, 0
        ]
    );
    let transactionID = result.insertId;

    let agentId = await getAgentId(awsId)
    console.log("My agent Id is " + agentId)
    try{

        await db(
            `INSERT INTO TransactionAgent (
                TransactionID, AgentID, LogDate
            ) VALUES (?, ?, ?)`,
            [
                transactionID, agentId, new Date(transactionDate)
            ]
        );
    }
    catch(err)
    {
        console.log(err)
    }


    // TODO: manyChat ID needed to be in separate table.
}


