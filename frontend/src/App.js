import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload CSV
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/upload", formData);
      setMessage("✅ File uploaded successfully!");
      alert("✅ File uploaded successfully!");
    } catch (err) {
      setMessage("❌ Upload failed!");
      alert("❌ Upload failed!");
    }
  };

  // Search in DB
// ...existing code...
  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/search?query=${searchQuery}`);
      setSearchResults(res.data.results || []);
    } catch (err) {
      alert("❌ Error fetching results");
    }
  };
// ...existing code...

  return (
    <div style={{ padding: "20px" }}>
      <h2>📂 CSV Uploader + Search</h2>

      {/* File Upload */}
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>

      <hr />

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search database..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {/* Search Results */}
      <ul>
        {searchResults.map((row, index) => (
          <li key={index}>{JSON.stringify(row)}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
