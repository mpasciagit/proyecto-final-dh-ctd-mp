// src/pages/categorias/CategoriaListar.jsx
import { useState } from "react";
import "../../styles/tabla-admin.css";
import ModalConfirmacion from "../../components/ModalConfirmacion";
import { useCrudActions } from "../../hooks/useCrudActions";

export default function CategoriaListar({ modoEdicion = false }) {
  const { data: categorias, loading, error, saveItem, deleteItem } = useCrudActions("/api/categorias");
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  const handleEditClick = (cat) => {
    setEditandoId(cat.id);
    setEditData({ ...cat });
  };

  const handleCancel = () => {
    setEditandoId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    const ok = await saveItem(id, editData);
    if (ok) setEditandoId(null);
  };

  const handleDeleteClick = (cat) => {
    setCategoriaAEliminar(cat);
    setShowModal(true);
  };

  const confirmarEliminar = async () => {
    if (!categoriaAEliminar) return;
    await deleteItem(categoriaAEliminar.id);
    setShowModal(false);
    setCategoriaAEliminar(null);
  };

  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Listado de Categorías</h2>
      {categorias.length === 0 ? (
        <p>No hay categorías cargadas.</p>
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
            {categorias.map((cat) => (
              <tr key={cat.id}>
                {modoEdicion && (
                  <td className="action-cell">
                    {editandoId === cat.id ? (
                      <>
                        <button onClick={() => handleSave(cat.id)}>✔</button>
                        <button onClick={handleCancel}>✖</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(cat)}>✏</button>
                        <button onClick={() => handleDeleteClick(cat)}>❌</button>
                      </>
                    )}
                  </td>
                )}

                <td>{cat.id}</td>

                <td>
                  {editandoId === cat.id ? (
                    <input
                      type="text"
                      value={editData.nombre}
                      onChange={(e) =>
                        setEditData({ ...editData, nombre: e.target.value })
                      }
                    />
                  ) : (
                    cat.nombre
                  )}
                </td>

                <td>
                  {editandoId === cat.id ? (
                    <input
                      type="text"
                      value={editData.descripcion}
                      onChange={(e) =>
                        setEditData({ ...editData, descripcion: e.target.value })
                      }
                    />
                  ) : (
                    cat.descripcion
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
          mensaje={`¿Seguro que deseas eliminar la categoría "${categoriaAEliminar?.nombre}"?`}
          onConfirm={confirmarEliminar}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
