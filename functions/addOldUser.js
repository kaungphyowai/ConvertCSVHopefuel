// Import the db function from the db.js file
import { loggers } from "winston";
import db from "../database/db.js";
import calculateExpireDateOld from "../Helper/calculateExpireDateOld.js"
import calculateExpireDate from "../Helper/calculateExpireDate.js"
import getAgentId from "../Helper/getAgentId.js";
import getInteger from "../Helper/getInteger.js";
import getSupportRegionId from "../Helper/getSupportRegionId.js";
import getWalletId from "../Helper/getWalletId.js";
import insertNoteAndGetId from '../Helper/insertNoteAndGetId.js'
import 'dotenv/config'


// Function for inserting data into the database
export default async function addOldUser(row, logger) {
    // TODO: formfill person need to match before run in csv.
    try {
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
            'Customer ID': customerCardId, // This is related to CardID in the database
            "AgentID": awsId
        } = row;

        const hopeKeys = Object.keys(row).filter(key => key.includes('Hope'));
        const hopefulId = row[hopeKeys[0]]

        // 1. Get SupportRegionId and WalletId

        const supportRegionId = await getSupportRegionId(regionName);
        const walletId = await getWalletId(walletName);

        if (!supportRegionId || !walletId) {
            throw new Error('Missing SupportRegionId or WalletId');
        }


        // 3. Insert the note (if any) and get the NoteID
        const noteId = await insertNoteAndGetId(notes);


        // 1. Check old user exist in sql
        let customerId = await getCustomerIdByCardId(parseInt(getInteger(customerCardId)));
        console.log("Adding old user ")
        console.log(customerId)

        if (customerId != undefined) {
            // the user exist in the database
            console.log("The user exist in the database. We are determing the permission of this user")
            let HopeFuel = parseInt(getInteger(hopefulId))

            /**
             * If user has permission to add this month
             * 
             * Note: Since we are only migration from excel for only 2 month, we don't need to consider
             * from airtable.. airtable hasn't beed used for a long time now
             */
            let transaction_Date = new Date(transactionDate)
            let hasPermission = await hasPermissionThisMonth(parseInt(customerId), transaction_Date)
            console.log(hasPermission)

            if(hasPermission)
            {
                /**
                 * 1. Use customer ID to add transaction and transaction agent
                 * 2. increment expireDate of the old user => choose between new Expiredate or extend old expire date
                 */

                let result = await db(
                    `INSERT INTO Transactions (
                        CustomerID, SupportRegionID, WalletID, Amount, 
                        PaymentCheck, TransactionDate, Month, HopeFuelID, NoteID, PaymentDenied
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        customerId, supportRegionId, walletId, parseFloat(amount),
                        1, new Date(transactionDate), parseInt(month), HopeFuel, noteId , 0
                    ]
                );

                // get the expireDate of the customer ID
                let databaseExpiredate;
                try{

                    databaseExpiredate = await getExpireDateByCustomerID(customerId)
                }
                catch(e)
                {
                    console.log(e)
                }
                console.log(databaseExpiredate)


                let expireDate = recentExpireDate(transaction_Date, new Date(databaseExpiredate))
                console.log(expireDate)
                let databaseExpiredate_DateFormat = new Date(databaseExpiredate)
                
                let nextExpireDate;
                try{
                    if(expireDate.getMonth() == databaseExpiredate_DateFormat.getMonth() && expireDate.getDate() == databaseExpiredate_DateFormat.getDate())
                    {
                        // if this expiredate is from database Expire Date. Calculate old way
                        nextExpireDate = calculateExpireDateOld(expireDate, month)
                    }
                    else
                    {
                        // if this expire date is from transaction date. Calculate normal way
                        nextExpireDate = calculateExpireDate(expireDate, month)
                    }

                }
                catch(err)
                {
                    console.log(err)
                }
                console.log(nextExpireDate)

                let transactionID = result.insertId;

                let agentId = await getAgentId(awsId)
                console.log("My agent Id is " + agentId)
                try{

                    await db(
                        `INSERT INTO TransactionAgent (
                            TransactionID, AgentId, LogDate
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
            
                try
                {
                    await db(
                        `UPDATE Customer
                        SET ExpireDate = ?
                        WHERE CustomerId = ?;`,
                        [
                            nextExpireDate, customerId
                        ]
                    );
                }
                catch(e)
                {
                    console.log(e)
                }
                
                
            }
            else
            {
                logger.error(`ERROR. This ID: ${hopefulId} is being added two time in one month.`);
            }


            // await db(
            //     `INSERT INTO Transactions (
            //         CustomerID, SupportRegionID, WalletID, Amount, 
            //         PaymentCheck, TransactionDate, Month, HopefulID, NoteID
            //     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            //     [
            //         customerId, supportRegionId, walletId, parseFloat(amount),
            //         paymentCheck === 'TRUE', new Date(transactionDate), parseInt(month), HopeFuel, noteId
            //     ]
            // );
        }
        else
        {
        let HopeFuel = parseInt(getInteger(hopefulId))

            // Old User with no row in database

            let cardID = getInteger(customerCardId)

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
            "prfno": cardID
            });

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
            let json;

            try{
                
                let url = process.env.APIURL + "/api/getUserId";
                const result =  await fetch(url, requestOptions)
                json = await result.json();
                console.log("This is json ")
                console.log(json)
            }catch(err)
            {
                console.log(err)
            }
            let answer = json.message;
            let airtable_name = json['name'];
            let airtable_email = json['email'];
            let airtable_no = json['prf_no'];
            console.log(json)
            let nextExpireDate = null
            if(json['expire_date'][0])
            {

                let airtable_expireDate = new Date(json['expire_date'][0]);
                let transaction_Date = new Date(transactionDate)



                let expireDate = recentExpireDate(transaction_Date, airtable_expireDate)
                console.log("Candy expire date is ")
                console.log(expireDate)
                console.log(expireDate)

                try{
                    if(expireDate.getMonth() == airtable_expireDate.getMonth() && expireDate.getDate() == airtable_expireDate.getDate())
                    {
                        // if this expiredate is from database Expire Date. Calculate old way
                        nextExpireDate = calculateExpireDateOld(expireDate, month)
                    }
                    else
                    {
                        // if this expire date is from transaction date. Calculate normal way
                        nextExpireDate = calculateExpireDate(expireDate, month)
                    }
                    console.log("Candy next expire date is ")
                    console.log(nextExpireDate)
                }
                catch(err)
                {
                    console.log(err)
                }
            }
            try {
                const customerResult = await db(
                    'INSERT INTO Customer (Name, Email, UserCountry, ManyChatId, ExpireDate, CardID) VALUES (?, ?, ?, ?, ?, ?)',
                    [airtable_name, airtable_email, userCountry, manyChatId, nextExpireDate, cardID]
                );
                customerId = customerResult.insertId;
                console.log("customerid " + customerId)
            } catch (err) {
                console.error("Error inserting customer:", err);
                return; // Exit the function early if something goes wrong
            }

            let result; 
            try{

                result = await db(
                    `INSERT INTO Transactions (
                        CustomerID, SupportRegionID, WalletID, Amount, 
                        PaymentCheck, TransactionDate, Month, HopeFuelID, NoteID, PaymentDenied
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        customerId, supportRegionId, walletId, parseFloat(amount),
                        1, new Date(transactionDate), parseInt(month), HopeFuel, noteId , 0
                    ]
                );
            }
            catch(err)
            {
                console.log(err)
            }

            let transactionID = result.insertId;

            let agentId = await getAgentId(awsId)
            console.log("My agent Id is " + agentId)
            try{

                await db(
                    `INSERT INTO TransactionAgent (
                        TransactionID, AgentId, LogDate
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


        }


        
       

    

    } catch (err) {
         console.error(`Error processing row: ${err.message}`);
    }

    // TODO: manyChat ID needed to be in separate table.
}


async function getCustomerIdByCardId(cardId) {
    const rows = await db(
        'SELECT CustomerId FROM Customer WHERE CardID = ?',
        [cardId]
    );

    
    // Check if any rows are returned, and return CustomerId of the first row
    if (rows.length > 0) {
        return rows[0].CustomerId;
    } else {
        return undefined;
    }
}

async function getExpireDateByCustomerID(customerID) {
    const rows = await db(
        'SELECT ExpireDate FROM Customer WHERE CustomerId = ?',
        [customerID]
    );

    
    // Check if any rows are returned, and return CustomerId of the first row
    if (rows.length > 0) {
        return rows[0]["ExpireDate"];
    } else {
        return undefined;
    }
}

function recentExpireDate(transactionDate, databaseExpireDate)
{
    // check which is bigger, airtable ExpireDate or transaction add date
    let date = databaseExpireDate< transactionDate ? transactionDate : databaseExpireDate
    return date
}

async function hasPermissionThisMonth(customerId, currentTransactionDate) {
    console.log("Inside the has permission ")
    console.log(customerId)
    const rows = await db(
        'SELECT * FROM Transactions WHERE CustomerID=? ORDER BY TransactionDate DESC LIMIT 1;',
        [customerId]
    );

    
    // Check if any rows are returned, and return CustomerId of the first row
    if (rows.length > 0) {

        let currentRow = rows[0];
        let latestTransactionDate = currentRow['TransactionDate'];
        console.log(latestTransactionDate)
        let hasPermission = new Date(latestTransactionDate).getMonth() == currentTransactionDate.getMonth() ? false: true;
        return hasPermission;
    } else {
        return undefined;
    }
}