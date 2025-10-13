// src/pages/imagenes/ImagenListar.jsx
import { useState } from "react";
import "../../styles/tabla-admin.css";
import { useCrudActions } from "../../hooks/useCrudActions";
import ModalConfirmacion from "../../components/ModalConfirmacion";

export default function ImagenListar({ modoEdicion = false }) {
  const { data: imagenes, loading, error, saveItem, deleteItem } = useCrudActions("/api/imagenes");
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [imagenAEliminar, setImagenAEliminar] = useState(null);

  const handleEditClick = (img) => {
    setEditandoId(img.id);
    setEditData({ ...img });
  };

  const handleCancel = () => {
    setEditandoId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    const ok = await saveItem(id, editData);
    if (ok) setEditandoId(null);
  };

  const handleDeleteClick = (img) => {
    setImagenAEliminar(img);
    setShowModal(true);
  };

  const confirmarEliminar = async () => {
    if (!imagenAEliminar) return;
    await deleteItem(imagenAEliminar.id);
    setShowModal(false);
    setImagenAEliminar(null);
  };

  if (loading) return <p>Cargando imágenes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Listado de Imágenes</h2>
      {imagenes.length === 0 ? (
        <p>No hay imágenes cargadas.</p>
      ) : (
        <table className="tabla-categorias">
          <thead>
            <tr>
              {modoEdicion && <th>Action</th>}
              <th>ID</th>
              <th>Nombre</th>
              <th>URL</th>
              <th>Producto ID</th>
            </tr>
          </thead>
          <tbody>
            {imagenes.map((img) => (
              <tr key={img.id}>
                {modoEdicion && (
                  <td className="action-cell">
                    {editandoId === img.id ? (
                      <>
                        <button onClick={() => handleSave(img.id)}>✔</button>
                        <button onClick={handleCancel}>✖</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(img)}>✏</button>
                        <button onClick={() => handleDeleteClick(img)}>❌</button>
                      </>
                    )}
                  </td>
                )}

                <td>{img.id}</td>

                <td>
                  {editandoId === img.id ? (
                    <input
                      type="text"
                      value={editData.nombre}
                      onChange={(e) =>
                        setEditData({ ...editData, nombre: e.target.value })
                      }
                    />
                  ) : (
                    img.nombre
                  )}
                </td>

                <td>
                  {editandoId === img.id ? (
                    <input
                      type="text"
                      value={editData.url}
                      onChange={(e) =>
                        setEditData({ ...editData, url: e.target.value })
                      }
                    />
                  ) : (
                    img.url
                  )}
                </td>

                <td>
                  {editandoId === img.id ? (
                    <input
                      type="number"
                      value={editData.productoId}
                      onChange={(e) =>
                        setEditData({ ...editData, productoId: e.target.value })
                      }
                    />
                  ) : (
                    img.productoId
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
          mensaje={`¿Seguro que deseas eliminar la imagen "${imagenAEliminar?.nombre}"?`}
          onConfirm={confirmarEliminar}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
