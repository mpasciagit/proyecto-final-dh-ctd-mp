import { Outlet, NavLink } from "react-router-dom";
import { useState } from "react";
import UserInfo from "./UserInfo.jsx";
import CreateAdminForm from "../pages/usuarios/CreateAdminForm.jsx";
import ChangePassword from "../pages/usuarios/ChangePassword.jsx";
import CategoriaListar from "../pages/categorias/CategoriaListar.jsx";
import CategoriaCrear from "../pages/categorias/CategoriaCrear.jsx";
import ProductoListar from "../pages/productos/ProductoListar.jsx";
import ProductoCrear from "../pages/productos/ProductoCrear.jsx";
import CaracteristicaListar from "../pages/caracteristicas/CaracteristicaListar.jsx";
import CaracteristicaCrear from "../pages/caracteristicas/CaracteristicaCrear.jsx";
import ImagenListar from "../pages/imagenes/ImagenListar.jsx";
import ReservaListar from "../pages/reservas/ReservaListar.jsx";
import ReservaCrear from "../pages/reservas/ReservaCrear.jsx";
import FavoritoListar from "../pages/favoritos/FavoritoListar.jsx";
import FavoritoCrear from "../pages/favoritos/FavoritoCrear.jsx";
import ReviewListar from "../pages/reviews/ReviewListar.jsx";
import ReviewCrear from "../pages/reviews/ReviewCrear.jsx";
import UsuarioListar from "../pages/usuarios/UsuarioListar.jsx";
import UsuarioCrear from "../pages/usuarios/UsuarioCrear.jsx";
import RolListar from "../pages/roles/RolListar.jsx";
import RolCrear from "../pages/roles/RolCrear.jsx";
import "../styles/layout.css";

