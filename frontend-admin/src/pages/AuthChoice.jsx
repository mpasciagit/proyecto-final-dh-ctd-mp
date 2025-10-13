import { useNavigate } from "react-router-dom";
import "../styles/AuthChoice.css";

export default function AuthChoice() {
  const navigate = useNavigate();

  return (
    <div className="auth-choice">
      <h2>Bienvenido al Panel de Administración</h2>
      <p>Selecciona una opción para continuar</p>

      <div className="auth-buttons">
        {/* Login */}
        <button onClick={() => navigate("/login")}>Iniciar sesión</button>

        {/* Recuperar contraseña */}
        <button onClick={() => navigate("/forgot-password")}>
          Olvidé mi contraseña
        </button>
      </div>
    </div>
  );
}
