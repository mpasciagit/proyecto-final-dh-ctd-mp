import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./calendarCustom.css";
import esLocale from "../config/calendarLocaleES";

export default function RangeCalendarModal({
  open,
  onClose,
  onConfirm,
  initialRange
}) {

  const [range, setRange] = useState(
    initialRange || {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    }
  );

  // Sincronizar range con initialRange cada vez que el modal se abre o cambian las fechas
  useEffect(() => {
    if (open && initialRange) {
      setRange(initialRange);
    }
  }, [open, initialRange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[350px]">
        <DateRange
          editableDateInputs={true}
          onChange={item => setRange(item.selection)}
          moveRangeOnFirstSelection={false}
          ranges={[range]}
          months={2}
          direction="horizontal"
          rangeColors={["#2563eb"]}
          showMonthAndYearPickers={true}
          showDateDisplay={false}
          locale={esLocale}
          minDate={(() => {
            const today = new Date();
            today.setHours(0,0,0,0);
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            return tomorrow;
          })()}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            onClick={() => onConfirm(range)}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
