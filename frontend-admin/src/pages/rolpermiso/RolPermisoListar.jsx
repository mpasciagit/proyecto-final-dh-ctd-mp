import { useState } from "react";
import "../../styles/tabla-admin.css";
import { useCrudActions } from "../../hooks/useCrudActions";

import ModalConfirmacion from "../../components/ModalConfirmacion";

export default function RolPermisoListar({ modoEdicion = true }) {
  const { data: rolPermisos, loading, error, saveItem, deleteItem } = useCrudActions("/api/rol-permiso");
  const [sortConfig, setSortConfig] = useState({ key: null, asc: true });
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [itemAEliminar, setItemAEliminar] = useState(null);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, asc: !prev.asc };
      } else {
        return { key, asc: true };
      }
    });
  };

  const handleEditClick = (item) => {
    setEditandoId(item.id);
    setEditData({
      rol: typeof item.rol === "object" ? item.rol.nombre : item.rol,
      permiso: typeof item.permiso === "object" ? item.permiso.nombre : item.permiso,
    });
  };

  const handleCancel = () => {
    setEditandoId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    // Solo permite editar el permiso, no el rol (por lógica de negocio usual)
    const updated = { ...editData };
    // Si el backend espera objetos, aquí habría que mapear a IDs
    const success = await saveItem(id, updated);
    if (success) {
      setEditandoId(null);
      setEditData({});
    }
  };

  const handleDeleteClick = (item) => {
    setItemAEliminar(item);
    setShowModal(true);
  };

  const confirmarEliminar = async () => {
    if (itemAEliminar) {
      await deleteItem(itemAEliminar); // Pasa el objeto completo para usar rol y permiso
      setShowModal(false);
      setItemAEliminar(null);
    }
  };

  if (loading) return <p>Cargando permisos por rol...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Ordenar datos según la columna seleccionada
  const datosOrdenados = [...rolPermisos];
  if (sortConfig.key) {
    datosOrdenados.sort((a, b) => {
      let aValue, bValue, aSec, bSec;
      if (sortConfig.key === "id") {
        aValue = Number(a.id);
        bValue = Number(b.id);
      } else if (sortConfig.key === "rol") {
        aValue = typeof a.rol === "object" ? (a.rol?.nombre || "") : (a.rol || "");
        bValue = typeof b.rol === "object" ? (b.rol?.nombre || "") : (b.rol || "");
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        // Secundario: permiso
        aSec = typeof a.permiso === "object" ? (a.permiso?.nombre || "") : (a.permiso || "");
        bSec = typeof b.permiso === "object" ? (b.permiso?.nombre || "") : (b.permiso || "");
        aSec = aSec.toLowerCase();
        bSec = bSec.toLowerCase();
      } else if (sortConfig.key === "permiso") {
        aValue = typeof a.permiso === "object" ? (a.permiso?.nombre || "") : (a.permiso || "");
        bValue = typeof b.permiso === "object" ? (b.permiso?.nombre || "") : (b.permiso || "");
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        // Secundario: rol
        aSec = typeof a.rol === "object" ? (a.rol?.nombre || "") : (a.rol || "");
        bSec = typeof b.rol === "object" ? (b.rol?.nombre || "") : (b.rol || "");
        aSec = aSec.toLowerCase();
        bSec = bSec.toLowerCase();
      }
      if (aValue < bValue) return sortConfig.asc ? -1 : 1;
      if (aValue > bValue) return sortConfig.asc ? 1 : -1;
      // Si son iguales, usar secundario
      if (aSec !== undefined && bSec !== undefined) {
        if (aSec < bSec) return sortConfig.asc ? -1 : 1;
        if (aSec > bSec) return sortConfig.asc ? 1 : -1;
      }
      return 0;
    });
  }

  return (
    <div className="tabla-admin-container">
      <h2>Listado de Permisos por Rol</h2>
      {rolPermisos.length === 0 ? (
        <p>No hay relaciones rol-permiso registradas.</p>
      ) : (
        <table className="tabla-categorias">
          <thead>
            <tr>
              {modoEdicion && <th>Acción</th>}
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
                ID <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('rol')}>
                Rol <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('permiso')}>
                Permiso <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {datosOrdenados.map((item) => (
              <tr key={item.id}>
                {modoEdicion && (
                  <td className="action-cell">
                    {editandoId === item.id ? (
                      <>
                        <button title="Guardar" onClick={() => handleSave(item.id)}>✔</button>
                        <button title="Cancelar" onClick={handleCancel}>✖</button>
                      </>
                    ) : (
                      <>
                        <button title="Editar" onClick={() => handleEditClick(item)}>✏</button>
                        <button title="Eliminar" onClick={() => handleDeleteClick(item)}>❌</button>
                      </>
                    )}
                  </td>
                )}
                <td>{item.id}</td>
                <td>
                  {editandoId === item.id ? (
                    <input
                      type="text"
                      value={editData.rol ?? ""}
                      onChange={(e) => setEditData({ ...editData, rol: e.target.value })}
                      disabled // Por lógica, no editable
                    />
                  ) : (
                    typeof item.rol === "object" ? item.rol?.nombre : item.rol
                  )}
                </td>
                <td>
                  {editandoId === item.id ? (
                    <input
                      type="text"
                      value={editData.permiso ?? ""}
                      onChange={(e) => setEditData({ ...editData, permiso: e.target.value })}
                    />
                  ) : (
                    typeof item.permiso === "object" ? item.permiso?.nombre : item.permiso
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
          mensaje={`¿Seguro que deseas eliminar la relación rol-permiso de "${itemAEliminar?.rol?.nombre || itemAEliminar?.rol}" y "${itemAEliminar?.permiso?.nombre || itemAEliminar?.permiso}"?`}
          onConfirm={confirmarEliminar}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
