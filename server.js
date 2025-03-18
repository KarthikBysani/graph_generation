// const express = require('express');
// const cors = require('cors');

// const { getAllCompanies, getAllUgPrograms, getAllDeps } = require('./src/config/db'); // ✅ Correct path

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // ✅ Route to fetch all companies
// app.get('/api/companies', async (req, res) => {
//     try {
//         const companies = await getAllCompanies();
//         res.json(companies);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch companies" });
//     }
// });

// // ✅ Route to fetch all UG programs
// app.get('/api/ug_programs', async (req, res) => {
//     try {
//         const programs = await getAllUgPrograms();
//         res.json(programs);
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch UG programs" });
//     }
// });

// // ✅ Route to fetch program_name and total_offers
// app.get('/api/deps', async (req, res) => {
//     try {
//         const deps = await getAllDeps();
//         res.json(deps);  // ✅ Fixed variable name (was `programs`)
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         res.status(500).json({ error: error.message }); // ✅ Send real error
//     }
// });
// require("dotenv").config();
// const {
//   GoogleGenerativeAI,
//   HarmCategory,
//   HarmBlockThreshold,
// } = require("@google/generative-ai");

// const apiKey = process.env.GOOGLE_API_KEY; // Secure API key storage
// const genAI = new GoogleGenerativeAI(apiKey);

// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 40,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };

// async function run() {
//   const parts = [
//     { text: `You are an SQL Query Generator bot. Your task is to generate optimized SQL queries based on user input using the provided database schema (Companies and ug_programs). Your responses must be accurate, efficient, and properly formatted. Whenever the user requests a query, generate a valid SQL statement and, if possible, provide an example output for better clarity. Be flexible in understanding natural language variations of queries and ensure relevant responses.` },
//     { text: `The Companies table consists of:\nid (int, primary key) - Unique identifier for the company\ncompany_name (varchar(255)) - Name of the company\noffers (int) - Number of offers made by the company` },
//     { text: `The ug_programs table consists of:\nid (int, primary key) - Unique identifier for the program\nprogram_name (varchar(255)) - Name of the undergraduate program\ntotal_offers (int) - Total offers given in this program\ntotal_registered (int) - Number of students registered\npercentage (decimal(5,2)) - Percentage of students placed\nmin_salary (decimal(10,2)) - Minimum salary offered\nmax_salary (decimal(10,2)) - Maximum salary offered\navg_salary (decimal(10,2)) - Average salary offered` },
    
//     { text: "input: Get the total number of offers for each undergraduate program." },
//     { text: "output: SELECT program_name, total_offers FROM ug_programs;" },
    
//     { text: "input: Which companies made more than 10 offers?" },
//     { text: "output: SELECT company_name, offers FROM Companies WHERE offers > 10;" },
    
//     { text: "input: How many offers were given in the Electronics program?" },
//     { text: "output: SELECT total_offers FROM ug_programs WHERE program_name = 'Electronics';" },
    
//     { text: "input: Which undergraduate program has the highest average salary?" },
//     { text: "output: SELECT program_name, avg_salary FROM ug_programs ORDER BY avg_salary DESC LIMIT 1;" },
    
//     { text: "input: List all companies and the number of offers they made." },
//     { text: "output: SELECT company_name, offers FROM Companies;" },
//   ];

//   const result = await model.generateContent({
//     contents: [{ role: "user", parts }],
//     generationConfig,
//   });

//   console.log(result.response.text());
// }

// run();


// // ✅ Start the server
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const plotly = require("plotly")("bunnybysani", "your_plotly_api_key");
const fs = require("fs");


const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Setup MySQL connection
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Karthikmysql@2005",
  database: "graphs",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();

// ✅ Check DB connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Database connected successfully!");
    connection.release();
  }
});

// ✅ Fetch all companies
const getAllCompanies = async () => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM Companies");
    return rows;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};

// ✅ Fetch all UG programs
const getAllUgPrograms = async () => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM ug_programs");
    return rows;
  } catch (error) {
    console.error("Error fetching UG programs:", error);
    throw error;
  }
};

// ✅ Fetch all departments and total offers
const getAllDeps = async () => {
  try {
    const [rows] = await promisePool.query(
      "SELECT program_name, total_offers FROM ug_programs"
    );
    return rows;
  } catch (error) {
    console.error("Error fetching programs:", error);
    throw error;
  }
};

