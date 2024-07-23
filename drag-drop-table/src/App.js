// import React, { useState, useEffect } from "react";
// import ScheduleTable from "./components/ScheduleTable";
// import DraggableItem from "./components/DraggableItem";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import "./index.css";
// import imgg from "./logoict 2.png";
// import noti from "./notifications.png";
// import DropdownContainer from "./components/DropdownContainer";
// import filem from "./bookmark_manager.png";
// import CSVImportPopup from "./components/CSVImportPopup"; // เพิ่มการ import CSVImportPopup

// const App = () => {
//   const [items, setItems] = useState([]);
//   const [schedule, setSchedule] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [currentItem, setCurrentItem] = useState(null);
//   const [selectedOptions, setSelectedOptions] = useState(["", "", "", ""]);
//   const [showCSVPopup, setShowCSVPopup] = useState(false); // เพิ่มสถานะสำหรับ CSV popup

//   const handleDropdownChange = (newSelectedOptions) => {
//     setSelectedOptions(newSelectedOptions);
//   };

//   const displayText = `รายชื่อวิชาของ ${selectedOptions[1]} ${selectedOptions[2]}`;
//   const displayText2 = `ตารางเรียน ${selectedOptions[1]} ${selectedOptions[2]} ${selectedOptions[3]}`;

//   const handleItemDrop = (item, row, col) => {
//     const newItem = {
//       ...item,
//       row,
//       col,
//       scheduleId: schedule.length + 1,
//     };

//     const conflict = schedule.some(
//       (scheduledItem) =>
//         scheduledItem.col === col &&
//         (
//           (scheduledItem.row <= row && scheduledItem.row + scheduledItem.duration > row) ||
//           (row <= scheduledItem.row && row + item.duration > scheduledItem.row)
//         )
//     );

//     if (!conflict) {
//       setSchedule((prevSchedule) => [...prevSchedule, newItem]);
//       setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
//       // Update the date column in the database
//       fetch(`/api/update-slot-date`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           slotId: item.slot_id, // Use slot_id for update
//           date: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][col - 1],
//         }),
//       }).then(response => {
//         if (response.ok) {
//           console.log('Slot date updated successfully');
//         } else {
//           console.error('Failed to update slot date');
//         }
//       }).catch((error) => console.error('Error updating slot date:', error));
//     }
//   };

//   const moveItem = (item, newRow, newCol) => {
//     const conflict = schedule.some(
//       (scheduledItem) =>
//         scheduledItem.col === newCol &&
//         (
//           (scheduledItem.row <= newRow && scheduledItem.row + scheduledItem.duration > newRow) ||
//           (newRow <= scheduledItem.row && newRow + item.duration > scheduledItem.row)
//         )
//     );

//     if (!conflict) {
//       setSchedule((prevSchedule) =>
//         prevSchedule.map((scheduledItem) =>
//           scheduledItem.scheduleId === item.scheduleId
//             ? { ...scheduledItem, row: newRow, col: newCol }
//             : scheduledItem
//         )
//       );
//       // Update the date column in the database
//       fetch(`/api/update-slot-date`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           slotId: item.slot_id, // Use slot_id for update
//           date: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][newCol - 1],
//         }),
//       }).then(response => {
//         if (response.ok) {
//           console.log('Slot date updated successfully');
//         } else {
//           console.error('Failed to update slot date');
//         }
//       }).catch((error) => console.error('Error updating slot date:', error));
//     }
//   };

//   const handleItemClick = (item) => {
//     setCurrentItem(item);
//     setShowPopup(true);
//   };

//   const handleSaveEdit = () => {
//     if (currentItem) {
//       setSchedule((prevSchedule) =>
//         prevSchedule.map((item) =>
//           item.scheduleId === currentItem.scheduleId ? currentItem : item
//         )
//       );
//     }
//     setShowPopup(false);
//     setCurrentItem(null);
//   };

//   const handleRemoveItem = (scheduleId) => {
//     const itemToRemove = schedule.find((item) => item.scheduleId === scheduleId);
//     setSchedule((prevSchedule) =>
//       prevSchedule.filter((item) => item.scheduleId !== scheduleId)
//     );
//     setItems((prevItems) => [...prevItems, itemToRemove]);
//   };

