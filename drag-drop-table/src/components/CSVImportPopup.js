import React, { useState } from "react";
// import "./CSVImportPopup.css";

const CSVImportPopup = ({ onClose }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch('/api/import-csv', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to import CSV');
        }

        const result = await response.text();
        console.log(result); // แสดงผลลัพธ์จาก backend ใน console
        onClose(); // ปิด popup หลังจาก import เสร็จสิ้น
      } catch (error) {
        console.error('Error importing CSV:', error);
        // จัดการข้อผิดพลาดที่เกิดขึ้น เช่น แสดงข้อความแจ้งเตือนผู้ใช้
      }
    } else {
      console.error('No file selected');
      // จัดการกรณีที่ไม่ได้เลือกไฟล์ CSV
    }
  };

  return (
    <div className="import-file-popup">
      <div className="import-file-popup-inner">
        <h2>Import CSV</h2>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <div className="popup-buttons">
          <button className="save-button" onClick={handleImport}>Import</button>
          <button className="cancel-button" onClick={onClose}>Close</button>
        </div>
      </div>
      <style jsx>{`
        .import-file-popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 10px;
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

export default CSVImportPopup;
