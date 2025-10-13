import React, { useState } from "react";
import "../../styles/tabla-admin.css";
import { useCrudActions } from "../../hooks/useCrudActions";
import ModalConfirmacion from "../../components/ModalConfirmacion";

export default function ReservaListar({ modoEdicion = false }) {
  const { data: reservas, loading, error, saveItem, deleteItem } = useCrudActions("/api/reservas");
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [reservaAEliminar, setReservaAEliminar] = useState(null);

  const handleEditClick = (r) => {
    setEditandoId(r.id);
    setEditData({
      fechaInicio: r.fechaInicio ?? "",
      fechaFin: r.fechaFin ?? "",
      horaInicio: r.horaInicio ?? "",
      usuarioId: r.usuarioId ?? "",
      productoId: r.productoId ?? "",
    });
  };

  const handleCancel = () => {
    setEditandoId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    const payload = {
      fechaInicio: editData.fechaInicio,
      fechaFin: editData.fechaFin,
      horaInicio: editData.horaInicio,
      usuarioId: editData.usuarioId,
      productoId: editData.productoId,
    };
    const ok = await saveItem(id, payload);
    if (ok) handleCancel();
  };

  const handleDeleteClick = (r) => {
    setReservaAEliminar(r);
    setShowModal(true);
  };

  const confirmarEliminar = async () => {
    if (!reservaAEliminar) return;
    await deleteItem(reservaAEliminar.id);
    setShowModal(false);
    setReservaAEliminar(null);
  };

  if (loading) return <p>Cargando reservas...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="tabla-container">
      <h2>Listado de Reservas</h2>

      {reservas.length === 0 ? (
        <p>No hay reservas registradas.</p>
      ) : (
        <table className="tabla-categorias">
          <thead>
            <tr>
              {modoEdicion && <th>Action</th>}
              <th>ID</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Hora Inicio</th>
              <th>Usuario ID</th>
              <th>Producto ID</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id}>
                {modoEdicion && (
                  <td className="action-cell">
                    {editandoId === r.id ? (
                      <>
                        <button title="Guardar" onClick={() => handleSave(r.id)}>
                          ✔
                        </button>
                        <button title="Cancelar" onClick={handleCancel}>
                          ✖
                        </button>
                      </>
                    ) : (
                      <>
                        <button title="Editar" onClick={() => handleEditClick(r)}>
                          ✏
                        </button>
                        <button title="Eliminar" onClick={() => handleDeleteClick(r)}>
                          ❌
                        </button>
                      </>
                    )}
                  </td>
                )}
                <td>{r.id}</td>
                <td>
                  {editandoId === r.id ? (
                    <input
                      type="date"
                      value={editData.fechaInicio || ""}
                      onChange={(e) => setEditData({ ...editData, fechaInicio: e.target.value })}
                    />
                  ) : (
                    r.fechaInicio
                  )}
                </td>
                <td>
                  {editandoId === r.id ? (
                    <input
                      type="date"
                      value={editData.fechaFin || ""}
                      onChange={(e) => setEditData({ ...editData, fechaFin: e.target.value })}
                    />
                  ) : (
                    r.fechaFin
                  )}
                </td>
                <td>
                  {editandoId === r.id ? (
                    <input
                      type="time"
                      value={editData.horaInicio || ""}
                      onChange={(e) => setEditData({ ...editData, horaInicio: e.target.value })}
                    />
                  ) : (
                    r.horaInicio
                  )}
                </td>
                <td>
                  {editandoId === r.id ? (
                    <input
                      type="number"
                      value={editData.usuarioId || ""}
                      onChange={(e) => setEditData({ ...editData, usuarioId: e.target.value })}
                    />
                  ) : (
                    r.usuarioId
                  )}
                </td>
                <td>
                  {editandoId === r.id ? (
                    <input
                      type="number"
                      value={editData.productoId || ""}
                      onChange={(e) => setEditData({ ...editData, productoId: e.target.value })}
                    />
                  ) : (
                    r.productoId
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de confirmación */}
      {showModal && (
        <ModalConfirmacion
          mensaje={`¿Seguro que deseas eliminar la reserva ${reservaAEliminar?.id}?`}
          onConfirm={confirmarEliminar}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
