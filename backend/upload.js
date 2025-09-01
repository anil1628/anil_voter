const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const db = require("./db");

// Function to upload CSV into one table (csv_data)
function uploadCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        if (results.length === 0) {
          return reject("❌ CSV is empty");
        }

        const tableName = "csv_data";
        const columns = Object.keys(results[0]);

        try {
          // 1. Ensure base table exists (only id column first time)
          let createTableQuery = `
            CREATE TABLE IF NOT EXISTS ${tableName} (
              id INT AUTO_INCREMENT PRIMARY KEY
            )
          `;
          await runQuery(createTableQuery);

          // 2. Check existing columns in table
          const existingCols = await getExistingColumns(tableName);

          // 3. Add missing columns if any
          for (let col of columns) {
            if (!existingCols.includes(col)) {
              let alterQuery = `ALTER TABLE ${tableName} ADD COLUMN \`${col}\` VARCHAR(255)`;
              await runQuery(alterQuery);
              console.log(`✅ Added new column: ${col}`);
            }
          }

          // 4. Insert CSV data row by row
          for (let row of results) {
            const colNames = Object.keys(row).map((c) => `\`${c}\``).join(",");
            const colValues = Object.values(row);
            const placeholders = colValues.map(() => "?").join(",");

            let insertQuery = `INSERT INTO ${tableName} (${colNames}) VALUES (${placeholders})`;
            await runQuery(insertQuery, colValues);
          }

          resolve("✅ CSV uploaded successfully!");
        } catch (err) {
          reject(err);
        }
      });
  });
}

// Helper: run query (promise-based)
async function runQuery(query, params = []) {
  const [results] = await db.query(query, params);
  return results;
}

// Helper: get existing columns in table (promise-based)
async function getExistingColumns(tableName) {
  const [results] = await db.query(`SHOW COLUMNS FROM ${tableName}`);
  const cols = results.map((r) => r.Field);
  return cols;
}

module.exports = uploadCSV;