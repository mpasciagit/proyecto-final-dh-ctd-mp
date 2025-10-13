
import { useState } from "react";
import axios from "axios";

export default function RolCrear({ onCreated } = {}) {
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setNombre("");
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = { nombre: nombre.trim() };
      const resp = await axios.post(
        "http://localhost:8080/api/roles",
        payload,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Rol creado con éxito.");
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
        maxWidth: 480,
        margin: "1.5rem auto",
        padding: "1.25rem",
        background: "white",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
      }}
    >
      <h2 style={{ marginTop: 0 }}>Crear Rol</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
        <label>
          Nombre del rol
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Ej: ADMIN, USER, etc."
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
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
            {loading ? "Creando..." : "Crear rol"}
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
