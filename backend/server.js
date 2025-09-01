const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const uploadCSV = require("./upload");
const db = require("./db"); // Make sure you have db.js for MySQL connection

const app = express();
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const upload = multer({ dest: path.join(__dirname, "uploads/") });

// API route to handle CSV upload
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    console.log(`📂 Upload received: ${req.file.originalname}`);

    await uploadCSV(req.file.path);

    res.status(200).json({ message: "✅ Upload successful!" });
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ message: "Upload failed!", error: err.message || err });
  }
});

// --- ADD THIS: Search endpoint ---
// ...existing code...
app.get("/search", async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ message: "Missing search query!" });
  }
  try {
    // Get all columns except 'id'
    const [columns] = await db.query("SHOW COLUMNS FROM csv_data");
    const colList = columns
      .map(col => col.Field)
      .filter(col => col !== "id")
      .map(col => `\`${col}\``)
      .join(", ");
    // Search all columns
    const [rows] = await db.query(
      `SELECT * FROM csv_data WHERE CONCAT_WS(' ', ${colList}) LIKE ?`,
      [`%${query}%`]
    );
    res.json({ results: rows });
  } catch (err) {
    console.error("❌ Search failed:", err);
    res.status(500).json({ message: "Search failed!", error: err.message || err });
  }
});

// --- END ADD ---

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});