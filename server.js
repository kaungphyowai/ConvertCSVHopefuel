import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import readCSV from "./functions/readCSV.js";
import  insertToSupportRegionDB  from "./functions/DBsupportRegion.js";
import insertToCurrencyDB  from "./functions/DBCurreny.js";
import insertToWalletDB  from "./functions/DBWallet.js";
import insertToUserRoleDB  from "./functions/DBUserRole.js";
import validateRow  from "./functions/validateRow.js";
import {getUniqueValues} from "./Helper/UniqueFile.js";

import validateOld from "./functions/validateOld.js";
import validateNew from "./functions/validateNew.js";
import addNewUser from "./functions/addNewUser.js";
import addOldUser from "./functions/addOldUser.js";
import insertAgentId from "./functions/DBagentID.js";


const app = express();
const PORT = 3000;

app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

// // Route to upload CSV file
// app.post("/upload-csv", upload.single("csvFile"), async (req, res) => {
//   const filePath = path.join(process.cwd(), "uploads", req.file.filename);

//   const data = await readCSV(filePath);


  
//   const uniqueSupportRegions = getUniqueValues(data, "Support Region");

//   uniqueSupportRegions.forEach(async (item) => {
//     await insertToSupportRegionDB(item);
//     console.log("Support Region Data inserted into the database");
//   });



//   const uniqueCurrency = getUniqueValues(data, "Currency");
//     uniqueCurrency.forEach( async (item) => {
//     const currencyID =  await insertToCurrencyDB(item);
//      console.log("Currency Data inserted into the database with Id: ", currencyID);
//    });


//   const uniqueWallet = getUniqueValues(data, "Wallet");

//   uniqueWallet.forEach( async (item, index) => {
//     // NOTE: THIS IS A TEMP SOLUTION => TODO: FIX THIS AFTER DISCUSSION=
//     const walletID =  await insertToWalletDB(item);
//      console.log("Wallet Data inserted into the database");
//    });

//    const userRole = ["Support Agent", "Admin", "Payment Processor"]

//   userRole.forEach( async (item) => {
//     const userRoleID =  await insertToUserRoleDB(item);
//      console.log("UserRole Data inserted into the database");
//    });
//    console.log(data)
//    const uniqueAgentID = getUniqueValues(data, "AgentID");
//    console.log(uniqueAgentID)

//    uniqueAgentID.forEach(async (item) => {
//     console.log(item)
//      await insertAgentId(item);
//      console.log("AgentID Data inserted into the database");
//    });
   
 

//   const uniqueHopeFuelID = getUniqueValues(data, "Hope ID");

//   const HopeIdDate = data.map((item) => {
//     return item["Date"];
//   });

//   for(let row in data)
//   {
//     let currentRow = data[row];
//     let isRowValidated = validateRow(currentRow);

//     if(!isRowValidated)
//     {
//       // TODO: stop and ask for permission
//       break;
//     }
    
//     let isOldUser = currentRow["New or Old Member"] == "Old"
//     let isNewUser = currentRow["New or Old Member"] == "New"



//     if(isOldUser)
//     {
//       let isValidatedOld = await validateOld(currentRow["Customer ID"]);

//       if(isValidatedOld)
//       {
//         await addOldUser(currentRow)
//         console.log("OK. This ID: " + HopefulID + "IS OK AND VALIDED IN OLD WAY")
        
//       }
//       else
//       {
//         console.error("ERROR. This ID: " + currentRow["Hope ID"] + " is an old user but don't have an ID in the database")
//       }
//     }
//     else if (isNewUser)
//     {
//       let isValidatedNew = await validateNew(currentRow["Name"], currentRow["Email"] )
//       if(isValidatedNew)
//       {
//         await addNewUser(currentRow);
//         console.log("OK. This ID: " + currentRow["Hope ID"] + " is an fresher and he need to be welcomed")
        
//       }
//       else
//       {
//         console.error("ERROR. This ID: " + currentRow["Hope ID"] + " is an new user but have already been registerd")
//       }
//     }
//   }

//   res.redirect("/");
// });

  
   


 



