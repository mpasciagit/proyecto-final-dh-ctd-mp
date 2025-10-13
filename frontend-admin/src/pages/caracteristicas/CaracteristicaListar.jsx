import { useState } from "react";
import "../../styles/tabla-admin.css";
import { useCrudActions } from "../../hooks/useCrudActions";
import ModalConfirmacion from "../../components/ModalConfirmacion";

export default function CaracteristicaListar({ modoEdicion = false }) {
  const { data: caracteristicas, loading, error, saveItem, deleteItem } = useCrudActions("/api/caracteristicas");
  const [editandoId, setEditandoId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [caracteristicaAEliminar, setCaracteristicaAEliminar] = useState(null);

  const handleEditClick = (carac) => {
    setEditandoId(carac.id);
    setEditData({ ...carac });
  };

  const handleCancel = () => {
    setEditandoId(null);
    setEditData({});
  };

  const handleSave = async (id) => {
    const ok = await saveItem(id, editData);
    if (ok) setEditandoId(null);
  };

  const handleDeleteClick = (carac) => {
    setCaracteristicaAEliminar(carac);
    setShowModal(true);
  };

  const confirmarEliminar = async () => {
    if (!caracteristicaAEliminar) return;
    await deleteItem(caracteristicaAEliminar.id);
    setShowModal(false);
    setCaracteristicaAEliminar(null);
  };

  if (loading) return <p>Cargando características...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Listado de Características</h2>
      {caracteristicas.length === 0 ? (
        <p>No hay características cargadas.</p>
      ) : (
        <table className="tabla-categorias">
          <thead>
            <tr>
              {modoEdicion && <th>Action</th>}
              <th>ID</th>
              <th>Nombre</th>
              <th>Ícono</th>
            </tr>
          </thead>
          <tbody>
            {caracteristicas.map((carac) => (
              <tr key={carac.id}>
                {modoEdicion && (
                  <td className="action-cell">
                    {editandoId === carac.id ? (
                      <>
                        <button onClick={() => handleSave(carac.id)}>✔</button>
                        <button onClick={handleCancel}>✖</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditClick(carac)}>✏</button>
                        <button onClick={() => handleDeleteClick(carac)}>❌</button>
                      </>
                    )}
                  </td>
                )}

                <td>{carac.id}</td>

                <td>
                  {editandoId === carac.id ? (
                    <input
                      type="text"
                      value={editData.nombre}
                      onChange={(e) =>
                        setEditData({ ...editData, nombre: e.target.value })
                      }
                    />
                  ) : (
                    carac.nombre
                  )}
                </td>

                <td>
                  {editandoId === carac.id ? (
                    <input
                      type="text"
                      value={editData.icono}
                      onChange={(e) =>
                        setEditData({ ...editData, icono: e.target.value })
                      }
                    />
                  ) : (
                    carac.icono
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
          mensaje={`¿Seguro que deseas eliminar la característica "${caracteristicaAEliminar?.nombre}"?`}
          onConfirm={confirmarEliminar}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
