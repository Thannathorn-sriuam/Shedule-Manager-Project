import React, { useState, useEffect } from "react";
import "./DropdownContainer.css";

const DropdownContainer = ({ onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState(["", "", "", ""]);
  const [years, setYears] = useState([]);
  const [sections, setSections] = useState([]);

  const handleInputChange = (index, event) => { //add new
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = event.target.value;
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);
  };

  const handleDropdownChange = async (index, event) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = event.target.value;
    setSelectedOptions(newSelectedOptions);
    onChange(newSelectedOptions);

    if (index === 1 && event.target.value) {
      // Fetch years based on selected program
      fetchYears(event.target.value);
    } else if (index === 2 && event.target.value) {
      // Fetch sections based on selected program and year
      fetchSections(newSelectedOptions[1], event.target.value);
    }
  };

  const fetchYears = async (program) => {
    try {
      const response = await fetch(`/api/years/${program}`);
      if (response.ok) {
        const data = await response.json();
        setYears(data);
        setSections([]); // Reset sections when program changes
      } else {
        console.error('Failed to fetch years');
      }
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  const fetchSections = async (program, year) => {
    try {
      const response = await fetch(`/api/sections/${program}/${year}`);
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      } else {
        console.error('Failed to fetch sections');
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  useEffect(() => {
    // Reset years and sections when program changes
    if (selectedOptions[1] === "") {
      setYears([]);
      setSections([]);
    }
  }, [selectedOptions]);

  return (
    <div className="dropdown-container">
      <input //edit
        type="text"
        value={selectedOptions[0]}
        onChange={(e) => handleInputChange(0, e)}
        placeholder="Enter a term"
      />
      <select value={selectedOptions[1]} onChange={(e) => handleDropdownChange(1, e)}>
        <option value="">Select a program</option>
        <option value="ICT">ICT</option>
        <option value="DST">DST</option>
      </select>
      <select value={selectedOptions[2]} onChange={(e) => handleDropdownChange(2, e)}>
        <option value="">Select a year</option>
        {years.map((year) => (
          <option key={year} value={year}>{`ปี ${year}`}</option>
        ))}
      </select>
      <select value={selectedOptions[3]} onChange={(e) => handleDropdownChange(3, e)}>
        <option value="">Select a section</option>
        {sections.map((section) => (
          <option key={section} value={section}>{`Sec ${section}`}</option>
        ))}
      </select>
    </div>
  );
};

export default DropdownContainer;
