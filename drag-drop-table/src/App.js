import React, { useState, useEffect } from "react";
import ScheduleTable from "./components/ScheduleTable";
import DraggableItem from "./components/DraggableItem";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./index.css";
import imgg from "./logoict 2.png";
import noti from "./notifications.png";
import DropdownContainer from "./components/DropdownContainer";
import filem from "./bookmark_manager.png";
import ImportFilePopup from "./components/importfile";

const App = () => {
  const [items, setItems] = useState([
    { id: 1, name: "Python", duration: 1.5 },
    { id: 2, name: "Java", duration: 2 },
    { id: 3, name: "Yoga", duration: 1 },
  ]);
  const [schedule, setSchedule] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showImportPopup, setShowImportPopup] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(["", "", "", ""]);

  const handleDropdownChange = (newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions);
  };

  const displayText = `รายชื่อวิชาของ ${selectedOptions[1]} ${selectedOptions[2]}`;
  const displayText2 = `ตารางเรียน ${selectedOptions[1]} ${selectedOptions[2]} ${selectedOptions[3]}`;

  const handleItemDrop = (item, row, col) => {
    const newItem = {
      ...item,
      row,
      col,
      scheduleId: schedule.length + 1,
    };

    const conflict = schedule.some(
      (scheduledItem) =>
        scheduledItem.col === col &&
        (
          (scheduledItem.row <= row && scheduledItem.row + scheduledItem.duration > row) ||
          (row <= scheduledItem.row && row + item.duration > scheduledItem.row)
        )
    );

    if (!conflict) {
      setSchedule((prevSchedule) => [...prevSchedule, newItem]);
      setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
    }
  };

  const moveItem = (item, newRow, newCol) => {
    const conflict = schedule.some(
      (scheduledItem) =>
        scheduledItem.col === newCol &&
        (
          (scheduledItem.row <= newRow && scheduledItem.row + scheduledItem.duration > newRow) ||
          (newRow <= scheduledItem.row && newRow + item.duration > scheduledItem.row)
        )
    );

    if (!conflict) {
      setSchedule((prevSchedule) =>
        prevSchedule.map((scheduledItem) =>
          scheduledItem.scheduleId === item.scheduleId
            ? { ...scheduledItem, row: newRow, col: newCol }
            : scheduledItem
        )
      );
    }
  };

  const handleItemClick = (item) => {
    setCurrentItem(item);
    setShowPopup(true);
  };

  const handleSaveEdit = () => {
    if (currentItem) {
      setSchedule((prevSchedule) =>
        prevSchedule.map((item) =>
          item.scheduleId === currentItem.scheduleId ? currentItem : item
        )
      );
    }
    setShowPopup(false);
    setCurrentItem(null);
  };

  const handleRemoveItem = (scheduleId) => {
    const itemToRemove = schedule.find((item) => item.scheduleId === scheduleId);
    setSchedule((prevSchedule) =>
      prevSchedule.filter((item) => item.scheduleId !== scheduleId)
    );
    setItems((prevItems) => [...prevItems, itemToRemove]);
  };

  useEffect(() => {
    document.title = "my page";
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <header>
          <ul>
            <li><img src={imgg} alt="Logo" className="Logo"  /></li>
            <li><img src={filem} alt="filem" className="filem" onClick={() => setShowImportPopup(true)} /></li>
            <li><img src={noti} alt="Bell" className="Bell"  /></li>
          </ul>
        </header>
        <DropdownContainer onChange={handleDropdownChange} />
        {selectedOptions[0] && selectedOptions[1] && (
          <>
            <div className="selected-text">
              <p>{displayText}</p>
            </div>
            <div className="items">
              {items.map((item) => (
                <DraggableItem key={item.id} item={item} />
              ))}
              <button
                onClick={() =>
                  setItems((prevItems) => [
                    ...prevItems,
                    { id: prevItems.length + 1, name: "New Item", duration: 1 },
                  ])
                }
              >
                + Add Item
              </button>
            </div>
          </>
        )}
        {selectedOptions[1] && selectedOptions[2] && selectedOptions[3] && (
          <>
            <div className="selected-text">
              <p>{displayText2}</p>
            </div>
            <div>
              
            </div>
            <ScheduleTable
              schedule={schedule}
              addToSchedule={handleItemDrop}
              removeFromSchedule={handleRemoveItem}
              onItemClick={handleItemClick}
              moveItem={moveItem}
              items={items}
            />
            {showPopup && (
              <div className="popup">
                <h2>Edit Scheduled Item</h2>
                <input
                  type="text"
                  value={currentItem.name}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, name: e.target.value })
                  }
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
            )}
            {showImportPopup && (
              <ImportFilePopup onClose={() => setShowImportPopup(false)} />
            )}
          </>
        )}
      </div>
      <footer></footer>
    </DndProvider>
  );
};

export default App;
