
// Import the readCSV function from the readCSV.js file
import readCSV from "./readCSV.js";
// Import the db function from the db.js file
import db from "../database/db.js";
  

  // Function for inserting data into the database  
export default async function insertToSupportRegionDB(supportRegionData) {
    
   const result = await db("INSERT INTO SupportRegion (Region) VALUES (?)", [supportRegionData]);
     

   return result.insertId;
    
}
;
    
 
    
