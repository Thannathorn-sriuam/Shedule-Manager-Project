import React, { useState } from "react";
import "./CSVImportPopup.css";

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
    <div className="popup">
      <h2>Import CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleImport}>Import</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CSVImportPopup;
