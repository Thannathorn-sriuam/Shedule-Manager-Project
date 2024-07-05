// src/components/DropdownContainer.js
import React, { useState } from "react";
import "./DropdownContainer.css";

const DropdownContainer = ({ onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState(["", "", "", ""]);

  const handleDropdownChange = (index, event) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = event.target.value;
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };

  return (
    <div className="dropdown-container">
      <select value={selectedOptions[0]} onChange={(e) => handleDropdownChange(0, e)}>
        <option value="">Select a term</option>
        <option value="2023/1">2023/1</option>
        <option value="2023/2">2023/2</option>
        <option value="2023/3">2023/3</option>
      </select>
      <select value={selectedOptions[1]} onChange={(e) => handleDropdownChange(1, e)}>
        <option value="">Select a program</option>
        <option value="ICT">ICT</option>
        <option value="DST">DST</option>
      </select>
      <select value={selectedOptions[2]} onChange={(e) => handleDropdownChange(2, e)}>
        <option value="">Select a year</option>
        <option value="ปี1">ปี1</option>
        <option value="ปี2">ปี2</option>
        <option value="ปี3">ปี3</option>
        <option value="ปี4">ปี4</option>
      </select>
      <select value={selectedOptions[3]} onChange={(e) => handleDropdownChange(3, e)}>
        <option value="">Select a section</option>
        <option value="Sec1">Sec1</option>
        <option value="Sec2">Sec2</option>
        <option value="Sec3">Sec3</option>
        <option value="Sec4">Sec4</option>
      </select>
    </div>
  );
};

export default DropdownContainer;
