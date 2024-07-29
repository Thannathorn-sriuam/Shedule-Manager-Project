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
import CSVImportPopup from "./components/CSVImportPopup";
import EditSlot from "./components/EditSlot";
import AddItemPopup from "./components/AddItemPopup";
import Noti from "./components/Noti";

const App = () => {
  const [items, setItems] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(["", "", "", ""]);
  const [showCSVPopup, setShowCSVPopup] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [showAddItemPopup, setShowAddItemPopup] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [showNotiPopup, setShowNotiPopup] = useState(false);
  const [newItem, setNewItem] = useState({
    program: '',
    year: '',
    section: '',
    subject: '',
    subjectName: '',
    type: '',
  });

  const notifications = ["Notification 1", "Notification 2", "Notification 3"];

  const handleDropdownChange = (newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions);
  };

  const displayText = `รายชื่อวิชาของ ${selectedOptions[1]} ${selectedOptions[2]}`;
  const displayText2 = `ตารางเรียน ${selectedOptions[1]} ${selectedOptions[2]} ${selectedOptions[3]}`;

  const getTimeSlot = (rowIndex, duration) => {
    const startHour = Math.floor(8 + rowIndex / 2);
    const startMinute = rowIndex % 2 === 0 ? "00" : "30";
    const endHour = Math.floor(8 + (rowIndex + duration * 2) / 2);
    const endMinute = (rowIndex + duration * 2) % 2 === 0 ? "00" : "30";
    return {
      start: `${startHour}:${startMinute}`,
      end: `${endHour}:${endMinute}`
    };
  };

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

      const { start, end } = getTimeSlot(row, item.duration);

      fetch(`/api/update-slot-date-time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: item.slot_id,
          date: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][col - 1],
          time: `${start}-${end}`,
        }),
      })
        .then(response => response.json())
        .then(data => console.log('Slot date and time updated successfully:', data))
        .catch((error) => console.error('Error updating slot date and time:', error));
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

      const { start, end } = getTimeSlot(newRow, item.duration);

      fetch(`/api/update-slot-date-time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: item.slot_id,
          date: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][newCol - 1],
          time: `${start}-${end}`,
        }),
      })
        .then(response => response.json())
        .then(data => console.log('Slot date and time updated successfully:', data))
        .catch((error) => console.error('Error updating slot date and time:', error));
    }
  };

  const handleItemClick = (item) => {
    console.log("Clicked item: ", item);
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

      const { start, end } = getTimeSlot(currentItem.row, currentItem.duration);

      fetch(`/api/update-slot-duration-time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: currentItem.slot_id,
          duration: currentItem.duration,
          time: `${start}-${end}`,
          room: currentItem.room,
        }),
      })
        .then(response => response.json())
        .then(data => console.log('Slot duration, time, and room updated successfully:', data))
        .catch((error) => console.error('Error updating slot duration, time, and room:', error));
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
    setShowCSVPopup(true);
  };

  const handleCloseCSVPopup = () => {
    setShowCSVPopup(false);
  };

  const handleAddNewItem = () => {
    // Add new item to database
    fetch(`/api/add-slot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Course: newItem.program,
        C_Year: newItem.year,
        Section: newItem.section,
        Subject_ID: newItem.subject,
        Subject_Name: newItem.subjectName,
        Subject_Type: newItem.type,
      }),
    })
      .then(response => response.json())
      .then(data => {
        // Update UI without refresh
        const newSlot = {
          id: newItem.subject,
          name: `${newItem.subjectName} (${newItem.type})`,
          duration: 1,
          slot_id: data.insertId,
        };
        setItems((prevItems) => [...prevItems, newSlot]);
        setShowAddItemPopup(false);
      })
      .catch((error) => console.error('Error adding new slot:', error));
  };

  useEffect(() => {
    document.title = "my page";
  }, []);

  useEffect(() => {
    if (selectedOptions[1] && selectedOptions[2] && selectedOptions[3]) {
      fetch(`/api/slots/${selectedOptions[1]}/${selectedOptions[2]}/${selectedOptions[3]}`)
        .then((response) => response.json())
        .then((data) => {
          const formattedItems = data.map((item) => ({
            id: item.Subject_ID,
            name: `${item.Subject_Name} (${item.Subject_Type})`,
            duration: item.Duration || 1,
            slot_id: item.slot_id
          }));
          setItems(formattedItems);
        })
        .catch((error) => console.error('Error fetching slots:', error));
    }
  }, [selectedOptions]);

  useEffect(() => {
    fetch('/api/rooms')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched rooms: ", data);
        setRooms(data);
      })
      .catch((error) => console.error('Error fetching rooms:', error));
  }, []);

  useEffect(() => {
    fetch('/api/subjects')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched subjects: ", data);
        setSubjects(data);
      })
      .catch((error) => console.error('Error fetching subjects:', error));
  }, []);

  const displayTextClass = selectedOptions[2] === "1" ? "yellow-background" :
    selectedOptions[2] === "2" ? "pink-background" :
      selectedOptions[2] === "3" ? "green-background" :
        selectedOptions[2] === "4" ? "blue-background" : "";

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
            <div className="floating">
              <div className="selected-text">
                <p className={displayTextClass}>{displayText}</p>
              </div>
              <div className={displayTextClass}>
                <div className="items">
                  {items.map((item) => (
                    <DraggableItem key={item.id} item={item} />
                  ))}
                  <button onClick={() => setShowAddItemPopup(true)}>+ Add Item</button>
                </div>
              </div>

              </div>
              <div className="selected-text">
                <p className={displayTextClass}>{displayText2}</p>
              </div>
              <ScheduleTable
                schedule={schedule}
                addToSchedule={handleItemDrop}
                removeFromSchedule={handleRemoveItem}
                onItemClick={handleItemClick}
                moveItem={moveItem}
              />

              {showPopup && (
                <EditSlot
                  currentItem={currentItem}
                  setCurrentItem={setCurrentItem}
                  handleSaveEdit={handleSaveEdit}
                  rooms={rooms}
                />
              )}

            </>
            )}
            {showCSVPopup && (
              <CSVImportPopup onClose={handleCloseCSVPopup} />
            )}

            {showAddItemPopup && (
              <AddItemPopup
                subjects={subjects}
                newItem={newItem}
                setNewItem={setNewItem}
                handleSave={handleAddNewItem}
                handleClose={() => setShowAddItemPopup(false)}
              />
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
