import React from "react";
import { useDrag } from "react-dnd";
import ItemTypes from "./ItemTypes";

const DraggableItem = ({ item, selectedYear }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ITEM,
    item: { ...item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  let backgroundColor;
  switch (selectedYear) {
    case "ปี1":
      backgroundColor = '#FFFFCC'; // light yellow
      break;
    case "ปี2":
      backgroundColor = '#FFD1DC'; // light pink
      break;
    case "ปี3":
      backgroundColor = '#D8EADE'; // light green
      break;
    case "ปี4":
      backgroundColor = '#CCFFFF'; // light blue
      break;
    default:
      backgroundColor = '#FFF'; // default color
  }

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '20px',
        margin: '10px',
        backgroundColor: backgroundColor,
        cursor: 'move',
      }}
    >
      {item.name}
    </div>
  );
};

export default DraggableItem;
