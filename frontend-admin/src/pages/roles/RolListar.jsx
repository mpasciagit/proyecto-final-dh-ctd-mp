
import { useState } from "react";
import { useCrudActions } from "../../hooks/useCrudActions";
import ModalConfirmacion from "../../components/ModalConfirmacion";
import "../../styles/tabla-admin.css";


export default function RolListar({ modoEdicion = false }) {
  const {
    data: roles,
    loading,
    error,
    saveItem,
    deleteItem,
  } = useCrudActions("/api/roles");
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [rolAEliminar, setRolAEliminar] = useState(null);


  const handleEditClick = (rol) => {
    setEditandoId(rol.id);
    setEditData({ ...rol });
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

  const handleDeleteClick = (rol) => {
    setRolAEliminar(rol);
    setShowModal(true);
  };


  const confirmarEliminar = async () => {
    if (rolAEliminar) {
      await deleteItem(rolAEliminar.id);
    }
    setShowModal(false);
    setRolAEliminar(null);
  };


  if (loading) return <p>Cargando roles...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Listado de Roles</h2>
      {roles.length === 0 ? (
        <p>No hay roles cargados.</p>
      ) : (
        <table className="tabla-categorias">
          <thead>
            <tr>
              {modoEdicion && <th>Action</th>}
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((rol) => (
              <tr key={rol.id}>
                {modoEdicion && (
                  <td className="action-cell">
                    {editandoId === rol.id ? (
                      <>
                        <button onClick={() => handleSave(rol.id)}>✔</button>
                        <button onClick={handleCancel}>✖</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(rol)}>✏</button>
                        <button onClick={() => handleDeleteClick(rol)}>❌</button>
                      </>
                    )}
                  </td>
                )}

                <td>{rol.id}</td>

                <td>
                  {editandoId === rol.id ? (
                    <input
                      type="text"
                      value={editData.nombre}
                      onChange={(e) =>
                        setEditData({ ...editData, nombre: e.target.value })
                      }
                    />
                  ) : (
                    rol.nombre
                  )}
                </td>

                <td>
                  {editandoId === rol.id ? (
                    <input
                      type="text"
                      value={editData.descripcion || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          descripcion: e.target.value,
                        })
                      }
                    />
                  ) : (
                    rol.descripcion || "-"
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
          mensaje={`¿Seguro que deseas eliminar el rol "${rolAEliminar?.nombre}"?`}
          onConfirm={confirmarEliminar}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
