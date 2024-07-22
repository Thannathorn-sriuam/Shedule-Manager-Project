// /components/Noti.js
import React from "react";
import "./Noti.css"; // Make sure to style your notification popup

const Noti = ({ notifications, onClose }) => {
  return (
    <div className="noti-popup">
      <div className="noti-header">
        <h3>Notifications</h3>
        <button className="close-button" onClick={onClose}>X</button>
      </div>
      <div className="noti-body">
        {notifications.length > 0 ? (
          notifications.map((noti, index) => (
            <div key={index} className="noti-item">
              {noti}
            </div>
          ))
        ) : (
          <div className="noti-item">No notifications</div>
        )}
      </div>
    </div>
  );
};

export default Noti;
