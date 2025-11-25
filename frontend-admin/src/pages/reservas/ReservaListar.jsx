import React, { useState } from "react";
import "../../styles/tabla-admin.css";
import { useCrudActions } from "../../hooks/useCrudActions";
import ModalConfirmacion from "../../components/ModalConfirmacion";

export default function ReservaListar({ modoEdicion = false }) {
  const [sortConfig, setSortConfig] = useState({ key: null, asc: true });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, asc: !prev.asc };
      } else {
        return { key, asc: true };
      }
    });
  };
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
      usuarioId: r.usuarioId ?? "",
      productoId: r.productoId ?? "",
      estado: r.estado ?? "",
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
      usuarioId: editData.usuarioId,
      productoId: editData.productoId,
      estado: editData.estado,
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

  // Ordenar reservas según la columna seleccionada
  const reservasOrdenadas = [...reservas];
  if (sortConfig.key) {
    reservasOrdenadas.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      // Para fechas, comparar como string ISO
      if (sortConfig.key === 'fechaCreacion' || sortConfig.key === 'fechaInicio' || sortConfig.key === 'fechaFin') {
        aValue = aValue || '';
        bValue = bValue || '';
      }
      // Para estado, comparar como string
      if (sortConfig.key === 'estado') {
        aValue = (aValue || '').toString().toLowerCase();
        bValue = (bValue || '').toString().toLowerCase();
      }
      // Para id, usuarioId, productoId, comparar como número
      if (["id", "usuarioId", "productoId"].includes(sortConfig.key)) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      if (aValue < bValue) return sortConfig.asc ? -1 : 1;
      if (aValue > bValue) return sortConfig.asc ? 1 : -1;
      return 0;
    });
  }

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
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
                ID <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('fechaCreacion')}>
                Fecha Creación <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('fechaInicio')}>
                Fecha Inicio <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('fechaFin')}>
                Fecha Fin <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('productoId')}>
                Producto ID <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('usuarioId')}>
                Usuario ID <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('estado')}>
                Estado <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {reservasOrdenadas.map((r) => (
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
                <td>{r.fechaCreacion ? r.fechaCreacion.slice(0, 10) : ""}</td>
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
                      type="number"
                      value={editData.productoId || ""}
                      onChange={(e) => setEditData({ ...editData, productoId: e.target.value })}
                    />
                  ) : (
                    r.productoId
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
                    <select
                      value={editData.estado || ""}
                      onChange={(e) => setEditData({ ...editData, estado: e.target.value })}
                    >
                      <option value="">Seleccione...</option>
                      <option value="PENDIENTE">PENDIENTE</option>
                      <option value="CONFIRMADA">CONFIRMADA</option>
                      <option value="FINALIZADA">FINALIZADA</option>
                      <option value="CANCELADA">CANCELADA</option>
                    </select>
                  ) : (
                    r.estado
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
