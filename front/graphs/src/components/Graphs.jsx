import React, { useState, useEffect } from "react";
import axios from "axios";
import Plot from "react-plotly.js";
import Dropdown from "./DropDown";

const API_BASE_URL = "http://localhost:5000"; // Backend API URL

const Graphs = ({ graphType }) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");

  // Fetch data from API
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/ug_programs`)
      .then((response) => {
        setData(response.data);
        setColumns(Object.keys(response.data[0] || {})); // Extract column names
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="graph-container">
      <h2>Step 4: Select Data Coordinates</h2>
      <Dropdown label="X-Axis" options={columns} value={xAxis} onChange={setXAxis} />
      {graphType !== "Pie Chart" && (
        <Dropdown label="Y-Axis" options={columns} value={yAxis} onChange={setYAxis} />
      )}

      {xAxis && (graphType === "Pie Chart" || yAxis) && (
        <Plot
          data={[
            graphType === "Bar Chart"
              ? { x: data.map((item) => item[xAxis]), y: data.map((item) => item[yAxis]), type: "bar" }
              : graphType === "Pie Chart"
              ? { labels: data.map((item) => item[xAxis]), values: data.map((item) => item[yAxis]), type: "pie" }
              : graphType === "Line Chart"
              ? { x: data.map((item) => item[xAxis]), y: data.map((item) => item[yAxis]), type: "scatter", mode: "lines+markers" }
              : { x: data.map((item) => item[xAxis]), y: data.map((item) => item[yAxis]), type: "scatter", mode: "markers" },
          ]}
          layout={{ title: `${graphType}: ${xAxis} vs ${yAxis}`, xaxis: { title: xAxis }, yaxis: { title: yAxis } }}
        />
      )}
    </div>
  );
};

export default Graphs;
