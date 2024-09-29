import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import readCSV from "./functions/readCSV.js";
import  insertToSupportRegionDB  from "./functions/DBsupportRegion.js";
import insertToCurrencyDB  from "./functions/DBCurreny.js";
import {getUniqueValues} from "./Helper/UniqueFile.js";


const app = express();
const PORT = 3000;

app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

// Route to upload CSV file
app.post("/upload-csv", upload.single("csvFile"), async (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.file.filename);

  const data = await readCSV(filePath);

  console.log("Data from CSV file", data);

  
  const uniqueSupportRegions = getUniqueValues(data, "Support Region");

  uniqueSupportRegions.forEach((item) => {
    insertToSupportRegionDB(item);
    console.log("Support Region Data inserted into the database");
  });
  


  const uniqueCurrency = getUniqueValues(data, "Currency");
   uniqueCurrency.forEach(async (item) => {
    const currencyID = await insertToCurrencyDB(item);
     console.log("Currency Data inserted into the database with Id: ", currencyID);
   });


  const uniqueWallet = getUniqueValues(data, "Wallet");

  const uniqueHopeFuelID = getUniqueValues(data, "Hope ID");

  const HopeIdDate = data.map((item) => {
    return item["Date"];
  });


  console.log(uniqueSupportRegions);
  console.log(uniqueCurrency);
  console.log(uniqueWallet);
  //console.log(uniqueHopeFuelID);
  //console.log(HopeIdDate);
});

  
   


 



//Routes
app.get("/", (req, res) => {
   res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
