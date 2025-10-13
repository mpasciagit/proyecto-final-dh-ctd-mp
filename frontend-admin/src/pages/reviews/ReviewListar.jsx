
import React, { useState } from "react";
import "../../styles/tabla-admin.css";
import { useCrudActions } from "../../hooks/useCrudActions";
import ModalConfirmacion from "../../components/ModalConfirmacion";

export default function ReviewListar({ modoEdicion = false }) {
  const { data: reviews, loading, error, saveItem, deleteItem } = useCrudActions("/api/reviews");
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [reviewAEliminar, setReviewAEliminar] = useState(null);


  const handleEditClick = (r) => {
    setEditandoId(r.id);
    setEditData({
      comentario: r.comentario ?? "",
      puntaje: r.puntaje ?? 0,
      usuarioId: r.usuarioId ?? r.usuario_id ?? "",
      productoId: r.productoId ?? r.producto_id ?? "",
    });
  };

  const handleCancel = () => {
    setEditandoId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    const payload = {
      comentario: editData.comentario,
      puntaje: Number(editData.puntaje),
      usuarioId: editData.usuarioId,
      productoId: editData.productoId,
    };
    const ok = await saveItem(id, payload);
    if (ok) handleCancel();
  };

  const handleDeleteClick = (r) => {
    setReviewAEliminar(r);
    setShowModal(true);
  };

  const confirmarEliminar = async () => {
    if (!reviewAEliminar) return;
    await deleteItem(reviewAEliminar.id);
    setShowModal(false);
    setReviewAEliminar(null);
  };

  return (
    <div className="categorias-container">
      <h2>Listado de Reseñas</h2>

      {loading ? (
        <p>Cargando reseñas...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : reviews.length === 0 ? (
        <p>No hay reseñas registradas.</p>
      ) : (
        <>
        <table className="tabla-categorias">
          <thead>
            <tr>
              {modoEdicion && <th>Action</th>}
              <th>ID</th>
              <th>Comentario</th>
              <th>Puntaje</th>
              <th>Usuario ID</th>
              <th>Producto ID</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                {modoEdicion && (
                  <td className="action-cell">
                    {editandoId === review.id ? (
                      <>
                        <button title="Guardar" onClick={() => handleSave(review.id)}>✔</button>
                        <button title="Cancelar" onClick={handleCancel}>✖</button>
                      </>
                    ) : (
                      <>
                        <button title="Editar" onClick={() => handleEditClick(review)}>✏</button>
                        <button title="Eliminar" onClick={() => handleDeleteClick(review)}>❌</button>
                      </>
                    )}
                  </td>
                )}
                <td>{review.id}</td>
                <td>
                  {editandoId === review.id ? (
                    <input
                      type="text"
                      value={editData.comentario ?? ""}
                      onChange={(e) => setEditData({ ...editData, comentario: e.target.value })}
                    />
                  ) : (
                    review.comentario
                  )}
                </td>
                <td>
                  {editandoId === review.id ? (
                    <input
                      type="number"
                      value={editData.puntaje ?? 0}
                      onChange={(e) => setEditData({ ...editData, puntaje: Number(e.target.value) })}
                    />
                  ) : (
                    review.puntaje
                  )}
                </td>
                <td>
                  {editandoId === review.id ? (
                    <input
                      type="text"
                      value={editData.usuarioId ?? ""}
                      onChange={(e) => setEditData({ ...editData, usuarioId: e.target.value })}
                    />
                  ) : (
                    review.usuarioId
                  )}
                </td>
                <td>
                  {editandoId === review.id ? (
                    <input
                      type="text"
                      value={editData.productoId ?? ""}
                      onChange={(e) => setEditData({ ...editData, productoId: e.target.value })}
                    />
                  ) : (
                    review.productoId
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Modal de confirmación */}
        {showModal && (
          <ModalConfirmacion
            mensaje={`¿Seguro que deseas eliminar la reseña con ID ${reviewAEliminar?.id}?`}
            onConfirm={confirmarEliminar}
            onCancel={() => setShowModal(false)}
          />
        )}
        </>
      )}
    </div>
  );
}
