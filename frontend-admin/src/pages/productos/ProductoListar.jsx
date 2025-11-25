
import { useState } from "react";
import "../../styles/tabla-admin.css";
import { useCrudActions } from "../../hooks/useCrudActions";
import ModalConfirmacion from "../../components/ModalConfirmacion";

export default function ProductoListar({ modoEdicion = false }) {
  const { data: productos, loading, error, saveItem, deleteItem } = useCrudActions("/api/productos");
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // Estado de ordenamiento
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Función para ordenar los datos
  const getSortedProducts = () => {
    if (!sortConfig.key) return productos;
    const sorted = [...productos].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (typeof aValue === "string") aValue = aValue.toLowerCase();
      if (typeof bValue === "string") bValue = bValue.toLowerCase();
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

  const handleEditClick = (p) => {
    setEditandoId(p.id);
    // Normalizamos nombres de campos esperados en el formulario
    setEditData({
      cantidadTotal: p.cantidadTotal ?? p.cantidad_total ?? 0,
      descripcion: p.descripcion ?? "",
      nombre: p.nombre ?? "",
      precio: p.precio ?? 0,
      reservable: typeof p.reservable === "boolean" ? p.reservable : !!p.reservable,
      categoriaId: p.categoriaId ?? p.categoria_id ?? p.categoria?.id ?? null,
    });
  };

  const handleCancel = () => {
    setEditandoId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    // Ajustar payload según lo que espera el backend
    const payload = {
      cantidadTotal: Number(editData.cantidadTotal),
      descripcion: editData.descripcion,
      nombre: editData.nombre,
      precio: Number(editData.precio),
      reservable: !!editData.reservable,
      categoriaId: editData.categoriaId === null ? null : Number(editData.categoriaId),
    };
    const ok = await saveItem(id, payload);
    if (ok) handleCancel();
  };

  const handleDeleteClick = (p) => {
    setProductoAEliminar(p);
    setShowModal(true);
  };

  const confirmarEliminar = async () => {
    if (!productoAEliminar) return;
    await deleteItem(productoAEliminar.id);
    setShowModal(false);
    setProductoAEliminar(null);
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Listar Productos</h2>

      {productos.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <table className="tabla-categorias">
          <thead>
            <tr>
              {modoEdicion && <th>Action</th>}
              <th>ID
                <button style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }} onClick={() => handleSort("id")} title="Ordenar por ID">▲▼</button>
              </th>
              <th>CATEGORÍA
                <button style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }} onClick={() => handleSort("categoriaId")} title="Ordenar por Categoría">▲▼</button>
              </th>
              <th>NOMBRE
                <button style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }} onClick={() => handleSort("nombre")} title="Ordenar por Nombre">▲▼</button>
              </th>
              <th>DESCRIPCIÓN
                <button style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }} onClick={() => handleSort("descripcion")} title="Ordenar por Descripción">▲▼</button>
              </th>
              <th>RESERVABLE
                <button style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }} onClick={() => handleSort("reservable")} title="Ordenar por Reservable">▲▼</button>
              </th>
              <th>CANTIDAD
                <button style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }} onClick={() => handleSort("cantidadTotal")} title="Ordenar por Cantidad">▲▼</button>
              </th>
              <th>PRECIO
                <button style={{ marginLeft: 4, background: "none", border: "none", cursor: "pointer", fontSize: "1em", color: "inherit" }} onClick={() => handleSort("precio")} title="Ordenar por Precio">▲▼</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {getSortedProducts().map((p) => (
              <tr key={p.id}>
                {modoEdicion && (
                  <td className="action-cell">
                    {editandoId === p.id ? (
                      <>
                        <button title="Guardar" onClick={() => handleSave(p.id)}>✔</button>
                        <button title="Cancelar" onClick={handleCancel}>✖</button>
                      </>
                    ) : (
                      <>
                        <button title="Editar" onClick={() => handleEditClick(p)}>✏</button>
                        <button title="Eliminar" onClick={() => handleDeleteClick(p)}>❌</button>
                      </>
                    )}
                  </td>
                )}

                <td>{p.id}</td>

                <td>
                  {editandoId === p.id ? (
                    <input
                      type="number"
                      value={editData.categoriaId ?? ""}
                      onChange={(e) => setEditData({ ...editData, categoriaId: Number(e.target.value) })}
                    />
                  ) : (
                    p.categoriaNombre ?? p.categoria?.nombre ?? ""
                  )}
                </td>

                <td>
                  {editandoId === p.id ? (
                    <input
                      type="text"
                      value={editData.nombre ?? ""}
                      onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                    />
                  ) : (
                    p.nombre ?? ""
                  )}
                </td>

                <td>
                  {editandoId === p.id ? (
                    <input
                      type="text"
                      value={editData.descripcion ?? ""}
                      onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })}
                    />
                  ) : (
                    p.descripcion ?? ""
                  )}
                </td>

                <td>
                  {editandoId === p.id ? (
                    <input
                      type="checkbox"
                      checked={!!editData.reservable}
                      onChange={(e) => setEditData({ ...editData, reservable: e.target.checked })}
                    />
                  ) : (
                    (p.reservable === true || p.reservable === "true") ? "Sí" : "No"
                  )}
                </td>

                <td>
                  {editandoId === p.id ? (
                    <input
                      type="number"
                      value={editData.cantidadTotal ?? ""}
                      onChange={(e) => setEditData({ ...editData, cantidadTotal: Number(e.target.value) })}
                    />
                  ) : (
                    p.cantidadTotal ?? p.cantidad_total ?? ""
                  )}
                </td>

                <td>
                  {editandoId === p.id ? (
                    <input
                      type="number"
                      step="0.01"
                      value={editData.precio ?? ""}
                      onChange={(e) => setEditData({ ...editData, precio: Number(e.target.value) })}
                    />
                  ) : (
                    p.precio ?? ""
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
          mensaje={`¿Seguro que deseas eliminar el producto "${productoAEliminar?.nombre}"?`}
          onConfirm={confirmarEliminar}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
