import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const navigate = useNavigate();

  const nombre = localStorage.getItem("nombre") || "Usuario";
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  const rol = Array.isArray(roles) ? roles.join(", ") : roles;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    localStorage.removeItem("roles");
    navigate("/");
  };

  return (
    <div style={{ position: "absolute", top: 10, right: 10, textAlign: "right" }}>
      <span style={{ marginRight: "10px", fontWeight: "bold" }}>{nombre}</span>
      <span style={{ marginRight: "10px", fontStyle: "italic" }}>{rol}</span>
      <button onClick={handleLogout} style={{ padding: "4px 8px" }}>
        Logout
      </button>
    </div>
  );
}
