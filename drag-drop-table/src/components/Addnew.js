// src/components/Addnew.js
import React, { useState } from 'react';

const Addnew = ({ onAddItem }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemDuration, setItemDuration] = useState(1);

  const handleOpenPopup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  const handleAddItem = () => {
    if (itemName) {
      onAddItem({ id: Date.now(), name: itemName, duration: itemDuration });
      setItemName('');
      setItemDuration(1);
      handleClosePopup();
    }
  };

  return (
    <>
      <button onClick={handleOpenPopup} style={styles.button}>
        + Add Item
      </button>
      {showPopup && (
        <div style={styles.popup}>
          <div style={styles.popupInner}>
            <h3>Add New Item</h3>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Item Name"
              style={styles.input}
            />
            <input
              type="number"
              value={itemDuration}
              onChange={(e) => setItemDuration(Number(e.target.value))}
              placeholder="Duration"
              min="1"
              style={styles.input}
            />
            <button onClick={handleAddItem} style={styles.addButton}>Add</button>
            <button onClick={handleClosePopup} style={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

// Styles in JS
const styles = {
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  popup: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  },
  popupInner: {
    background: '#fff',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    width: '300px',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    width: '100%',
    boxSizing: 'border-box',
  },
  addButton: {
    margin: '5px',
    padding: '10px',
    background: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  cancelButton: {
    margin: '5px',
    padding: '10px',
    background: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Addnew;
