
import { useState } from "react";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import "../styles/AuthChoice.css";

export default function AuthChoice() {
  const [showForgot, setShowForgot] = useState(false);

  return (
    <div className="auth-choice">
         <div className="auth-title">DriveNow</div>
         <h2 className="auth-subtitle">Panel de Administración</h2>
      {showForgot ? (
        <>
          <ForgotPassword />
          <div className="auth-toggle-link">
            <button type="button" onClick={() => setShowForgot(false)} className="auth-choice-btn">
              Volver al Login
            </button>
          </div>
        </>
      ) : (
        <>
          <Login />
          <div className="auth-toggle-link">
            <button type="button" onClick={() => setShowForgot(true)} className="auth-choice-btn">
              Olvidé mi contraseña
            </button>
          </div>
        </>
      )}
    </div>
  );
}
