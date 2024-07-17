import React from "react";
import { useDrop } from "react-dnd";
import ItemTypes from "./ItemTypes";

const DroppableCell = ({ row, col, addToSchedule, moveItem, cellContent, schedule, currentDragItem }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.ITEM,
    drop: (item) => {
      if (cellContent) {
        moveItem(item, row, col);
      } else {
        addToSchedule(item, row, col);
      }
    },
    canDrop: (item) => {
      if (cellContent) return false;
      const endRow = row + item.duration * 2; // since each slot is 30 mins
      const hasConflict = schedule.some(
        (scheduledItem) =>
          scheduledItem.col === col &&
          (
            (scheduledItem.row < endRow && scheduledItem.row + scheduledItem.duration * 2 > row)
          )
      );
      return !hasConflict;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  let backgroundColor = 'white';
  if (isOver) {
    backgroundColor = canDrop ? 'green' : 'red';
  } else if (currentDragItem) {
    const endRow = row + currentDragItem.duration * 2;
    const hasConflict = schedule.some(
      (scheduledItem) =>
        scheduledItem.col === col &&
        (
          (scheduledItem.row < endRow && scheduledItem.row + scheduledItem.duration * 2 > row)
        )
    );
    backgroundColor = hasConflict ? 'red' : 'green';
  }

  return (
    <td
      ref={drop}
      key={`${row}-${col}`}
      style={{
        backgroundColor,
        padding: '10px',
      }}
    >
      {cellContent}
    </td>
  );
};

export default DroppableCell;


