
import React, { useState, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./calendarCustom.css";
import esLocale from "../config/calendarLocaleES";

// Utilidad para convertir Date a string YYYY-MM-DD en local
function toLocalYYYYMMDD(date) {
  const pad = n => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Defensa: normaliza cualquier valor a Date válido
function normalizeToDate(val) {
  if (val instanceof Date) {
    return val;
  }
  if (typeof val === 'string' && val.length === 10) {
    // YYYY-MM-DD
    return new Date(val + 'T00:00:00');
  }
  return new Date(); // fallback seguro
}


export default function RangeCalendarModal({
  open,
  onClose,
  onConfirm,
  initialRange
}) {
  // Convertir initialRange (strings) a objeto DateRange para el calendario
  function getDateRangeFromAny(range) {
    if (!range || (!range.startDate && !range.endDate)) {
      return {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      };
    }
    return {
      startDate: normalizeToDate(range.startDate),
      endDate: normalizeToDate(range.endDate),
      key: 'selection'
    };
  }

  const [range, setRange] = useState(getDateRangeFromAny(initialRange));

  // Sincronizar range con initialRange cada vez que el modal se abre o cambian las fechas
  useEffect(() => {
    if (open) {
      setRange(getDateRangeFromAny(initialRange));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialRange?.startDate, initialRange?.endDate]);

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
            onClick={() => {
              // Al confirmar, devolver strings YYYY-MM-DD
              onConfirm({
                startDate: toLocalYYYYMMDD(range.startDate),
                endDate: toLocalYYYYMMDD(range.endDate),
                key: 'selection'
              });
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
