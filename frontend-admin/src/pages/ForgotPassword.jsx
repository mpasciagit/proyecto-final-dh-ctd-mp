
import "../styles/ForgotPassword.css";
import { useState } from "react";
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
      // ✅ Llamada al endpoint del backend que envía un link o una contraseña temporal
      const response = await axios.post(
        "http://localhost:8080/api/auth/forgot-password",
        { email }
      );

      // El backend debería responder con un mensaje tipo "Correo enviado" o similar
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
        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar instrucciones"}
        </button>
        {error && <p className="forgot-error">{error}</p>}
        {message && <p className="forgot-success">{message}</p>}
      </form>
    </div>
  );
}
