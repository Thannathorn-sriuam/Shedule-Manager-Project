import React from "react";

const EditSlot = ({ currentItem, setCurrentItem, handleSaveEdit, rooms }) => {
  return (
    <div className="edit-slot-popup">
      <div className="edit-slot-popup-inner">
        <div className="edit-slot-input-group">
          <label htmlFor="itemName">Subject Name:</label>
          <input
            type="text"
            id="itemName"
            value={currentItem.name}
            onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
          />
        </div>
        <div className="edit-slot-input-group">
          <label htmlFor="itemAjName">Aj. Name:</label>
          <select
            type="text"
            id="itemAjName"
            value={currentItem.ajName || ""}
            onChange={(e) => setCurrentItem({ ...currentItem, ajName: e.target.value })}
          >
            <option value="" disabled>Select Aj</option>
            {rooms.map((room) => (
              <option key={room.name} value={room.name}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
        <div className="edit-slot-input-group">
          <label htmlFor="itemRoom">Room:</label>
          <select
            id="itemRoom"
            value={currentItem.room || ""}
            onChange={(e) => setCurrentItem({ ...currentItem, room: e.target.value })}
          >
            <option value="" disabled>Select a room</option>
            {rooms.map((room) => (
              <option key={room.name} value={room.name}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
        <div className="edit-slot-input-group">
          <label htmlFor="itemDuration">Duration:</label>
          <input
            type="number"
            id="itemDuration"
            value={currentItem.duration}
            onChange={(e) =>
              setCurrentItem({
                ...currentItem,
                duration: parseFloat(e.target.value),
              })
            }
            min="0.5"
            max="4"
            step="0.5"
          />
        </div>
        <button className="edit-slot-save-button" onClick={handleSaveEdit}>
          Save
        </button>
      </div>
      <style jsx>{`
        .edit-slot-popup {
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

        .edit-slot-popup-inner {
          background: #fff;
          padding: 50px;
          border-radius: 10px;
          text-align: center;
        }

        .edit-slot-input-group {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
        }

        .edit-slot-input-group label {
          margin-right: 10px;
          font-weight: bold;
        }

        .edit-slot-input-group input,
        .edit-slot-input-group select {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
        }

        .edit-slot-save-button {
          padding: 10px 20px;
          font-size: 16px;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .edit-slot-save-button:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
};

export default EditSlot;

