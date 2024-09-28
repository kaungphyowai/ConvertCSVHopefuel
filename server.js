import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import readCSV from "./readCSV.js";


const app = express();
const PORT = 3000;

app.use(express.static("public"));
// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

// Route to upload CSV file
app.post("/upload-csv", upload.single("csvFile"), (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.file.filename);

 // const results = [];

  readCSV(filePath).then((data) => {
    console.log("CSV file converted to JSON:", data);
  });
});

// Basic route for testing
app.get("/", (req, res) => {
   res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
