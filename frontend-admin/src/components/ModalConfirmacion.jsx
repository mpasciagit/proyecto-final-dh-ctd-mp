// src/components/ModalConfirmacion.jsx
import React from "react";
import "../styles/tabla-admin.css";

export default function ModalConfirmacion({ mensaje, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{mensaje}</p>
        <div className="modal-buttons">
          <button className="btn-confirm" onClick={onConfirm}>
            Sí
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