export default function Layout() {
  const [openEntity, setOpenEntity] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [panelContent, setPanelContent] = useState(null);

  const toggleEntity = (entity) => {
    setOpenEntity(prev => (prev === entity ? null : entity));
    setOpenSubMenu(null);
    setPanelContent(null);
  };

  const toggleSubMenu = (subMenu) => {
    setOpenSubMenu(prev => (prev === subMenu ? null : subMenu));
  };

  const subItemStyle = { marginLeft: "1.5rem", cursor: "pointer" };
  const soloDashboard = !panelContent;

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <ul>
          <li>
            <NavLink
              to="/panel"
              className={({ isActive }) => (isActive ? "active" : "")}
              onClick={() => { setPanelContent(null); setOpenEntity(null); setOpenSubMenu(null); }}
            >
              Dashboard
            </NavLink>
          </li>
          {/* Mostrar entidades siempre en el panel */}
          {/* Categorías */}
          <li>
            <div onClick={() => toggleEntity("categorias")} style={{ cursor: "pointer" }}>
              Categorías {openEntity === "categorias" ? "▼" : "▶"}
            </div>
            {openEntity === "categorias" && (
              <ul>
                <li style={subItemStyle} onClick={() => setPanelContent("categoriaListar")}>Listar</li>
                <li style={subItemStyle} onClick={() => setPanelContent("categoriaCrear")}>Crear</li>
                <li style={subItemStyle} onClick={() => setPanelContent("categoriaEditar")}>Editar Items</li>
              </ul>
            )}
          </li>
          {/* Productos */}
          <li>
            <div onClick={() => toggleEntity("productos")} style={{ cursor: "pointer" }}>
              Productos {openEntity === "productos" ? "▼" : "▶"}
            </div>
            {openEntity === "productos" && (
              <ul>
                <li style={subItemStyle} onClick={() => setPanelContent("productoListar")}>Listar</li>
                <li style={subItemStyle} onClick={() => setPanelContent("productoCrear")}>Crear</li>
                <li style={subItemStyle} onClick={() => setPanelContent("productoEditar")}>Editar Items</li>
                {/* Sub-entidad Características */}
                <li>
                  <div onClick={() => toggleSubMenu("caracteristicas")} style={{ ...subItemStyle, fontWeight: "bold" }}>
                    Características {openSubMenu === "caracteristicas" ? "▼" : "▶"}
                  </div>
                  {openSubMenu === "caracteristicas" && (
                    <ul>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("caracteristicaListar")}>Listar</li>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("caracteristicaCrear")}>Crear</li>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("caracteristicaEditar")}>Editar Items</li>
                    </ul>
                  )}
                </li>
                {/* Sub-entidad Imágenes */}
                <li>
                  <div onClick={() => toggleSubMenu("imagenes")} style={{ ...subItemStyle, fontWeight: "bold" }}>
                    Imágenes {openSubMenu === "imagenes" ? "▼" : "▶"}
                  </div>
                  {openSubMenu === "imagenes" && (
                    <ul>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("imagenListar")}>Listar</li>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("imagenCrear")}>Crear</li>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("imagenEditar")}>Editar Items</li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
          {/* Reservas */}
          <li>
            <div onClick={() => toggleEntity("reservas")} style={{ cursor: "pointer" }}>
              Reservas {openEntity === "reservas" ? "▼" : "▶"}
            </div>
            {openEntity === "reservas" && (
              <ul>
                <li style={subItemStyle} onClick={() => setPanelContent("reservaListar")}>Listar</li>
                <li style={subItemStyle} onClick={() => setPanelContent("reservaCrear")}>Crear</li>
                <li style={subItemStyle} onClick={() => setPanelContent("reservaEditar")}>Editar Items</li>
                {/* Sub-entidad Favoritos */}
                <li>
                  <div onClick={() => toggleSubMenu("favoritos")} style={{ ...subItemStyle, fontWeight: "bold" }}>
                    Favoritos {openSubMenu === "favoritos" ? "▼" : "▶"}
                  </div>
                  {openSubMenu === "favoritos" && (
                    <ul>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("favoritoListar")}>Listar</li>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("favoritoCrear")}>Crear</li>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("favoritoEditar")}>Editar Items</li>
                    </ul>
                  )}
                </li>
                {/* Sub-entidad Reviews */}
                <li>
                  <div onClick={() => toggleSubMenu("reviews")} style={{ ...subItemStyle, fontWeight: "bold" }}>
                    Reviews {openSubMenu === "reviews" ? "▼" : "▶"}
                  </div>
                  {openSubMenu === "reviews" && (
                    <ul>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("reviewListar")}>Listar</li>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("reviewCrear")}>Crear</li>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("reviewEditar")}>Editar Items</li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
          {/* Usuarios */}
          <li>
            <div onClick={() => toggleEntity("usuarios")} style={{ cursor: "pointer" }}>
              Usuarios {openEntity === "usuarios" ? "▼" : "▶"}
            </div>
            {openEntity === "usuarios" && (
              <ul>
                <li style={subItemStyle} onClick={() => setPanelContent("usuarioListar")}>Listar</li>
                <li style={subItemStyle} onClick={() => setPanelContent("usuarioCrear")}>Crear</li>
                <li style={subItemStyle} onClick={() => setPanelContent("usuarioEditar")}>Editar Items</li>
                {/* Sub-entidad Roles */}
                <li>
                  <div onClick={() => toggleSubMenu("roles")} style={{ ...subItemStyle, fontWeight: "bold" }}>
                    Roles {openSubMenu === "roles" ? "▼" : "▶"}
                  </div>
                  {openSubMenu === "roles" && (
                    <ul>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("rolListar")}>Listar</li>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("rolCrear")}>Crear</li>
                      <li style={{ marginLeft: "3rem", cursor: "pointer" }} onClick={() => setPanelContent("rolEditar")}>Editar Items</li>
                    </ul>
                  )}
                </li>
                {/* Botones especiales */}
                <li style={subItemStyle} onClick={() => setPanelContent("createAdmin")}>Crear nuevo ADMIN</li>
                <li style={subItemStyle} onClick={() => setPanelContent("changePassword")}>Cambiar contraseña</li>
              </ul>
            )}
          </li>
        </ul>
      </aside>
      {/* Contenido principal */}
      <div className="main-content">
        <div className="navbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Panel de Administración</h2>
          <UserInfo />
        </div>
        <div className="content">
          {/* Categorías */}
          {panelContent === "categoriaListar" && <CategoriaListar />}
          {panelContent === "categoriaCrear" && <CategoriaCrear />}
          {panelContent === "categoriaEditar" && <CategoriaListar modoEdicion={true} />}
          {/* Productos */}
          {panelContent === "productoListar" && <ProductoListar />}
          {panelContent === "productoCrear" && <ProductoCrear />}
          {panelContent === "productoEditar" && <ProductoListar modoEdicion={true} />}
          {/* Características */}
          {panelContent === "caracteristicaListar" && <CaracteristicaListar />}
          {panelContent === "caracteristicaCrear" && <CaracteristicaCrear />}
          {panelContent === "caracteristicaEditar" && <CaracteristicaListar modoEdicion={true} />}
          {/* Imágenes */}
          {panelContent === "imagenListar" && <ImagenListar />}
          {panelContent === "imagenCrear" && <ImagenCrear />}
          {panelContent === "imagenEditar" && <ImagenListar modoEdicion={true} />}
          {/* Reservas */}
          {panelContent === "reservaListar" && <ReservaListar />}
          {panelContent === "reservaCrear" && <ReservaCrear />}
          {panelContent === "reservaEditar" && <ReservaListar modoEdicion={true} />}
          {/* Favoritos */}
          {panelContent === "favoritoListar" && <FavoritoListar />}
          {panelContent === "favoritoCrear" && <FavoritoCrear />}
          {panelContent === "favoritoEditar" && <FavoritoListar modoEdicion={true} />}
          {/* Reviews */}
          {panelContent === "reviewListar" && <ReviewListar />}
          {panelContent === "reviewCrear" && <ReviewCrear />}
          {panelContent === "reviewEditar" && <ReviewListar modoEdicion={true} />}
          {/* Usuarios */}
          {panelContent === "usuarioListar" && <UsuarioListar />}
          {panelContent === "usuarioCrear" && <UsuarioCrear />}
          {panelContent === "usuarioEditar" && <UsuarioListar modoEdicion={true} />}
          {/* Roles */}
          {panelContent === "rolListar" && <RolListar />}
          {panelContent === "rolCrear" && <RolCrear />}
          {panelContent === "rolEditar" && <RolListar modoEdicion={true} />}
          {/* Botones especiales */}
          {panelContent === "createAdmin" && <CreateAdminForm />}
          {panelContent === "changePassword" && <ChangePassword />}
          {!panelContent && <Outlet />}
        </div>
      </div>
    </div>
  );
}