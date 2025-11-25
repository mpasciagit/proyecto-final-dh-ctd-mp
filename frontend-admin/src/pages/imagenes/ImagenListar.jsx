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
  // Estado de ordenamiento
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Función para ordenar los datos
  const getSortedImages = () => {
    if (!sortConfig.key) return imagenes;
    const sorted = [...imagenes].sort((a, b) => {
      let aValue, bValue;
      if (sortConfig.key === "nombre") {
        aValue = a.textoAlternativo ? a.textoAlternativo.toString().toLowerCase() : "";
        bValue = b.textoAlternativo ? b.textoAlternativo.toString().toLowerCase() : "";
      } else if (sortConfig.key === "url") {
        aValue = a.url ? a.url.toString().toLowerCase() : "";
        bValue = b.url ? b.url.toString().toLowerCase() : "";
      } else {
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  // Cambiar el orden al hacer clic
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

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
              <th className="sortable-col">ID
                <button
                  style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }}
                  onClick={() => handleSort("id")}
                  title="Ordenar por ID"
                >
                  ▲▼
                </button>
              </th>
              <th className="sortable-col">Producto ID
                <button
                  style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }}
                  onClick={() => handleSort("productoId")}
                  title="Ordenar por Producto ID"
                >
                  ▲▼
                </button>
              </th>
              <th className="sortable-col">Orden Visual
                <button
                  style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }}
                  onClick={() => handleSort("orden")}
                  title="Ordenar por Orden"
                >
                  ▲▼
                </button>
              </th>
              <th className="sortable-col">URL
                <button
                  style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }}
                  onClick={() => handleSort("url")}
                  title="Ordenar por URL"
                >
                  ▲▼
                </button>
              </th>
              <th className="sortable-col">Texto Alternativo
                <button
                  style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }}
                  onClick={() => handleSort("nombre")}
                  title="Ordenar por Texto Alternativo"
                >
                  ▲▼
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {getSortedImages().map((img) => (
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

                <td>
                  {editandoId === img.id ? (
                    <input
                      type="number"
                      value={editData.orden}
                      onChange={(e) =>
                        setEditData({ ...editData, orden: e.target.value })
                      }
                      style={{ width: "60px" }}
                    />
                  ) : (
                    img.orden
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
                      type="text"
                      value={editData.textoAlternativo}
                      onChange={(e) =>
                        setEditData({ ...editData, textoAlternativo: e.target.value })
                      }
                    />
                  ) : (
                    img.textoAlternativo
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
