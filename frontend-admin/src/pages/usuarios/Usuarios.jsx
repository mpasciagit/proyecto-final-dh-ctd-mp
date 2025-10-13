import { useState } from "react";
import CreateAdminForm from "./CreateAdminForm.jsx";
import ChangePassword from "./ChangePassword.jsx";

export default function Usuarios() {
  const [activeForm, setActiveForm] = useState(null); // "create" | "change" | null

  return (
    <div>
      <h2>Usuarios</h2>

      {/* Botones para desplegar formularios */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => setActiveForm(activeForm === "create" ? null : "create")}>
          Crear nuevo ADMIN
        </button>
        <button onClick={() => setActiveForm(activeForm === "change" ? null : "change")}>
          Cambiar contraseña
        </button>
      </div>

      {/* Despliegue condicional de formularios */}
      {activeForm === "create" && <CreateAdminForm />}
      {activeForm === "change" && <ChangePassword />}

      {/* Placeholder CRUD Usuarios */}
      <div style={{ marginTop: "2rem" }}>
        <h3>CRUD Usuarios (placeholders)</h3>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li><button>Listar usuarios</button></li>
          <li><button>Crear usuario</button></li>
          <li><button>Editar usuario</button></li>
          <li><button>Eliminar usuario</button></li>
        </ul>
      </div>
    </div>
  );
}
