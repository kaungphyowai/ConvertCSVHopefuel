import mysql from "mysql2/promise";
import { readFile } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { csv2json } from "json-2-csv";
import db from "./database/db.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = resolve(__dirname, "./uploads/Beta-Data-HopeFuel.csv");

//Export JSON Object From CSV File
async function readCSV(filePath) {

  const csvContent = await readFile(filePath, "utf-8");

  
  const json = await csv2json(csvContent, {
    delimiter: {
      field: ",",
      eol: "\n",
      
    },
  });

  return json;
}

readCSV(filePath).then((data) => {
  console.log("CSV file converted to JSON:", data);
});
