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
    case "1":
      backgroundColor = '#FFFFCC'; // light yellow
      break;
    case "2":
      backgroundColor = '#FFD1DC'; // light pink
      break;
    case "3":
      backgroundColor = '#CCFFCC'; // light green
      break;
    case "4":
      backgroundColor = '#CCFFFF'; // light blue
      break;
    default:
      backgroundColor = '#D8EADE'; // default color
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
