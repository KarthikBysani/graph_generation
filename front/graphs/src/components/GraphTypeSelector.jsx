import React from "react";

const GraphTypeSelector = ({ graphType, onSelectGraphType }) => {
  const graphOptions = ["Bar Chart", "Pie Chart", "Line Chart", "Scatter Plot"];

  return (
    <div className="graph-type-selector">
      <h2>Step 3: Select Graph Type</h2>
      <select value={graphType} onChange={(e) => onSelectGraphType(e.target.value)}>
        <option value="">Select Graph Type</option>
        {graphOptions.map((type, index) => (
          <option key={index} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GraphTypeSelector;
