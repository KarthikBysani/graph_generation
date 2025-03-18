import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000"; // Backend API URL

const QueryInput = ({ onSQLGenerated }) => {
  const [query, setQuery] = useState("");
  const [sqlQuery, setSQLQuery] = useState("");

  const handleGenerateSQL = async () => {
    if (!query.trim()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate-sql`, { question: query });
      setSQLQuery(response.data.query);
      onSQLGenerated(response.data.query); // Send SQL query to parent component
    } catch (error) {
      console.error("Error generating SQL query:", error);
    }
  };

  return (
    <div className="query-input">
      <h2>Step 1: Enter Query</h2>
      <input
        type="text"
        placeholder="Ask a question about the data..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleGenerateSQL}>Generate SQL</button>

      {sqlQuery && (
        <div className="sql-display">
          <h3>Generated SQL Query:</h3>
          <pre>{sqlQuery}</pre>
        </div>
      )}
    </div>
  );
};

export default QueryInput;
