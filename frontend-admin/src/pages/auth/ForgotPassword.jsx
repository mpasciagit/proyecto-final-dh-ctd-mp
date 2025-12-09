import "../../styles/ForgotPassword.css";
import { useState, useEffect } from "react";
import axios from "axios";


export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Por favor, ingresá tu correo electrónico.");
      return;
    }

    setLoading(true);

    try {
      // 🔹 Paso 1: verificar existencia y rol del usuario
      const checkRes = await axios.get(`http://localhost:8080/api/usuarios/email-rol/${email}`);
      const { exists, rol } = checkRes.data;

      if (!exists) {
        setError("No se encontró un usuario registrado con ese correo electrónico.");
        return;
      }

      // 🔹 Paso 2: verificar si el rol tiene permiso ADMIN (endpoint público)

      // Determinar rolId numérico

      // Nuevo formato: rol es un objeto con id y nombre
      const rolId = rol && typeof rol === "object" && rol.id ? rol.id : null;
      if (!rolId) {
        setError("No es posible recuperar la contraseña por este medio. Si tienes dudas, contacta al administrador.");
        return;
      }

      try {
        const permisoRes = await axios.get(`http://localhost:8080/api/rol-permiso/public/rol/${rolId}/permiso/admin`);
        const tienePermiso = permisoRes.data === true || permisoRes.data === "true";
        if (!tienePermiso) {
          setError("No es posible recuperar la contraseña por este medio. Si tienes dudas, contacta al administrador.");
          return;
        }
      } catch (e) {
        setError("No es posible recuperar la contraseña por este medio. Si tienes dudas, contacta al administrador.");
        return;
      }

      // 🔹 Paso 3: si pasa los checks, enviar el correo de recuperación
      const response = await axios.post(
        "http://localhost:8080/api/auth/forgot-password",
        { email, origin: "ADMIN" }
      );

      setMessage(response.data.message || "Revisá tu correo para continuar con la recuperación.");
      setEmail("");
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

  return (
    <div className="forgot-container">
      <h2>Recuperar contraseña</h2>
      <p>
        Ingresá el correo asociado a tu cuenta y te enviaremos instrucciones para restablecer tu contraseña.
      </p>

      <form className="forgot-form" onSubmit={handleSubmit}>
        <label>
          Correo electrónico
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tuemail@ejemplo.com"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Verificando..." : "Enviar instrucciones"}
        </button>

        {error && <p className="forgot-error">{error}</p>}
        {message && <p className="forgot-success">{message}</p>}
      </form>
    </div>
  );
}