//   const handleCSVImportClick = () => {
//     setShowCSVPopup(true); // เปิด CSV popup
//   };

//   const handleCloseCSVPopup = () => {
//     setShowCSVPopup(false); // ปิด CSV popup
//   };

//   useEffect(() => {
//     document.title = "my page";
//   }, []);

//   useEffect(() => {
//     if (selectedOptions[1] && selectedOptions[2] && selectedOptions[3]) {
//       fetch(`/api/slots/${selectedOptions[1]}/${selectedOptions[2]}/${selectedOptions[3]}`)
//         .then((response) => response.json())
//         .then((data) => {
//           const formattedItems = data.map((item) => ({
//             id: item.Subject_ID,
//             slot_id: item.slot_id, // Add slot_id here
//             name: `${item.Subject_Name} (${item.Subject_Type})`,
//             duration: 1,
//           }));
//           setItems(formattedItems);
//         })
//         .catch((error) => console.error('Error fetching slots:', error));
//     }
//   }, [selectedOptions]);

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="App">
//         <header>
//           <ul>
//             <li><img src={imgg} alt="Logo" className="Logo" /></li>
//             <li><img src={filem} alt="filem" className="filem" onClick={handleCSVImportClick} /></li>
//             <li><img src={noti} alt="Bell" className="Bell" /></li>
//           </ul>
//         </header>
//         <DropdownContainer onChange={handleDropdownChange} />
//         {selectedOptions[0] && selectedOptions[1] && (
//           <>
//             <div className="selected-text">
//               <p>{displayText}</p>
//             </div>
//             <div className="items">
//               {items.map((item) => (
//                 <DraggableItem key={item.id} item={item} />
//               ))}
//               <button
//                 onClick={() =>
//                   setItems((prevItems) => [
//                     ...prevItems,
//                     { id: prevItems.length + 1, name: "New Item", duration: 1 },
//                   ])
//                 }
//               >
//                 + Add Item
//               </button>
//             </div>
//           </>
//         )}
//         {selectedOptions[1] && selectedOptions[2] && selectedOptions[3] && (
//           <>
//             <div className="selected-text">
//               <p>{displayText2}</p>
//             </div>
//             <ScheduleTable
//               schedule={schedule}
//               addToSchedule={handleItemDrop}
//               removeFromSchedule={handleRemoveItem}
//               onItemClick={handleItemClick}
//               moveItem={moveItem}
//             />
//             {showPopup && (
//               <div className="popup">
//                 <h2>Edit Scheduled Item</h2>
//                 <input
//                   type="text"
//                   value={currentItem.name}
//                   onChange={(e) =>
//                     setCurrentItem({ ...currentItem, name: e.target.value })
//                   }
//                 />
//                 <label>
//                   Duration:
//                   <input
//                     type="number"
//                     value={currentItem.duration}
//                     onChange={(e) =>
//                       setCurrentItem({
//                         ...currentItem,
//                         duration: parseFloat(e.target.value),
//                       })
//                     }
//                     min="0.5"
//                     max="4"
//                     step="0.5"
//                   />
//                 </label>
//                 <button onClick={handleSaveEdit}>Save</button>
//               </div>
//             )}
//           </>
//         )}
//         {showCSVPopup && (
//           <CSVImportPopup onClose={handleCloseCSVPopup} />
//         )}
//       </div>
//       <footer></footer>
//     </DndProvider>
//   );
// };

// export default App;


// import React, { useState, useEffect } from "react";
// import ScheduleTable from "./components/ScheduleTable";
// import DraggableItem from "./components/DraggableItem";
// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";
// import "./index.css";
// import imgg from "./logoict 2.png";
// import noti from "./notifications.png";
// import DropdownContainer from "./components/DropdownContainer";
// import filem from "./bookmark_manager.png";
// import CSVImportPopup from "./components/CSVImportPopup"; // เพิ่มการ import CSVImportPopup