// ✅ Setup Gemini AI
const apiKey = 'AIzaSyAnZtGNhaPFcksD6l_U64nkzc6l46e8cqg';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function generateSQLQuery(question) {
  const prompt = `"You are an advanced SQL Query Generator Bot specializing in generating SQL queries for dynamic report and graph generation based on user inputs. Your goal is to accurately translate user instructions into optimized SQL queries for retrieving data from a structured relational database. User Input Expectations: Users will provide natural language instructions, specifying whether they need a report (detailed tabular data) or a graph (concise, structured data for visualization). Based on their input, generate the most appropriate SQL query. Database Schema Reference ug_programs Table: Stores B.Tech program placement details Key fields: program_name, total_offers, total_registered, percentage, min_salary, max_salary, avg_salary companies Table: Stores placement company details Key fields: company_name, offers Query Generation Logic: Identify Intent: If the user asks for a report, retrieve all relevant columns. If the user asks for a graph, return only the necessary fields for visualization. Recognize Filters: Users may request data by year, program, salary range, company, or percentage. Ensure the query applies relevant WHERE clauses. Determine Aggregations (if applicable): If the user requests statistics like average salary trends or total placements, generate GROUP BY and AVG(), SUM(), or COUNT() functions as needed. Sort Data: If the user specifies ranking (e.g., \\\"Top 5 highest paying companies\\\"), generate ORDER BY with LIMIT.\n"
                +
                "Return only the SQL query without any markdown formatting or explanations.\n" +
                "Example Input: Generate a report of all B.Tech programs with total offers and average salary.\n" +
                "Example Output: SELECT program_name, total_offers, avg_salary FROM ug_programs;\n\n" +
                "Example Input: Show a bar chart of total offers for each B.Tech program.\n" +
                "Example Output: SELECT program_name, total_offers FROM ug_programs;\n\n" +
                "Example Input: Get the top 5 companies that provided the highest number of job offers.\n" +
                "Example Output: SELECT company_name, offers FROM companies ORDER BY offers DESC LIMIT 5;\n\n" +
                "User Input: "
"${question}"`;

  try {
    const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });
    return result.response.text();
  } catch (error) {
    console.error("❌ Error generating SQL query:", error.message);
    throw error;
  }
}

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.get("/api/companies", async (req, res) => {
  try {
    const companies = await getAllCompanies();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

app.get("/api/ug_programs", async (req, res) => {
  try {
    const programs = await getAllUgPrograms();
    res.json(programs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch UG programs" });
  }
});

app.get("/api/deps", async (req, res) => {
  try {
    const deps = await getAllDeps();
    res.json(deps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ AI-Powered SQL Query Generator Route
app.post("/api/generate-sql", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ error: "Question is required" });

  try {
    const sqlQuery = await generateSQLQuery(question);
    res.json({ query: sqlQuery });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate SQL query" });
  }
});
// ✅ API Route to Get a Bar Chart (Total Offers per UG Program)
app.get("/api/graph/offers-bar-chart", async (req, res) => {
    try {
      const programs = await getAllUgPrograms();
      const programNames = programs.map((p) => p.program_name);
      const totalOffers = programs.map((p) => p.total_offers);
  
      const data = [
        {
          x: programNames,
          y: totalOffers,
          type: "bar",
          marker: { color: "blue" },
        },
      ];
  
      const layout = {
        title: "Total Offers per UG Program",
        xaxis: { title: "UG Program" },
        yaxis: { title: "Total Offers" },
      };
  
      plotly.plot(data, layout, function (err, url) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ graph_url: url });
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate bar chart" });
    }
  });
// ✅ API Route to Get a Pie Chart (Offers Distribution)
app.get("/api/graph/offers-pie-chart", async (req, res) => {
    try {
      const programs = await getAllUgPrograms();
      const programNames = programs.map((p) => p.program_name);
      const totalOffers = programs.map((p) => p.total_offers);
  
      const data = [
        {
          labels: programNames,
          values: totalOffers,
          type: "pie",
        },
      ];
  
      const layout = { title: "Offers Distribution by UG Program" };
  
      plotly.plot(data, layout, function (err, url) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ graph_url: url });
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate pie chart" });
    }
  });
  // ✅ API Route to Get a Line Chart (Salary Trends)
app.get("/api/graph/salary-trends", async (req, res) => {
    try {
      const programs = await getAllUgPrograms();
      const programNames = programs.map((p) => p.program_name);
      const avgSalaries = programs.map((p) => p.avg_salary);
  
      const data = [
        {
          x: programNames,
          y: avgSalaries,
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "green" },
        },
      ];
  
      const layout = { title: "Average Salary Trends per UG Program", xaxis: { title: "UG Program" }, yaxis: { title: "Average Salary" } };
  
      plotly.plot(data, layout, function (err, url) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ graph_url: url });
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate salary trends chart" });
    }
  });
  // ✅ API Route to Get a Scatter Plot (Salary vs. Offers)
app.get("/api/graph/salary-vs-offers", async (req, res) => {
    try {
      const programs = await getAllUgPrograms();
      const totalOffers = programs.map((p) => p.total_offers);
      const avgSalaries = programs.map((p) => p.avg_salary);
  
      const data = [
        {
          x: totalOffers,
          y: avgSalaries,
          mode: "markers",
          type: "scatter",
          marker: { size: 10, color: "red" },
        },
      ];
  
      const layout = { title: "Salary vs. Offers", xaxis: { title: "Total Offers" }, yaxis: { title: "Average Salary" } };
  
      plotly.plot(data, layout, function (err, url) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ graph_url: url });
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate scatter plot" });
    }
  });  

// ✅ Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
