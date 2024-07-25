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
import CSVImportPopup from "./components/CSVImportPopup"; // เพิ่มการ import CSVImportPopup
import Noti from "./components/Noti"; // add 
import EditSlot from "./components/EditSlot";//add

const App = () => {
  const [items, setItems] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(["", "", "", ""]);
  const [showCSVPopup, setShowCSVPopup] = useState(false); // เพิ่มสถานะสำหรับ CSV popup
  const [showNotiPopup, setShowNotiPopup] = useState(false); // add

  const notifications = ["Notification 1", "Notification 2", "Notification 3"]; // add test

  const handleDropdownChange = (newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions);
  };

  const displayText = `รายชื่อวิชาของ ${selectedOptions[1]} ${selectedOptions[2]}`;
  const displayText2 = `ตารางเรียน ${selectedOptions[1]} ปี${selectedOptions[2]} Sec${selectedOptions[3]}`;

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

      // Debugging output
      console.log(`Updating slot date: slotId=${item.slot_id}, date=${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][col - 1]}`);

      // Update the date column in the database
      fetch(`/api/update-slot-date`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: item.slot_id,
          date: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][col - 1],
        }),
      })
        .then(response => response.json())
        .then(data => console.log('Slot date updated successfully:', data))
        .catch((error) => console.error('Error updating slot date:', error));
    }
  };

  const moveItem = (item, newRow, newCol) => {
    const conflict = schedule.some(
      (scheduledItem) =>
        scheduledItem.scheduleId !== item.scheduleId &&
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
  
      // Debugging output
      console.log(`Updating slot date: slotId=${item.slot_id}, date=${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][newCol - 1]}`);
  
      // Update the date column in the database
      fetch(`/api/update-slot-date`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: item.slot_id,
          date: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][newCol - 1],
        }),
      })
        .then(response => response.json())
        .then(data => console.log('Slot date updated successfully:', data))
        .catch((error) => console.error('Error updating slot date:', error));
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

      // Update the duration in the database
      fetch(`/api/update-slot-duration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: currentItem.slot_id,
          duration: currentItem.duration,
        }),
      }).catch((error) => console.error('Error updating slot duration:', error));
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

  const handleCSVImportClick = () => {
    setShowCSVPopup(true); // เปิด CSV popup
  };

  const handleCloseCSVPopup = () => {
    setShowCSVPopup(false); // ปิด CSV popup
  };

  useEffect(() => {
    document.title = "my page";
  }, []);

  const displayTextClass = selectedOptions[2] === "1" ? "yellow-background" :
    selectedOptions[2] === "2" ? "pink-background" :
      selectedOptions[2] === "3" ? "green-background" :
        selectedOptions[2] === "4" ? "blue-background" : "";

  useEffect(() => {
    if (selectedOptions[1] && selectedOptions[2] && selectedOptions[3]) {
      fetch(`/api/slots/${selectedOptions[1]}/${selectedOptions[2]}/${selectedOptions[3]}`)
        .then((response) => response.json())
        .then((data) => {
          const formattedItems = data.map((item) => ({
            id: item.Subject_ID,
            name: `${item.Subject_Name} (${item.Subject_Type})`,
            duration: item.Duration || 1, // Fetch duration from server if available
            slot_id: item.slot_id // Fetch slot_id from server if available
          }));
          setItems(formattedItems);
        })
        .catch((error) => console.error('Error fetching slots:', error));
    }
  }, [selectedOptions]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <header>
          <ul>
            <li><img src={imgg} alt="Logo" className="Logo" /></li>
            <li><img src={filem} alt="filem" className="filem" onClick={handleCSVImportClick} /></li>
            <li><img src={noti} alt="Bell" className="Bell" onClick={() => setShowNotiPopup(true)} /></li>
          </ul>
        </header>
        <DropdownContainer onChange={handleDropdownChange} />
        {selectedOptions.every(option => option) && (
          <>
            {/* add flaoting */}
            <div className="floating">
              <div className="selected-text">
                <p className={displayTextClass}>{displayText}</p>
              </div>
              <div className={displayTextClass}>
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
              </div>
            </div>
            {/* edit */}
            <div className="selected-text">
              <p className={displayTextClass}>{displayText2}</p>
            </div>
            <ScheduleTable
              schedule={schedule}
              addToSchedule={handleItemDrop}
              removeFromSchedule={handleRemoveItem}
              onItemClick={handleItemClick}
              moveItem={moveItem}
              selectedYear={selectedOptions[2]}
            />
             {showPopup && (
              <EditSlot //new
                currentItem={currentItem}
                setCurrentItem={setCurrentItem}
                handleSaveEdit={handleSaveEdit}
              />
            )}
          </>
        )}
        {showCSVPopup && (
          <CSVImportPopup onClose={handleCloseCSVPopup} />
        )}
        {showNotiPopup && ( //edit
          <Noti notifications={notifications} onClose={() => setShowNotiPopup(false)} />
        )}
      </div>
      <footer></footer>
    </DndProvider>
  );
};

export default App;