// const App = () => {
//   const [items, setItems] = useState([]);
//   const [schedule, setSchedule] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [currentItem, setCurrentItem] = useState(null);
//   const [selectedOptions, setSelectedOptions] = useState(["", "", "", ""]);
//   const [showCSVPopup, setShowCSVPopup] = useState(false); // เพิ่มสถานะสำหรับ CSV popup

//   const handleDropdownChange = (newSelectedOptions) => {
//     setSelectedOptions(newSelectedOptions);
//   };

//   const displayText = `รายชื่อวิชาของ ${selectedOptions[1]} ${selectedOptions[2]}`;
//   const displayText2 = `ตารางเรียน ${selectedOptions[1]} ${selectedOptions[2]} ${selectedOptions[3]}`;

//   const handleItemDrop = (item, row, col) => {
//     const newItem = {
//       ...item,
//       row,
//       col,
//       scheduleId: schedule.length + 1,
//     };

//     const conflict = schedule.some(
//       (scheduledItem) =>
//         scheduledItem.col === col &&
//         (
//           (scheduledItem.row <= row && scheduledItem.row + scheduledItem.duration > row) ||
//           (row <= scheduledItem.row && row + item.duration > scheduledItem.row)
//         )
//     );

//     if (!conflict) {
//       setSchedule((prevSchedule) => [...prevSchedule, newItem]);
//       setItems((prevItems) => prevItems.filter((i) => i.id !== item.id));

//       // Debugging output
//       console.log(`Updating slot date: subjectId=${item.id}, date=${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][col - 1]}, section=${selectedOptions[3]}`);

//       // Update the date column in the database
//       fetch(`/api/update-slot-date`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           subjectId: item.id,
//           date: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][col - 1],
//           section: selectedOptions[3]
//         }),
//       })
//       .then(response => response.json())
//       .then(data => console.log('Slot date updated successfully:', data))
//       .catch((error) => console.error('Error updating slot date:', error));
//     }
//   };

//   const moveItem = (item, newRow, newCol) => {
//     const conflict = schedule.some(
//       (scheduledItem) =>
//         scheduledItem.col === newCol &&
//         (
//           (scheduledItem.row <= newRow && scheduledItem.row + scheduledItem.duration > newRow) ||
//           (newRow <= scheduledItem.row && newRow + item.duration > scheduledItem.row)
//         )
//     );

//     if (!conflict) {
//       setSchedule((prevSchedule) =>
//         prevSchedule.map((scheduledItem) =>
//           scheduledItem.scheduleId === item.scheduleId
//             ? { ...scheduledItem, row: newRow, col: newCol }
//             : scheduledItem
//         )
//       );

//       // Debugging output
//       console.log(`Updating slot date: subjectId=${item.id}, date=${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][newCol - 1]}, section=${selectedOptions[3]}`);

//       // Update the date column in the database
//       fetch(`/api/update-slot-date`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           subjectId: item.id,
//           date: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][newCol - 1],
//           section: selectedOptions[3]
//         }),
//       })
//       .then(response => response.json())
//       .then(data => console.log('Slot date updated successfully:', data))
//       .catch((error) => console.error('Error updating slot date:', error));
//     }
//   };

//   const handleItemClick = (item) => {
//     setCurrentItem(item);
//     setShowPopup(true);
//   };

//   const handleSaveEdit = () => {
//     if (currentItem) {
//       setSchedule((prevSchedule) =>
//         prevSchedule.map((item) =>
//           item.scheduleId === currentItem.scheduleId ? currentItem : item
//         )
//       );

//       // Update the duration in the database
//       fetch(`/api/update-slot-duration`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           subjectId: currentItem.id,
//           duration: currentItem.duration,
//           section: selectedOptions[3]
//         }),
//       }).catch((error) => console.error('Error updating slot duration:', error));
//     }
//     setShowPopup(false);
//     setCurrentItem(null);
//   };

//   const handleRemoveItem = (scheduleId) => {
//     const itemToRemove = schedule.find((item) => item.scheduleId === scheduleId);
//     setSchedule((prevSchedule) =>
//       prevSchedule.filter((item) => item.scheduleId !== scheduleId)
//     );
//     setItems((prevItems) => [...prevItems, itemToRemove]);
//   };

