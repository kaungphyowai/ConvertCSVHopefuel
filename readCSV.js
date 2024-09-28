
import { csv2json } from "json-2-csv";
import { readFile } from "fs/promises";

//Export JSON Object From CSV File
export default async function readCSV(filePath) {

  const csvContent = await readFile(filePath, "utf-8");

  
  const json = await csv2json(csvContent, {
    delimiter: {
      field: ",",
      eol: "\n",
      
    },
  });

  return json;
}


