
import { useState } from "react";
import { useCrudActions } from "../../hooks/useCrudActions";
import axios from "axios";

export default function ProductoCrear({ onCreated } = {}) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [precio, setPrecio] = useState("");
  const [reservable, setReservable] = useState(true);
  const [cantidadTotal, setCantidadTotal] = useState("");
  const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { data: caracteristicas = [], loading: loadingCarac, error: errorCarac } = useCrudActions("/api/caracteristicas");

  const resetForm = () => {
    setNombre("");
    setDescripcion("");
    setCategoriaId("");
    setPrecio("");
    setReservable(true);
    setCantidadTotal("");
    setCaracteristicasSeleccionadas([]);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!nombre.trim() || !categoriaId.trim() || !precio.trim() || !cantidadTotal) {
      setError("Nombre, Categoría, Precio y Cantidad Total son obligatorios.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || null,
        precio: parseFloat(precio),
        reservable: Boolean(reservable),
        cantidadTotal: parseInt(cantidadTotal, 10),
        categoriaId: parseInt(categoriaId, 10),
        caracteristicas: caracteristicasSeleccionadas.map((id) => ({ id: parseInt(id, 10) })),
      };
      const resp = await axios.post(
        "http://localhost:8080/api/productos",
        payload,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Producto creado con éxito.");
      if (onCreated && typeof onCreated === "function") {
        try {
          onCreated(resp.data);
        } catch (err) {
          console.warn("onCreated callback falló:", err);
        }
      }
      resetForm();
    } catch (err) {
      console.error(err);
      if (err.response) {
        const data = err.response.data;
        const msg =
          data?.message ||
          data?.error ||
          `Error ${err.response.status}: ${err.response.statusText}`;
        setError(msg);
      } else {
        setError("Error de conexión. Revisá el backend.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        maxWidth: 640,
        margin: "1.5rem auto",
        padding: "1.25rem",
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
      }}
    >
      <h2 style={{ marginTop: 0 }}>Crear Producto</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
        <label>
          ID Categoría
          <input
            type="number"
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            required
            placeholder="ID de la categoría"
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>

        <label>
          Nombre
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Nombre del producto"
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>

        <label>
          Descripción
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción (opcional)"
            rows={3}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>

        <label>
          Características
          {loadingCarac ? (
            <span>Cargando características...</span>
          ) : errorCarac ? (
            <span style={{ color: "crimson" }}>{errorCarac}</span>
          ) : (
            <select
              multiple
              value={caracteristicasSeleccionadas}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions, (opt) => opt.value);
                setCaracteristicasSeleccionadas(options);
              }}
              style={{ width: "100%", minHeight: 80, padding: "0.5rem", marginTop: "0.25rem" }}
            >
              {caracteristicas.map((carac) => (
                <option key={carac.id} value={carac.id}>
                  {carac.nombre}
                </option>
              ))}
            </select>
          )}
        </label>

        <label>
          Cantidad Total
          <input
            type="number"
            value={cantidadTotal}
            onChange={(e) => setCantidadTotal(e.target.value)}
            required
            min={1}
            placeholder="Cantidad total disponible"
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>

        <label>
          Precio
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
            min={0}
            step={0.01}
            placeholder="Precio"
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
          />
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            checked={reservable}
            onChange={(e) => setReservable(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Reservable
        </label>

        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: 6,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              background: "#2563eb",
              color: "white",
            }}
          >
            {loading ? "Creando..." : "Crear producto"}
          </button>

          <button
            type="button"
            onClick={resetForm}
            disabled={loading}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              background: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            Limpiar
          </button>
        </div>

        {error && <p style={{ color: "crimson", margin: 0 }}>{error}</p>}
        {success && <p style={{ color: "green", margin: 0 }}>{success}</p>}
      </form>
    </div>
  );
}
