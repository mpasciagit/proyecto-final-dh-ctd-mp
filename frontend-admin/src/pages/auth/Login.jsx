
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");


    try {
      const res = await fetch("http://localhost:8080/api/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Credenciales inválidas");

      const data = await res.json();

      // Guardar token y roles
      localStorage.setItem("token", data.token);
      localStorage.setItem("nombre", data.nombre);
      localStorage.setItem("roles", JSON.stringify(data.roles));

      // Nuevo control de acceso: consultar permiso ADMIN
      // data.rol_id o data.rol.id según cómo venga el backend
      const rolId = data.rol_id || (data.rol && data.rol.id) || (Array.isArray(data.roles) && data.roles[0]?.id);
      if (!rolId) {
        throw new Error("No se pudo determinar el rol del usuario.");
      }
      const token = data.token;
      const permiso = "admin";
      const permisoRes = await fetch(`http://localhost:8080/api/rol-permiso/rol/${rolId}/permiso/${permiso}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!permisoRes.ok) throw new Error("Error al verificar permisos de acceso");
      const tienePermiso = await permisoRes.json();
      if (!tienePermiso) {
        throw new Error("No tiene permiso para acceder al panel de administración.");
      }
      navigate("/panel");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error en el inicio de sesión");
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>

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
          <label
            htmlFor="show-password"
            style={{ userSelect: "none", cursor: "pointer" }}
          >
            Mostrar contraseña
          </label>
        </div>

        {error && <p className="login-error">{error}</p>}

        <button type="submit">
          Login
        </button>

        {/* <div className="login-links">
          <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
        </div> */}
      </form>
    </div>
  );
}
