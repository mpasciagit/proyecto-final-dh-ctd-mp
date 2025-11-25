import { useNavigate } from "react-router-dom";

export default function UserInfo() {
  const navigate = useNavigate();

  const nombre = localStorage.getItem("nombre") || "Usuario";
  const roles = JSON.parse(localStorage.getItem("roles") || "[]");
  let rol = "";
  if (Array.isArray(roles)) {
    rol = roles.map(r => (typeof r === "object" && r !== null ? r.nombre : r)).join(", ");
  } else if (roles && typeof roles === "object") {
    rol = roles.nombre || "";
  } else {
    rol = roles;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    localStorage.removeItem("roles");
    navigate("/");
  };

  return (
    <>
      <span className="header-user">{nombre}</span>
      <span className="header-role">{rol}</span>
      <button className="header-logout" onClick={handleLogout}>
        Logout
      </button>
    </>
  );
}
