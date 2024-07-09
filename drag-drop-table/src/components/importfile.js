import React from 'react';

const ImportFilePopup = ({ onClose }) => {
  return (
    <div className="import-file-popup">
      <div className="import-file-popup-inner">
        <h2>Import File</h2>
        <input className="file-input" type="file" />
        <div className="popup-buttons">
          <button className="save-button" onClick={onClose}>Save</button>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
      <style jsx>{`
        .import-file-popup {
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

        .import-file-popup-inner {
          background: #fff;
          padding: 50px;
          border-radius: 10px;
          text-align: center;
          border: 2px solid #ccc;
        }

        .file-input {
          margin: 20px 0;
          padding: 10px;
          border: 2px solid #ccc;
          border-radius: 5px;
        }

        .popup-buttons {
          display: flex;
          justify-content: center;
          gap: 20px; /* Adding space between buttons */
        }

        .save-button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .save-button:hover {
          background-color: #45a049;
        }

        .cancel-button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .cancel-button:hover {
          background-color: #e53935;
        }
      `}</style>
    </div>
  );
};

export default ImportFilePopup;
