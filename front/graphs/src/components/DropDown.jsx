import React from "react";

const Dropdown = ({ label, options, value, onChange }) => {
  return (
    <div className="dropdown">
      <label>{label}:</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
