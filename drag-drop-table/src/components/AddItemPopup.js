// import React from "react";

// const AddItemPopup = ({ newItem, setNewItem, handleAddNewItem, subjects, handleClosePopup }) => {
//   return (
//     <div className="add-item-popup">
//       <div className="add-item-popup-inner">
//         <div className="add-item-input-group">
//           <label htmlFor="program">Program:</label>
//           <select
//             id="program"
//             value={newItem.program}
//             onChange={(e) => setNewItem({ ...newItem, program: e.target.value })}
//           >
//             <option value="" disabled>Select a program</option>
//             <option value="ICT">ICT</option>
//             <option value="DST">DST</option>
//           </select>
//         </div>
//         <div className="add-item-input-group">
//           <label htmlFor="year">Year:</label>
//           <select
//             id="year"
//             value={newItem.year}
//             onChange={(e) => setNewItem({ ...newItem, year: e.target.value })}
//           >
//             <option value="" disabled>Select a year</option>
//             <option value="1">1</option>
//             <option value="2">2</option>
//             <option value="3">3</option>
//             <option value="4">4</option>
//           </select>
//         </div>
//         <div className="add-item-input-group">
//           <label htmlFor="section">Section:</label>
//           <select
//             id="section"
//             value={newItem.section}
//             onChange={(e) => setNewItem({ ...newItem, section: e.target.value })}
//           >
//             <option value="" disabled>Select a section</option>
//             <option value="1">1</option>
//             <option value="2">2</option>
//             <option value="3">3</option>
//             <option value="4">4</option>
//           </select>
//         </div>
//         <div className="add-item-input-group">
//           <label htmlFor="subject">Subject:</label>
//           <select
//             id="subject"
//             value={newItem.subject}
//             onChange={(e) => setNewItem({ ...newItem, subject: e.target.value })}
//           >
//             <option value="" disabled>Select a subject</option>
//             {subjects.map((subject) => (
//               <option key={subject.Subject_ID} value={subject.Subject_ID}>
//                 {subject.Subject_ID} - {subject.Subject_Name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="add-item-input-group">
//           <label htmlFor="type">Type:</label>
//           <select
//             id="type"
//             value={newItem.type}
//             onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
//           >
//             <option value="" disabled>Select a type</option>
//             <option value="Lect">Lect</option>
//             <option value="Lab">Lab</option>
//           </select>
//         </div>
//         <button className="add-item-save-button" onClick={handleAddNewItem}>
//           Save
//         </button>
//         <button className="add-item-cancel-button" onClick={handleClosePopup}>
//           Cancel
//         </button>
//       </div>
//       <style jsx>{`
//         .add-item-popup {
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: rgba(0, 0, 0, 0.5);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//         }

//         .add-item-popup-inner {
//           background: #fff;
//           padding: 50px;
//           border-radius: 10px;
//           text-align: center;
//         }

//         .add-item-input-group {
//           display: flex;
//           align-items: center;
//           margin-bottom: 20px;
//         }

//         .add-item-input-group label {
//           margin-right: 10px;
//           font-weight: bold;
//         }

//         .add-item-input-group select {
//           flex: 1;
//           padding: 10px;
//           border: 1px solid #ccc;
//           border-radius: 5px;
//         }

//         .add-item-save-button,
//         .add-item-cancel-button {
//           padding: 10px 20px;
//           font-size: 16px;
//           background-color: #4CAF50;
//           color: white;
//           border: none;
//           border-radius: 5px;
//           cursor: pointer;
//           margin-right: 10px;
//         }

//         .add-item-cancel-button {
//           background-color: #f44336;
//         }

//         .add-item-save-button:hover {
//           background-color: #45a049;
//         }

//         .add-item-cancel-button:hover {
//           background-color: #d32f2f;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AddItemPopup;

// import React, { useState, useEffect } from "react";

// const AddItemPopup = ({ newItem, setNewItem, handleAddNewItem, subjects, handleClosePopup }) => {
//   const handleSubjectChange = (e) => {
//     const selectedSubject = subjects.find(subject => subject.Subject_ID === e.target.value);
//     setNewItem({
//       ...newItem,
//       subject: e.target.value,
//       subjectName: selectedSubject ? selectedSubject.Subject_Name : ''
//     });
//   };

