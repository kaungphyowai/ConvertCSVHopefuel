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


const app = express();
const PORT = 3000;

app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

// Route to upload CSV file
app.post("/upload-csv", upload.single("csvFile"), async (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.file.filename);

  const data = await readCSV(filePath);

  //console.log("Data from CSV file", data);

  
  const uniqueSupportRegions = getUniqueValues(data, "Support Region");

  uniqueSupportRegions.forEach((item) => {
    insertToSupportRegionDB(item);
    console.log("Support Region Data inserted into the database");
  });
  


  const uniqueCurrency = getUniqueValues(data, "Currency");
   uniqueCurrency.forEach( (item) => {
    const currencyID =  insertToCurrencyDB(item);
     console.log("Currency Data inserted into the database with Id: ", currencyID);
   });


  const uniqueWallet = getUniqueValues(data, "Wallet");

  uniqueWallet.forEach( (item, index) => {
    // NOTE: THIS IS A TEMP SOLUTION => TODO: FIX THIS AFTER DISCUSSION=
    const walletID =  insertToWalletDB(item);
     console.log("Wallet Data inserted into the database");
   });

   const userRole = ["Support Agent", "Admin", "Payment Processor"]

  userRole.forEach( (item) => {
    const userRoleID =  insertToUserRoleDB(item);
     console.log("UserRole Data inserted into the database");
   });

  const uniqueHopeFuelID = getUniqueValues(data, "Hope ID");

  const HopeIdDate = data.map((item) => {
    return item["Date"];
  });

  for(let row in data)
  {
    let currentRow = data[row];
    let isRowValidated = validateRow(currentRow);

    if(!isRowValidated)
    {
      // TODO: stop and ask for permission
      break;
    }
    
    let isOldUser = currentRow["New or Old Member"] == "Old"
    let isNewUser = currentRow["New or Old Member"] == "New"



    if(isOldUser)
    {
      let isValidatedOld = await validateOld(currentRow["Customer ID"]);

      if(isValidatedOld)
      {
        // add to the database TODO
        console.log("This ID: " + currentRow["Hope ID"] + "IS OK AND VALIDED IN OLD WAY")
        
      }
      else
      {
        console.error("This ID: " + currentRow["Hope ID"] + " is an old user but don't have an ID in the database")
      }
    }
    else if (isNewUser)
    {
      let isValidatedNew = await validateNew(currentRow["Name"], currentRow["Email"] )
      if(isValidatedNew)
      {
        // add to the database TODO
        console.log("This ID: " + currentRow["Hope ID"] + " is an fresher and he need to be welcomed")
        
      }
      else
      {
        console.error("This ID: " + currentRow["Hope ID"] + " is an new user but have already been registerd")
      }
    }
  }

  // validateOld();

  // validateNew();
  

  // console.log(uniqueSupportRegions);
  // console.log(uniqueCurrency);
  // console.log(uniqueWallet);
  //console.log(uniqueHopeFuelID);
  //console.log(HopeIdDate);

  res.redirect("/");
});

  
   


 



//Routes
app.get("/", (req, res) => {
   res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
