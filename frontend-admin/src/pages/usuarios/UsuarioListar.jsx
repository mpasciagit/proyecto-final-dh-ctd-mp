
import { useState } from "react";
import RolListar from "../roles/RolListar.jsx";
import { useCrudActions } from "../../hooks/useCrudActions";
import ModalConfirmacion from "../../components/ModalConfirmacion";
import "../../styles/tabla-admin.css";


export default function UsuarioListar({ modoEdicion = false }) {
  // Obtener roles disponibles para el select
  const { data: roles } = useCrudActions("/api/roles");
  const [sortConfig, setSortConfig] = useState({ key: 'rol', asc: true });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, asc: !prev.asc };
      } else {
        return { key, asc: true };
      }
    });
  };
  const {
    data: usuarios,
    loading,
    error,
    saveItem,
    deleteItem,
  } = useCrudActions("/api/usuarios");
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);


  const handleEditClick = (usr) => {
    setEditandoId(usr.id);
    setEditData({ ...usr });
  };

  const handleCancel = () => {
    setEditandoId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    const success = await saveItem(id, editData);
    if (success) {
      setEditandoId(null);
    }
  };

  const handleDeleteClick = (usr) => {
    setUsuarioAEliminar(usr);
    setShowModal(true);
  };


  const confirmarEliminar = async () => {
    if (usuarioAEliminar) {
      await deleteItem(usuarioAEliminar.id);
    }
    setShowModal(false);
    setUsuarioAEliminar(null);
  };


  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Ordenar usuarios por la columna seleccionada
  const usuariosOrdenados = [...usuarios];
  usuariosOrdenados.sort((a, b) => {
    let aValue, bValue;
    if (sortConfig.key === 'rol') {
      aValue = (a.rol?.nombre || '').toLowerCase();
      bValue = (b.rol?.nombre || '').toLowerCase();
    } else if (sortConfig.key === 'email') {
      aValue = (a.email || '').toLowerCase();
      bValue = (b.email || '').toLowerCase();
    } else if (sortConfig.key === 'id') {
      aValue = a.id;
      bValue = b.id;
    }
    if (aValue < bValue) return sortConfig.asc ? -1 : 1;
    if (aValue > bValue) return sortConfig.asc ? 1 : -1;
    return 0;
  });

  return (
    <div>
      <h2>Listado de Usuarios</h2>
      {usuarios.length === 0 ? (
        <p>No hay usuarios cargados.</p>
      ) : (
        <table className="tabla-categorias">
          <thead>
            <tr>
              {modoEdicion && <th>Action</th>}
              <th>
                ID
                <button
                  style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }}
                  onClick={() => handleSort('id')}
                  title="Ordenar por ID"
                >
                  ▲▼
                </button>
              </th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>
                Email
                <button
                  style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }}
                  onClick={() => handleSort('email')}
                  title="Ordenar por Email"
                >
                  ▲▼
                </button>
              </th>
              <th>
                Rol
                <button
                  style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }}
                  onClick={() => handleSort('rol')}
                  title="Ordenar por Rol"
                >
                  ▲▼
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {usuariosOrdenados.map((usr) => (
              <tr key={usr.id}>
                {modoEdicion && (
                  <td className="action-cell">
                    {editandoId === usr.id ? (
                      <>
                        <button onClick={() => handleSave(usr.id)}>✔</button>
                        <button onClick={handleCancel}>✖</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(usr)}>✏</button>
                        <button onClick={() => handleDeleteClick(usr)}>❌</button>
                      </>
                    )}
                  </td>
                )}

                <td>{usr.id}</td>

                <td>
                  {editandoId === usr.id ? (
                    <input
                      type="text"
                      value={editData.nombre}
                      onChange={(e) =>
                        setEditData({ ...editData, nombre: e.target.value })
                      }
                    />
                  ) : (
                    usr.nombre
                  )}
                </td>

                <td>
                  {editandoId === usr.id ? (
                    <input
                      type="text"
                      value={editData.apellido}
                      onChange={(e) =>
                        setEditData({ ...editData, apellido: e.target.value })
                      }
                    />
                  ) : (
                    usr.apellido
                  )}
                </td>

                <td>
                  {editandoId === usr.id ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                    />
                  ) : (
                    usr.email
                  )}
                </td>

                <td>
                  {editandoId === usr.id ? (
                    <select
                      value={editData.rol?.id || ""}
                      onChange={e => {
                        const selectedId = Number(e.target.value);
                        const selectedRol = roles.find(r => r.id === selectedId);
                        setEditData({
                          ...editData,
                          rol: selectedRol ? { id: selectedRol.id, nombre: selectedRol.nombre } : null,
                        });
                      }}
                    >
                      <option value="">Seleccione rol</option>
                      {roles && roles.map(r => (
                        <option key={r.id} value={r.id}>{r.nombre}</option>
                      ))}
                    </select>
                  ) : (
                    usr.rol?.nombre || "-"
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
          mensaje={`¿Seguro que deseas eliminar al usuario "${usuarioAEliminar?.nombre} ${usuarioAEliminar?.apellido}"?`}
          onConfirm={confirmarEliminar}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
