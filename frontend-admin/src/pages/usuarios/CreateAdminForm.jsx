import { useState } from "react";
import axios from "axios";

export default function CreateAdminForm() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("ADMIN"); // 👈 valor por defecto
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [userId, setUserId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!nombre || !apellido || !email) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/admin/create-admin",
        {
          nombre,
          apellido,
          email,
          rol, // 👈 ahora lo enviamos al backend
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = response.data;
      setUserId(data.userId);
      setTempPassword(data.tempPassword || "Contraseña temporal generada y enviada al usuario.");
      setMessage("Usuario creado con éxito");
    } catch (err) {
      console.error(err);
      if (err.response) {
        setError(
          `Error ${err.response.status}: ${
            err.response.data?.message || JSON.stringify(err.response.data)
          }`
        );
      } else {
        setError("Error de conexión o interno. Revisá la consola.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copiado al portapapeles");
  };

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "2rem auto",
        padding: "1.5rem",
        border: "1px solid #ddd",
        borderRadius: 8,
        background: "white",
      }}
    >
      <h2>Crear nuevo usuario</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}
      >
        <label>
          Nombre
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>

        <label>
          Apellido
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Rol
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creando..." : "Crear usuario"}
        </button>
      </form>

      {message && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3>{message}</h3>
          <p>
            <strong>userId:</strong> {userId}
          </p>
          <p>
            <strong>Contraseña temporal:</strong> {tempPassword}
          </p>
          <button onClick={() => handleCopy(tempPassword)}>Copiar contraseña</button>

          <div style={{ marginTop: "1rem" }}>
            <p><strong>Texto de invitación (para enviar por email):</strong></p>
            <pre
              style={{
                background: "#f9f9f9",
                padding: "1rem",
                borderRadius: 6,
                whiteSpace: "pre-wrap",
                fontSize: "0.9rem",
              }}
            >
              {`Usuario creado: ${email}
Rol asignado: ${rol}
Contraseña temporal: ${tempPassword}
URL para login: http://localhost:5173/login
Una vez ingresado, debe cambiar su contraseña con /api/auth/change-password.`}
            </pre>
            <button
              onClick={() =>
                handleCopy(
                  `Usuario creado: ${email}\nRol asignado: ${rol}\nContraseña temporal: ${tempPassword}\nURL para login: http://localhost:5173/login\nUna vez ingresado, debe cambiar su contraseña con /api/auth/change-password.`
                )
              }
            >
              Copiar invitación
            </button>
          </div>
        </div>
      )}

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}
