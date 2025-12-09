import { useState, useEffect } from "react";
import axios from "axios";
import '../../styles/FavoritoCrear.css';

export default function FavoritoCrear({ onCreated } = {}) {
  const [usuarioId, setUsuarioId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Limpiar mensaje de éxito solo al desmontar el componente
  useEffect(() => {
    return () => {
      setSuccess("");
    };
  }, []);

  const resetForm = () => {
    setUsuarioId("");
    setProductoId("");
    setError("");
    // No limpiar success aquí
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!usuarioId.trim() || !productoId.trim()) {
      setError("Usuario y Producto son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        usuarioId: usuarioId.trim(),
        productoId: productoId.trim(),
      };

      const resp = await axios.post(
        "http://localhost:8080/api/favoritos",
        payload,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess("Favorito creado. Buscarlo en Favoritos > Listar.");
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
        setError("No se pudo crear el favorito.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="favorito-crear-container">
      <h2>Crear Favorito</h2>
      <form onSubmit={handleSubmit} className="favorito-crear-form">
        <label>
          ID Usuario
          <input
            type="text"
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
            required
            placeholder="ID del usuario"
          />
        </label>
        <label>
          ID Producto
          <input
            type="text"
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
            required
            placeholder="ID del producto"
          />
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
            {loading ? "Creando..." : "Crear favorito"}
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
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
    </div>
  );
}
