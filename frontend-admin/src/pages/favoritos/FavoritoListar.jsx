// src/pages/favoritos/FavoritoListar.jsx
import { useState } from "react";
import "../../styles/tabla-admin.css";
import { useCrudActions } from "../../hooks/useCrudActions";
import ModalConfirmacion from "../../components/ModalConfirmacion";

export default function FavoritoListar({ modoEdicion = false }) {
  const { data: favoritos, loading, error, saveItem, deleteItem } = useCrudActions("/api/favoritos");
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [favoritoAEliminar, setFavoritoAEliminar] = useState(null);

  const handleEditClick = (fav) => {
    setEditandoId(fav.id);
    setEditData({ ...fav });
  };

  const handleCancel = () => {
    setEditandoId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    const ok = await saveItem(id, editData);
    if (ok) setEditandoId(null);
  };

  const handleDeleteClick = (fav) => {
    setFavoritoAEliminar(fav);
    setShowModal(true);
  };

  const confirmarEliminar = async () => {
    if (!favoritoAEliminar) return;
    await deleteItem(favoritoAEliminar.id);
    setShowModal(false);
    setFavoritoAEliminar(null);
  };

  if (loading) return <p>Cargando favoritos...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Listado de Favoritos</h2>
      {favoritos.length === 0 ? (
        <p>No hay favoritos cargados.</p>
      ) : (
        <table className="tabla-categorias">
          <thead>
            <tr>
              {modoEdicion && <th>Action</th>}
              <th>ID</th>
              <th>Usuario ID</th>
              <th>Producto ID</th>
            </tr>
          </thead>
          <tbody>
            {favoritos.map((fav) => (
              <tr key={fav.id}>
                {modoEdicion && (
                  <td className="action-cell">
                    {editandoId === fav.id ? (
                      <>
                        <button onClick={() => handleSave(fav.id)}>✔</button>
                        <button onClick={handleCancel}>✖</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(fav)}>✏</button>
                        <button onClick={() => handleDeleteClick(fav)}>❌</button>
                      </>
                    )}
                  </td>
                )}

                <td>{fav.id}</td>

                <td>
                  {editandoId === fav.id ? (
                    <input
                      type="number"
                      value={editData.usuarioId}
                      onChange={(e) =>
                        setEditData({ ...editData, usuarioId: e.target.value })
                      }
                    />
                  ) : (
                    fav.usuarioId
                  )}
                </td>

                <td>
                  {editandoId === fav.id ? (
                    <input
                      type="number"
                      value={editData.productoId}
                      onChange={(e) =>
                        setEditData({ ...editData, productoId: e.target.value })
                      }
                    />
                  ) : (
                    fav.productoId
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
          mensaje={`¿Seguro que deseas eliminar el favorito con ID ${favoritoAEliminar?.id}?`}
          onConfirm={confirmarEliminar}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
