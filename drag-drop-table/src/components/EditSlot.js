import React from "react";

const EditSlot = ({ currentItem, setCurrentItem, handleSaveEdit }) => {
  return (
    <div className="popup">
      <h2>Edit Scheduled Item</h2>
      <input
        type="text"
        value={currentItem.name}
        onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
      />
      <label>
        Duration:
        <input
          type="number"
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
      </label>
      <button onClick={handleSaveEdit}>Save</button>
    </div>
  );
};

export default EditSlot;
