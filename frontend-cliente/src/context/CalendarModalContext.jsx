import React, { createContext, useContext, useState, useCallback } from "react";

const CalendarModalContext = createContext();

export function CalendarModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [initialRange, setInitialRange] = useState({ startDate: '', endDate: '', key: 'selection' });
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  // Función para abrir el modal desde cualquier parte
  const openModal = useCallback((range, confirmCallback) => {
    setInitialRange(range || { startDate: '', endDate: '', key: 'selection' });
    setOnConfirm(() => confirmCallback || (() => {}));
    setOpen(true);
  }, []);

  // Función para cerrar el modal
  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  // Función para confirmar selección
  const confirmModal = useCallback((range) => {
    setOpen(false);
    if (onConfirm) onConfirm(range);
  }, [onConfirm]);

  return (
    <CalendarModalContext.Provider value={{ open, initialRange, openModal, closeModal, confirmModal }}>
      {children}
    </CalendarModalContext.Provider>
  );
}

export function useCalendarModal() {
  return useContext(CalendarModalContext);
}
