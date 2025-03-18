require("dotenv").config();
const mysql = require("mysql2");

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
    console.error("❌ Error fetching companies:", error);
    throw error;
  }
};

// ✅ Fetch all UG programs
const getAllUgPrograms = async () => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM ug_programs");
    return rows;
  } catch (error) {
    console.error("❌ Error fetching UG programs:", error);
    throw error;
  }
};

// ✅ Fetch departments and total offers
const getAllDeps = async () => {
  try {
    const [rows] = await promisePool.query(
      "SELECT program_name, total_offers FROM ug_programs"
    );
    return rows;
  } catch (error) {
    console.error("❌ Error fetching departments:", error);
    throw error;
  }
};

module.exports = { getAllCompanies, getAllUgPrograms, getAllDeps };
