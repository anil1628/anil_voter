import React, { useState } from "react";

export default function SearchUpload() {
  const [file, setFile] = useState(null);

  // Handle file select
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload CSV file to backend
  const handleUpload = async () => {
    if (!file) return alert("⚠️ Please select a file!");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        alert("✅ CSV uploaded successfully!");
      } else {
        alert("❌ Upload failed: " + data.error);
      }
    } catch (err) {
      alert("❌ Error uploading file: " + err.message);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "500px",
        margin: "auto",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h2 style={{ marginBottom: "15px" }}>CSV Uploader</h2>

      {/* File upload */}
      <input
        type="file"
        onChange={handleFileChange}
        style={{ marginBottom: "15px" }}
      />

      {/* Upload button */}
      <div>
        <button
          onClick={handleUpload}
          style={{
            backgroundColor: "blue",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Upload
        </button>
      </div>
    </div>
  );
}
