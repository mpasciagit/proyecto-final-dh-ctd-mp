import React from "react";
import RangeCalendarModal from "./RangeCalendarModal";
import { useCalendarModal } from "../context/CalendarModalContext";

export default function CalendarModalGlobal() {
  const { open, initialRange, closeModal, confirmModal } = useCalendarModal();

  return (
    <RangeCalendarModal
      open={open}
      onClose={closeModal}
      onConfirm={confirmModal}
      initialRange={initialRange}
    />
  );
}