//   return (
//     <div className="add-item-popup">
//       <div className="add-item-popup-inner">
//         <div className="add-item-input-group">
//           <label htmlFor="program">Program:</label>
//           <select
//             id="program"
//             value={newItem.program}
//             onChange={(e) => setNewItem({ ...newItem, program: e.target.value })}
//           >
//             <option value="" disabled>Select a program</option>
//             <option value="ICT">ICT</option>
//             <option value="DST">DST</option>
//           </select>
//         </div>
//         <div className="add-item-input-group">
//           <label htmlFor="year">Year:</label>
//           <select
//             id="year"
//             value={newItem.year}
//             onChange={(e) => setNewItem({ ...newItem, year: e.target.value })}
//           >
//             <option value="" disabled>Select a year</option>
//             <option value="1">1</option>
//             <option value="2">2</option>
//             <option value="3">3</option>
//             <option value="4">4</option>
//           </select>
//         </div>
//         <div className="add-item-input-group">
//           <label htmlFor="section">Section:</label>
//           <select
//             id="section"
//             value={newItem.section}
//             onChange={(e) => setNewItem({ ...newItem, section: e.target.value })}
//           >
//             <option value="" disabled>Select a section</option>
//             <option value="1">1</option>
//             <option value="2">2</option>
//             <option value="3">3</option>
//             <option value="4">4</option>
//           </select>
//         </div>
//         <div className="add-item-input-group">
//           <label htmlFor="subject">Subject:</label>
//           <select
//             id="subject"
//             value={newItem.subject}
//             onChange={handleSubjectChange}
//           >
//             <option value="" disabled>Select a subject</option>
//             {subjects.map((subject) => (
//               <option key={subject.Subject_ID} value={subject.Subject_ID}>
//                 {subject.Subject_ID} - {subject.Subject_Name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="add-item-input-group">
//           <label htmlFor="type">Type:</label>
//           <select
//             id="type"
//             value={newItem.type}
//             onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
//           >
//             <option value="" disabled>Select a type</option>
//             <option value="Lect">Lect</option>
//             <option value="Lab">Lab</option>
//           </select>
//         </div>
//         <button className="add-item-save-button" onClick={handleAddNewItem}>
//           Save
//         </button>
//         <button className="add-item-cancel-button" onClick={handleClosePopup}>
//           Cancel
//         </button>
//       </div>
//       <style jsx>{`
//         .add-item-popup {
//           position: fixed;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: rgba(0, 0, 0, 0.5);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//         }

//         .add-item-popup-inner {
//           background: #fff;
//           padding: 50px;
//           border-radius: 10px;
//           text-align: center;
//         }

//         .add-item-input-group {
//           display: flex;
//           align-items: center;
//           margin-bottom: 20px;
//         }

//         .add-item-input-group label {
//           margin-right: 10px;
//           font-weight: bold;
//         }

//         .add-item-input-group select {
//           flex: 1;
//           padding: 10px;
//           border: 1px solid #ccc;
//           border-radius: 5px;
//         }

//         .add-item-save-button,
//         .add-item-cancel-button {
//           padding: 10px 20px;
//           font-size: 16px;
//           background-color: #4CAF50;
//           color: white;
//           border: none;
//           border-radius: 5px;
//           cursor: pointer;
//           margin-right: 10px;
//         }

//         .add-item-cancel-button {
//           background-color: #f44336;
//         }

//         .add-item-save-button:hover {
//           background-color: #45a049;
//         }

//         .add-item-cancel-button:hover {
//           background-color: #d32f2f;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AddItemPopup;

import React from "react";

const AddItemPopup = ({ subjects, newItem, setNewItem, handleSave, handleClose }) => {
  return (
    <div className="add-item-popup">
      <div className="add-item-popup-inner">
        <h2>Add New Item</h2>
        <div className="input-group">
          <label>Program:</label>
          <select
            value={newItem.program}
            onChange={(e) => setNewItem({ ...newItem, program: e.target.value })}
          >
            <option value="ICT">ICT</option>
            <option value="DST">DST</option>
          </select>
        </div>
        <div className="input-group">
          <label>Year:</label>
          <select
            value={newItem.year}
            onChange={(e) => setNewItem({ ...newItem, year: e.target.value })}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div className="input-group">
          <label>Section:</label>
          <select
            value={newItem.section}
            onChange={(e) => setNewItem({ ...newItem, section: e.target.value })}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div className="input-group">
          <label>Subject:</label>
          <select
            value={newItem.subject}
            onChange={(e) => {
              const selectedSubject = subjects.find(subject => subject.Subject_ID === e.target.value);
              setNewItem({
                ...newItem,
                subject: e.target.value,
                subjectName: selectedSubject ? selectedSubject.Subject_Name : ''
              });
            }}
          >
            {subjects.map((subject) => (
              <option key={subject.Subject_ID} value={subject.Subject_ID}>
                {subject.Subject_ID}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Type:</label>
          <select
            value={newItem.type}
            onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
          >
            <option value="Lect">Lect</option>
            <option value="Lab">Lab</option>
          </select>
        </div>
        <button className="save-button" onClick={handleSave}>Save</button>
        <button className="close-button" onClick={handleClose}>Close</button>
      </div>
      <style jsx>{`
        .add-item-popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .add-item-popup-inner {
          background: #fff;
          padding: 20px;
          border-radius: 10px;
          text-align: center;
        }
        .input-group {
          margin-bottom: 10px;
        }
        .input-group label {
          display: block;
          margin-bottom: 5px;
        }
        .input-group select {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .save-button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .close-button {
          background-color: #f44336;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
};

export default AddItemPopup;
