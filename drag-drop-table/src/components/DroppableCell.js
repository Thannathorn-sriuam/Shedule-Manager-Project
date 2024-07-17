import React from "react";
import { useDrop } from "react-dnd";
import ItemTypes from "./ItemTypes";

const DroppableCell = ({ row, col, addToSchedule, moveItem, cellContent }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.ITEM,
    drop: (item) => {
      if (cellContent) {
        moveItem(item, row, col);
      } else {
        addToSchedule(item, row, col);
      }
    },
    canDrop: () => !cellContent || cellContent.scheduleId !== undefined,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  return (
    <td
      ref={drop}
      key={`${row}-${col}`}
      style={{
        backgroundColor: isOver && canDrop ? 'green' : 'white',
        padding: '10px',
      }}
    >
      {cellContent}
    </td>
  );
};

export default DroppableCell;


