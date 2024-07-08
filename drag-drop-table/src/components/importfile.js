// importfile.js
import React from 'react';

const ImportFilePopup = ({ onClose }) => {
  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Import File</h2>
        <input type="file" />
        <div className="popup-buttons">
          <button onClick={onClose}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ImportFilePopup;
