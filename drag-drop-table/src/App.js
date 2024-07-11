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
import EditSlot from "./components/EditSlot";

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

  const displayTextClass = selectedOptions[2] === "ปี1" ? "yellow-background" :
    selectedOptions[2] === "ปี2" ? "pink-background" :
      selectedOptions[2] === "ปี3" ? "green-background" :
        selectedOptions[2] === "ปี4" ? "blue-background" : "";

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <header>
          <ul>
            <li><img src={imgg} alt="Logo" className="Logo" /></li>
            <li><img src={filem} alt="filem" className="filem" onClick={() => setShowImportPopup(true)} /></li>
            <li><img src={noti} alt="Bell" className="Bell" /></li>
          </ul>
        </header>
        <DropdownContainer onChange={handleDropdownChange} />
        {selectedOptions[0] && selectedOptions[1] && (
          <>
            <div className="floating">
              <div className="selected-text">
                <p className={displayTextClass}>{displayText}</p>
              </div>
              <div className={displayTextClass}>
                <div className="items">
                  {items.map((item) => (
                    <DraggableItem key={item.id} item={item} selectedYear={selectedOptions[2]} />
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
              </div>
            </div>
          </>
        )}
        {selectedOptions[1] && selectedOptions[2] && selectedOptions[3] && (
          <>
            <div className="selected-text">
              <p className={displayTextClass}>{displayText2}</p>
            </div>

            <ScheduleTable
              schedule={schedule}
              addToSchedule={handleItemDrop}
              removeFromSchedule={handleRemoveItem}
              onItemClick={handleItemClick}
              moveItem={moveItem}
              items={items}
              selectedYear={selectedOptions[2]}
            />
            {showPopup && (
              <EditSlot
                currentItem={currentItem}
                setCurrentItem={setCurrentItem}
                handleSaveEdit={handleSaveEdit}
              />
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
