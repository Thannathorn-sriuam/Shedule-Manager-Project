import React from "react";
import DroppableCell from "./DroppableCell";

const ScheduleTable = ({ schedule, addToSchedule, removeFromSchedule, onItemClick, items, selectedYear }) => {
  const renderCells = () => {
    const cells = [];
    const timeSlots = Array.from({ length: 24 }, (_, i) => {
      const startHour = Math.floor(8 + i / 2);
      const startMinute = i % 2 === 0 ? "00" : "30";
      const endHour = Math.floor(8 + (i + 1) / 2);
      const endMinute = (i + 1) % 2 === 0 ? "00" : "30";
      return {
        start: `${startHour}:${startMinute}`,
        end: `${endHour}:${endMinute}`,
      };
    });

    for (let rowIndex = 0; rowIndex < timeSlots.length; rowIndex++) {
      const { start, end } = timeSlots[rowIndex];
      cells.push(
        <tr key={start}>
          <td className="time-column">
            {`${start} - ${end}`}
          </td>
          {Array.from({ length: 6 }, (_, col) => {
            const colIndex = col + 1;
            const scheduledItem = schedule.find(
              (item) =>
                item.row === rowIndex &&
                item.col === colIndex
            );

            let backgroundColor;
            switch (selectedYear) {
              case "ปี1":
                backgroundColor = '#FFFFCC'; // light yellow
                break;
              case "ปี2":
                backgroundColor = '#FFD1DC'; // light pink
                break;
              case "ปี3":
                backgroundColor = '#CCFFCC'; // light green
                break;
              case "ปี4":
                backgroundColor = '#CCFFFF'; // light blue
                break;
              default:
                backgroundColor = '#D8EADE'; // default color
            }

            if (scheduledItem) {
              const rowSpan = scheduledItem.duration * 2; // since each slot is 30 mins
              const itemStartTime = timeSlots[scheduledItem.row].start;
              const itemEndTime = timeSlots[scheduledItem.row + scheduledItem.duration * 2 - 1].end;
              return (
                <td className="slotname" key={`${start}-${colIndex}`} rowSpan={rowSpan}>
                  <div
                    className="scheduled-item"
                    onClick={() => onItemClick(scheduledItem)}
                    style={{ backgroundColor }}
                  >
                    {scheduledItem.name}
                    <br />
                    {itemStartTime} - {itemEndTime}
                    <button className="buttonx" onClick={(e) => { e.stopPropagation(); removeFromSchedule(scheduledItem.scheduleId); }}>
                      x
                    </button>
                  </div>
                </td>
              );
            } else {
              const isCellCovered = schedule.some(
                (item) =>
                  item.row < rowIndex &&
                  item.row + item.duration * 2 > rowIndex &&
                  item.col === colIndex
              );

              if (!isCellCovered) {
                return (
                  <DroppableCell
                    key={`${start}-${colIndex}`}
                    row={rowIndex}
                    col={colIndex}
                    addToSchedule={addToSchedule}
                    items={items}
                    cellContent={null}
                    backgroundColor={backgroundColor}
                  />
                );
              } else {
                return null;
              }
            }
          })}
        </tr>
      );
    }

    return cells;
  };

  return (
    <table>
      <thead>
        <tr>
          <th className="time-column">Time</th>
          <th>Monday</th>
          <th>Tuesday</th>
          <th>Wednesday</th>
          <th>Thursday</th>
          <th>Friday</th>
          <th>Saturday</th>
        </tr>
      </thead>
      <tbody>{renderCells()}</tbody>
    </table>
  );
};

export default ScheduleTable;
