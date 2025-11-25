
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
  const [caracteristicasSeleccionadas, setCaracteristicasSeleccionadas] = useState(["", "", "", ""]);
  const [valoresCaracteristicas, setValoresCaracteristicas] = useState(["", "", "", ""]);
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
    setCaracteristicasSeleccionadas(["", "", "", ""]);
    setValoresCaracteristicas(["", "", "", ""]);
    setError("");
    // No borrar success aquí, para que el mensaje permanezca tras crear
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
        productoCaracteristica: caracteristicasSeleccionadas
          .map((id, idx) => {
            if (id && !isNaN(Number(id))) {
              return { caracteristicaId: parseInt(id, 10), valor: valoresCaracteristicas[idx] };
            }
            return null;
          })
          .filter(Boolean),
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
        margin: "calc(1.5rem - 19px) auto 1.5rem auto",
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
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", marginRight: '0.5rem', boxSizing: 'border-box' }}
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
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", marginRight: '0.5rem', boxSizing: 'border-box' }}
          />
        </label>

        <label>
          Descripción
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción (opcional)"
            rows={3}
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", marginRight: '0.5rem', boxSizing: 'border-box' }}
          />
        </label>

        <label>
          Características
          {loadingCarac ? (
            <span>Cargando características...</span>
          ) : errorCarac ? (
            <span style={{ color: "crimson" }}>{errorCarac}</span>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <select
                    value={caracteristicasSeleccionadas[idx]}
                    onChange={e => {
                      const value = e.target.value;
                      // Evitar repetidos
                      if (caracteristicasSeleccionadas.includes(value) && value !== "") return;
                      const nuevas = [...caracteristicasSeleccionadas];
                      nuevas[idx] = value;
                      setCaracteristicasSeleccionadas(nuevas);
                    }}
                    style={{ width: '60%', padding: '0.5rem' }}
                  >
                    <option value="">Seleccione característica</option>
                    {caracteristicas
                      .filter(carac =>
                        carac.id === Number(caracteristicasSeleccionadas[idx]) ||
                        !caracteristicasSeleccionadas.includes(String(carac.id))
                      )
                      .map(carac => (
                        <option key={carac.id} value={carac.id}>{carac.nombre}</option>
                      ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Valor"
                    value={valoresCaracteristicas[idx]}
                    onChange={e => {
                      const nuevosValores = [...valoresCaracteristicas];
                      nuevosValores[idx] = e.target.value;
                      setValoresCaracteristicas(nuevosValores);
                    }}
                    style={{ width: '38%', padding: '0.5rem', marginRight: '0.5rem', boxSizing: 'border-box' }}
                    disabled={!caracteristicasSeleccionadas[idx]}
                  />
                </div>
              ))}
            </div>
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
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", marginRight: '0.5rem', boxSizing: 'border-box' }}
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
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem", marginRight: '0.5rem', boxSizing: 'border-box' }}
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

        <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.5rem", alignItems: 'center' }}>
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
            onClick={() => { resetForm(); setSuccess(""); }}
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

          {success && (
            <span style={{ color: '#2563eb', fontWeight: 500, marginLeft: '1rem' }}>
              Producto creado con éxito. Verifique en el menú Producto &gt; Listar.
            </span>
          )}
        </div>

        {error && <p style={{ color: "crimson", margin: 0 }}>{error}</p>}
      </form>
    </div>
  );
}
