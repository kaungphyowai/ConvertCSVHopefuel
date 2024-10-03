// Import the db function from the db.js file
import db from "../database/db.js";
import calculateExpireDate from "../Helper/calculateExpireDate.js"
import getAgentId from "../Helper/getAgentId.js";
import getInteger from "../Helper/getInteger.js";
import getSupportRegionId from "../Helper/getSupportRegionId.js";
import getWalletId from "../Helper/getWalletId.js";
import insertNoteAndGetId from '../Helper/insertNoteAndGetId.js'
import 'dotenv/config'


// Function for inserting data into the database
export default async function addOldUser(row) {
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


        // 1. Get or create the customer
        let customerId = await getCustomerIdByCardId(parseInt(getInteger(customerCardId)));


        if (customerId != undefined) {
            // 4. Insert the transaction into the Transactions table
            let HopeFuel = parseInt(getInteger(hopefulId))

            console.log("You are adding the same person in the same month")

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

            // get airtable if there is no id in database

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
                try{

                    nextExpireDate = calculateExpireDate(airtable_expireDate, month)
                }
                catch(err)
                {
                    console.log(err)
                }
            }
            try {
                const customerResult = await db(
                    'INSERT INTO Customer (Name, Email, UserCountry, ManyChatId, ExpireDate) VALUES (?, ?, ?, ?, ?)',
                    [airtable_name, airtable_email, userCountry, manyChatId, nextExpireDate]
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
                        PaymentCheck, TransactionDate, Month, HopefulID, NoteID, PaymentDenied
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