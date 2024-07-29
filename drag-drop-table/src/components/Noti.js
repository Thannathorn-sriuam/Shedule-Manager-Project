// /components/Noti.js
import React from "react";
import "./Noti.css"; // Make sure to style your notification popup

const Rname = 1;

const Tname = 2;

const notiR = `ห้องซํ้า (${Rname})`;
const notiT = `อาจารย์ซํ้า (${Tname})`;

const Noti = ({ notifications, onClose }) => {
  return (
    <div className="noti-popup">
      <div className="noti-header">
        <div className="noti-item">
          <p className="noti-R">{notiR}</p>
          <input type="checkbox" className="check" />
        </div>
        <div className="noti-item">
          <p className="noti-T">{notiT}</p>
          <input type="checkbox" className="check" />
        </div>
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