//Routes
app.get("/", async (req, res) => {
   res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



import createLogger from './Helper/Logger.js'; // Import your logger setup
import isSupportRegionExist from "./Helper/isSupportRegionExist.js";
import isWalletExist from "./Helper/isWalletExist.js";
import isCurrencyExist from "./Helper/isCurrencyExist.js";
import isUserRoleExist from "./Helper/isUserRoleExist.js";
import isAgentExist from "./Helper/isAgentExist.js";
import getInteger from "./Helper/getInteger.js";
import cardIDByHopeFuelID from "./Helper/cardIDByHopeFuelID.js";
import updateCardID from "./Helper/updateCardID.js";

app.post("/upload-csv", upload.single("csvFile"), async (req, res) => {
  const logger = createLogger(); // Create a new logger instance with a unique file for this request
  try {
    const filePath = path.join(process.cwd(), "uploads", req.file.filename);

    const data = await readCSV(filePath);




    // Process the Support Region
    const uniqueSupportRegions = getUniqueValues(data, "Support Region");
    for (const item of uniqueSupportRegions) {
      let doesSupportRegionExist = await isSupportRegionExist(item);
      if(!doesSupportRegionExist)
      {
        const supportRegionID = await insertToSupportRegionDB(item);
        logger.info(`Support Region Data inserted into the database with Id: ${supportRegionID}`);
      }
    }
    
    // Process the Currency
    const uniqueCurrency = getUniqueValues(data, "Currency");
    for (const item of uniqueCurrency) {
      let doesCurrencyExist = await isCurrencyExist(item);
      if(!doesCurrencyExist)
      {
        const currencyID = await insertToCurrencyDB(item);
        logger.info(`Currency Data inserted into the database with Id: ${currencyID}`);
      }
    }

    // Process the Wallet
    const uniqueWallet = getUniqueValues(data, "Wallet");
    for(const item of uniqueWallet)
    {
      let doesWalletExist = await isWalletExist(item)
      if(!doesWalletExist)
      {
        const walletID = await insertToWalletDB(item);
        logger.info(`Wallet Data inserted into the database with Id: ${walletID}`);
      }
    }

    // Process the UserRole
    const userRole = ["Support Agent", "Admin", "Payment Processor"];
    userRole.forEach(async (item) => {
      let doesUserRoleExist = await isUserRoleExist(item);
      if(!doesUserRoleExist)
      {
        const userRoleID = await insertToUserRoleDB(item);
        logger.info(`UserRole Data inserted into the database with Id: ${userRoleID}`);
      }
    });

    // Process the Agent ID
    const uniqueAgentID = getUniqueValues(data, "AgentID");
    for(const item of uniqueAgentID)
    {
      let doesAgentIDExist = await isAgentExist(item);
      if(!doesAgentIDExist)
      {

        const AgentID = await insertAgentId(item);
        logger.info(`AgentID Data inserted into the database with Id: ${AgentID}`);
      }
    }
    

    // Process HopeFuel IDs
    for (let row in data) {
      
      let currentRow = data[row];
      const hopeKeys = Object.keys(currentRow).filter(key => key.includes('Hope'));
      const HopefulID = currentRow[hopeKeys[0]]
      let isRowValidated = validateRow(currentRow);

      if (!isRowValidated) {
        // Log error and stop processing
        logger.error(`Invalid row found: ${JSON.stringify(currentRow)}`);
        break;
      }

      let isOldUser = currentRow["New or Old Member"] == "Old";
      let isNewUser = currentRow["New or Old Member"] == "New";

      if (isOldUser) {
        let isValidatedOld = await validateOld(currentRow["Customer ID"]);

        if (isValidatedOld) {
          await addOldUser(currentRow, logger);
          logger.info(`OK. This ID: ${HopefulID} is validated in old way`);
        } else {
          logger.error(`ERROR. This ID: ${HopefulID} is an old user but doesn't have an ID in the database`);
        }
      } else if (isNewUser) {
        let isValidatedNew = await validateNew(currentRow["Name"], currentRow["Email"]);
        
        if (isValidatedNew) {
          await addNewUser(currentRow, logger);
          logger.info(`OK. This ID: ${HopefulID} is a new user and will be welcomed`);
        } else {
          logger.error(`ERROR. This ID: ${HopefulID} is a new user but has already been registered`);
        }
      }
    }

    const latestLogFile = getLatestLogFile();
        if (!latestLogFile) {
            return res.status(404).send("No log files found");
        }

        // Download the latest log file
        res.download(latestLogFile, path.basename(latestLogFile), (err) => {
            if (err) {
                logger.error('Error sending the log file:', err);
                res.status(500).send("Error downloading the log file");
            }
        });

  } catch (err) {
    logger.error(`Error processing CSV: ${err.message}`);
    res.status(500).send("Error processing the file");
  }
});



app.post("/cardId", upload.single("csvFile"), async (req, res) => {
  const logger = createLogger();
  try
  {
    const filePath = path.join(process.cwd(), "uploads", req.file.filename);

    const data = await readCSV(filePath);


    /**
     * For every row in csv file,
     * 1. Check if they have carid
     * 2. If not then, update the CardID field of that user
     * 3. If there is an id, show error
     */

    for(let row in data)
    {
      const HOPEID = data[row]['Hope ID'];
      const CUSTOMERID = data[row]['Customer ID'];

      let hopeid = parseInt(getInteger(HOPEID));
      let cardId = parseInt(getInteger(CUSTOMERID));

      let answer = await cardIDByHopeFuelID(hopeid)

      if(answer == null)
      {
        logger.error(`There is no hopeFuel ID with ${HOPEID}`)
        continue;
      }
      const {
        CustomerId,
        Name,
        CardID
      } = answer

      if(CardID == null)
      {
        // update the cardid
        console.log(CustomerId)
        console.log(cardId)
        await updateCardID(CustomerId, cardId)

      }
      else
      {
        logger.error(`We already have a cardNo for ${Name} with hopefuelID ${HOPEID}. Card No is ${CardID}`)
      }

      
    }


    const latestLogFile = getLatestLogFile();
        if (!latestLogFile) {
            return res.status(404).send("No log files found");
        }
    
    // Download the latest log file
    res.download(latestLogFile, path.basename(latestLogFile), (err) => {
      if (err) {
          logger.error('Error sending the log file:', err);
          res.status(500).send("Error downloading the log file");
      }
  });
  }
  catch(e)
  {
    logger.error(`Error processing CSV: ${e.message}`);
    res.status(500).send("Error processing the file");
  }
});


function getLatestLogFile() {
  const logDir = path.join(process.cwd(), 'logs');
  const files = fs.readdirSync(logDir);

  // Filter for log files only (if necessary)
  const logFiles = files.filter(file => file.startsWith('app-') && file.endsWith('.log'));

  if (logFiles.length === 0) {
      return null; // No log files found
  }

  // Sort files by timestamp (assuming the timestamp is part of the file name)
  logFiles.sort((a, b) => {
      return fs.statSync(path.join(logDir, b)).mtime - fs.statSync(path.join(logDir, a)).mtime;
  });

  // Return the most recent log file
  return path.join(logDir, logFiles[0]);
}