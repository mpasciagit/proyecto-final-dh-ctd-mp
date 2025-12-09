import '../../styles/CreateUserForm.css';
import { useState } from "react";
import axios from "axios";

export default function CreateUserForm() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [userId, setUserId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!nombre || !apellido || !email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          nombre,
          apellido,
          email,
          password,
          origin: "ADMIN",
        }
      );

      const data = response.data;
  setUserId(data.usuarioId || "-");
      setTempPassword(password);
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
    <div className="create-admin-container">
      <h2>Crear nuevo usuario</h2>

      <form
        onSubmit={handleSubmit}
  className="create-admin-form"
  style={{ marginTop: "1rem" }}
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
          Contraseña
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Rol
          <div className="input-fake" tabIndex={-1} aria-readonly="true">USER</div>
        </label>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="submit" disabled={loading} style={{ cursor: 'pointer', height: '2.2rem' }}>
            {loading ? "Creando..." : "Crear Usuario"}
          </button>
        </div>
      </form>

      {message && (
        <div className="create-admin-success">
          <h3>{message}</h3>
          <p>
            <strong>userId:</strong> {userId}
          </p>
          <p>
            <strong>Contraseña:</strong> {tempPassword}
          </p>
          <p style={{ marginTop: '0.7rem', color: '#2563eb', fontWeight: 500 }}>
            Para cambiar el ROL, edite el usuario desde el Listado de Usuarios.
          </p>
        </div>
      )}

  {error && <p className="create-admin-error">{error}</p>}
    </div>
  );
}
