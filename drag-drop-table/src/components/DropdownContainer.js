// import React, { useState, useEffect } from "react";
// import "./DropdownContainer.css";

// const DropdownContainer = ({ onChange }) => {
//   const [selectedOptions, setSelectedOptions] = useState(["", "", "", ""]);
//   const [years, setYears] = useState([]);
//   const [sections, setSections] = useState([]);

//   const handleDropdownChange = async (index, event) => {
//     const newSelectedOptions = [...selectedOptions];
//     newSelectedOptions[index] = event.target.value;
//     setSelectedOptions(newSelectedOptions);
//     onChange(newSelectedOptions);

//     if (index === 1) {
//       // Fetch years based on selected program
//       try {
//         const response = await fetch(`/api/years/${event.target.value}`);
//         if (response.ok) {
//           const data = await response.json();
//           setYears(data);
//           setSections([]);
//           newSelectedOptions[2] = "";
//           newSelectedOptions[3] = "";
//         } else {
//           console.error('Failed to fetch years');
//         }
//       } catch (error) {
//         console.error('Error fetching years:', error);
//       }
//     } else if (index === 2) {
//       // Fetch sections based on selected program and year
//       try {
//         const response = await fetch(`/api/sections/${newSelectedOptions[1]}/${event.target.value}`);
//         if (response.ok) {
//           const data = await response.json();
//           setSections(data);
//           newSelectedOptions[3] = "";
//         } else {
//           console.error('Failed to fetch sections');
//         }
//       } catch (error) {
//         console.error('Error fetching sections:', error);
//       }
//     }
//   };

//   useEffect(() => {
//     if (selectedOptions[1] === "") {
//       setYears([]);
//       setSections([]);
//     }
//   }, [selectedOptions[1]]);

//   return (
//     <div className="dropdown-container">
//       <select value={selectedOptions[0]} onChange={(e) => handleDropdownChange(0, e)}>
//         <option value="">Select a term</option>
//         <option value="2023/1">2023/1</option>
//         <option value="2023/2">2023/2</option>
//         <option value="2023/3">2023/3</option>
//       </select>
//       <select value={selectedOptions[1]} onChange={(e) => handleDropdownChange(1, e)}>
//         <option value="">Select a program</option>
//         <option value="ICT">ICT</option>
//         <option value="DST">DST</option>
//       </select>
//       <select value={selectedOptions[2]} onChange={(e) => handleDropdownChange(2, e)}>
//         <option value="">Select a year</option>
//         {years.map((year) => (
//           <option key={year} value={year}>{`ปี ${year}`}</option>
//         ))}
//       </select>
//       <select value={selectedOptions[3]} onChange={(e) => handleDropdownChange(3, e)}>
//         <option value="">Select a section</option>
//         {sections.map((section) => (
//           <option key={section} value={section}>{`Sec ${section}`}</option>
//         ))}
//       </select>
//     </div>
//   );
// };

// export default DropdownContainer;

import React, { useState, useEffect } from "react";
import "./DropdownContainer.css";

const DropdownContainer = ({ onChange }) => {
  const [selectedOptions, setSelectedOptions] = useState(["", "", "", ""]);
  const [years, setYears] = useState([]);
  const [sections, setSections] = useState([]);

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
  }, [selectedOptions[1]]);

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
