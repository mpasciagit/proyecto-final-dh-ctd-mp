import { useState } from "react";
import "../../styles/tabla-admin.css";
import { useCrudActions } from "../../hooks/useCrudActions";
import ModalConfirmacion from "../../components/ModalConfirmacion";


export default function PermisoListar({ modoEdicion = false }) {
  const { data: permisos, loading, error, saveItem, deleteItem } = useCrudActions("/api/permisos");
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [permisoAEliminar, setPermisoAEliminar] = useState(null);
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

  const handleEditClick = (permiso) => {
    setEditandoId(permiso.id);
    setEditData({ ...permiso });
  };

  const handleCancel = () => {
    setEditandoId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    const ok = await saveItem(id, editData);
    if (ok) setEditandoId(null);
  };

  const handleDeleteClick = (permiso) => {
    setPermisoAEliminar(permiso);
    setShowModal(true);
  };

  const confirmarEliminar = async () => {
    if (!permisoAEliminar) return;
    await deleteItem(permisoAEliminar.id);
    setShowModal(false);
    setPermisoAEliminar(null);
  };

  if (loading) return <p>Cargando permisos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Ordenar permisos según la columna seleccionada
  const permisosOrdenados = [...permisos];
  if (sortConfig.key) {
    permisosOrdenados.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === "id") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = (aValue || "").toString().toLowerCase();
        bValue = (bValue || "").toString().toLowerCase();
      }
      if (aValue < bValue) return sortConfig.asc ? -1 : 1;
      if (aValue > bValue) return sortConfig.asc ? 1 : -1;
      return 0;
    });
  }

  return (
    <div>
      <h2>Listar Permisos</h2>
      {permisos.length === 0 ? (
        <p>No hay permisos disponibles.</p>
      ) : (
        <table className="tabla-categorias">
          <thead>
            <tr>
              {modoEdicion && <th>Acción</th>}
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
                ID <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('nombre')}>
                Nombre <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {permisosOrdenados.map((permiso) => (
              <tr key={permiso.id}>
                {modoEdicion && (
                  <td className="action-cell">
                    {editandoId === permiso.id ? (
                      <>
                        <button title="Guardar" onClick={() => handleSave(permiso.id)}>✔</button>
                        <button title="Cancelar" onClick={handleCancel}>✖</button>
                      </>
                    ) : (
                      <>
                        <button title="Editar" onClick={() => handleEditClick(permiso)}>✏</button>
                        <button title="Eliminar" onClick={() => handleDeleteClick(permiso)}>❌</button>
                      </>
                    )}
                  </td>
                )}
                <td>{permiso.id}</td>
                <td>
                  {editandoId === permiso.id ? (
                    <input
                      type="text"
                      value={editData.nombre ?? ""}
                      onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                    />
                  ) : (
                    permiso.nombre
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
          mensaje={`¿Seguro que deseas eliminar el permiso "${permisoAEliminar?.nombre}"?`}
          onConfirm={confirmarEliminar}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
