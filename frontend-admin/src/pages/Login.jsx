import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Credenciales inválidas");

      const data = await res.json();

      // Guardar token, nombre y roles en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("nombre", data.nombre);
      localStorage.setItem("roles", JSON.stringify(data.roles));

      navigate("/panel");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Contraseña:</label>
        <div className="login-password-wrapper">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="login-show-password-row">
          <input
            id="show-password"
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((v) => !v)}
            style={{ marginRight: "0.5em" }}
          />
          <label htmlFor="show-password" style={{ userSelect: "none", cursor: "pointer" }}>
            Mostrar contraseña
          </label>
        </div>
        {error && <p className="login-error">{error}</p>}
        <button type="submit">Login</button>
        <div className="login-links">
          <a href="/register">Registrarse</a>
          <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
        </div>
      </form>
    </div>
  );
}
