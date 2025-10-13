
import { useState } from "react";
import { useCrudActions } from "../../hooks/useCrudActions";
import ModalConfirmacion from "../../components/ModalConfirmacion";
import "../../styles/tabla-admin.css";


export default function UsuarioListar({ modoEdicion = false }) {
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
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usr) => (
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
                    <input
                      type="text"
                      value={editData.rol?.nombre || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          rol: { ...editData.rol, nombre: e.target.value },
                        })
                      }
                    />
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
