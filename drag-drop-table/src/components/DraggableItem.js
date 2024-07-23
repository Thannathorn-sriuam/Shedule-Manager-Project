// // Draggableitem.js
// import React from "react";
// import { useDrag } from "react-dnd";
// import ItemTypes from "./ItemTypes";

// const DraggableItem = ({ item, isScheduled }) => {
//   const [{ isDragging }, drag] = useDrag({
//     type: ItemTypes.ITEM,
//     item: { ...item },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   });

//   return (
//     <div
//       ref={drag}
//       style={{
//         opacity: isDragging ? 0.5 : 1,
//         padding: '20px',
//         margin: '10px',
//         backgroundColor: isScheduled ? '#FFCDD2' : '#D8EADE',
//         cursor: 'move',
//       }}
//     >
//       {item.name}
//     </div>
//   );
// };

// export default DraggableItem;

// import React from "react";
// import { useDrag } from "react-dnd";
// import ItemTypes from "./ItemTypes";

// const DraggableItem = ({ item, isScheduled }) => {
//   const [{ isDragging }, drag] = useDrag({
//     type: ItemTypes.ITEM,
//     item: { ...item },
//     collect: (monitor) => ({
//       isDragging: !!monitor.isDragging(),
//     }),
//   });

//   return (
//     <div
//       ref={drag}
//       style={{
//         opacity: isDragging ? 0.5 : 1,
//         padding: '20px',
//         margin: '10px',
//         backgroundColor: isScheduled ? '#FFCDD2' : '#D8EADE',
//         cursor: 'move',
//       }}
//     >
//       {item.name}
//     </div>
//   );
// };

// export default DraggableItem;

import React from "react";
import { useDrag } from "react-dnd";
import ItemTypes from "./ItemTypes";

const DraggableItem = ({ item, isScheduled }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { ...item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '20px',
        margin: '10px',
        backgroundColor: isScheduled ? '#FFCDD2' : '#D8EADE',
        cursor: 'move',
      }}
    >
      {item.name}
    </div>
  );
};

export default DraggableItem;