//   const handleCSVImportClick = () => {
//     setShowCSVPopup(true); // เปิด CSV popup
//   };

//   const handleCloseCSVPopup = () => {
//     setShowCSVPopup(false); // ปิด CSV popup
//   };

//   useEffect(() => {
//     document.title = "my page";
//   }, []);

//   useEffect(() => {
//     if (selectedOptions[1] && selectedOptions[2] && selectedOptions[3]) {
//       fetch(`/api/slots/${selectedOptions[1]}/${selectedOptions[2]}/${selectedOptions[3]}`)
//         .then((response) => response.json())
//         .then((data) => {
//           const formattedItems = data.map((item) => ({
//             id: item.Subject_ID,
//             name: `${item.Subject_Name} (${item.Subject_Type})`,
//             duration: item.Duration || 1, // Fetch duration from server if available
//           }));
//           setItems(formattedItems);
//         })
//         .catch((error) => console.error('Error fetching slots:', error));
//     }
//   }, [selectedOptions]);

//   return (
//     <DndProvider backend={HTML5Backend}>
//       <div className="App">
//         <header>
//           <ul>
//             <li><img src={imgg} alt="Logo" className="Logo" /></li>
//             <li><img src={filem} alt="filem" className="filem" onClick={handleCSVImportClick} /></li>
//             <li><img src={noti} alt="Bell" className="Bell" /></li>
//           </ul>
//         </header>
//         <DropdownContainer onChange={handleDropdownChange} />
//         {selectedOptions[0] && selectedOptions[1] && (
//           <>
//             <div className="selected-text">
//               <p>{displayText}</p>
//             </div>
//             <div className="items">
//               {items.map((item) => (
//                 <DraggableItem key={item.id} item={item} />
//               ))}
//               <button
//                 onClick={() =>
//                   setItems((prevItems) => [
//                     ...prevItems,
//                     { id: prevItems.length + 1, name: "New Item", duration: 1 },
//                   ])
//                 }
//               >
//                 + Add Item
//               </button>
//             </div>
//           </>
//         )}
//         {selectedOptions[1] && selectedOptions[2] && selectedOptions[3] && (
//           <>
//             <div className="selected-text">
//               <p>{displayText2}</p>
//             </div>
//             <ScheduleTable
//               schedule={schedule}
//               addToSchedule={handleItemDrop}
//               removeFromSchedule={handleRemoveItem}
//               onItemClick={handleItemClick}
//               moveItem={moveItem}
//             />
//             {showPopup && (
//               <div className="popup">
//                 <h2>Edit Scheduled Item</h2>
//                 <input
//                   type="text"
//                   value={currentItem.name}
//                   onChange={(e) =>
//                     setCurrentItem({ ...currentItem, name: e.target.value })
//                   }
//                 />
//                 <label>
//                   Duration:
//                   <input
//                     type="number"
//                     value={currentItem.duration}
//                     onChange={(e) =>
//                       setCurrentItem({
//                         ...currentItem,
//                         duration: parseFloat(e.target.value),
//                       })
//                     }
//                     min="0.5"
//                     max="4"
//                     step="0.5"
//                   />
//                 </label>
//                 <button onClick={handleSaveEdit}>Save</button>
//               </div>
//             )}
//           </>
//         )}
//         {showCSVPopup && (
//           <CSVImportPopup onClose={handleCloseCSVPopup} />
//         )}
//       </div>
//       <footer></footer>
//     </DndProvider>
//   );
// };

// export default App;


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

const App = () => {
  const [items, setItems] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(["", "", "", ""]);
  const [showCSVPopup, setShowCSVPopup] = useState(false); // เพิ่มสถานะสำหรับ CSV popup

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
            <li><img src={noti} alt="Bell" className="Bell" /></li>
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
            <ScheduleTable
              schedule={schedule}
              addToSchedule={handleItemDrop}
              removeFromSchedule={handleRemoveItem}
              onItemClick={handleItemClick}
              moveItem={moveItem}
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
          </>
        )}
        {showCSVPopup && (
          <CSVImportPopup onClose={handleCloseCSVPopup} />
        )}
      </div>
      <footer></footer>
    </DndProvider>
  );
};

export default App;
