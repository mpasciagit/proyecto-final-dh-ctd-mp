import Header from "./Header.jsx";
import { Outlet, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminHelp from "./AdminHelp.jsx";
import UserInfo from "./UserInfo.jsx";
import CreateUserForm from "../pages/usuarios/CreateUserForm.jsx";
import ChangePassword from "../pages/usuarios/ChangePassword.jsx";
import CategoriaListar from "../pages/categorias/CategoriaListar.jsx";
import CategoriaCrear from "../pages/categorias/CategoriaCrear.jsx";
import ProductoListar from "../pages/productos/ProductoListar.jsx";
import ProductoCrear from "../pages/productos/ProductoCrear.jsx";
import CaracteristicaListar from "../pages/caracteristicas/CaracteristicaListar.jsx";
import CaracteristicaCrear from "../pages/caracteristicas/CaracteristicaCrear.jsx";
import ImagenListar from "../pages/imagenes/ImagenListar.jsx";
import ImagenCrear from "../pages/imagenes/ImagenCrear.jsx";
import ReservaListar from "../pages/reservas/ReservaListar.jsx";
import ReservaCrear from "../pages/reservas/ReservaCrear.jsx";
import FavoritoListar from "../pages/favoritos/FavoritoListar.jsx";
import FavoritoCrear from "../pages/favoritos/FavoritoCrear.jsx";
import ReviewListar from "../pages/reviews/ReviewListar.jsx";
import ReviewCrear from "../pages/reviews/ReviewCrear.jsx";
import UsuarioListar from "../pages/usuarios/UsuarioListar.jsx";
import RolListar from "../pages/roles/RolListar.jsx";
import RolCrear from "../pages/roles/RolCrear.jsx";
import PermisoListar from "../pages/permisos/PermisoListar.jsx";
import RolPermisoListar from "../pages/rolpermiso/RolPermisoListar.jsx";
import RolPermisoCrear from "../pages/rolpermiso/RolPermisoCrear.jsx";
import "../styles/layout.css";

export default function Layout() {
  const [openEntity, setOpenEntity] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [panelContent, setPanelContent] = useState(null);
  // ...existing code...

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
    <>
      <Header />
      <div className="layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <ul>
          <li>
            <NavLink
              to="/panel"
              className={({ isActive }) => (isActive ? "active drivenow-link" : "drivenow-link")}
              onClick={() => { setPanelContent(null); setOpenEntity(null); setOpenSubMenu(null); }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
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
                <li style={subItemStyle} onClick={() => setPanelContent("usuarioEditar")}>Editar Items</li>
                {/* Botones especiales */}
                <li style={subItemStyle} onClick={() => setPanelContent("createUser")}>Crear nuevo USER</li>
                <li style={subItemStyle} onClick={() => setPanelContent("changePassword")}>Cambiar contraseña</li>
              </ul>
            )}
          </li>
            {/* Roles (top-level) */}
            <li>
              <div onClick={() => toggleEntity("roles")} style={{ cursor: "pointer" }}>
                Roles {openEntity === "roles" ? "▼" : "▶"}
              </div>
              {openEntity === "roles" && (
                <ul>
                  <li style={subItemStyle} onClick={() => setPanelContent("rolListar")}>Listar</li>
                  <li style={subItemStyle} onClick={() => setPanelContent("rolCrear")}>Crear</li>
                  <li style={subItemStyle} onClick={() => setPanelContent("rolEditar")}>Editar Items</li>
                </ul>
              )}
            </li>
            {/* Permisos (top-level) */}
            <li>
              <div onClick={() => toggleEntity("permisos")} style={{ cursor: "pointer" }}>
                Permisos {openEntity === "permisos" ? "▼" : "▶"}
              </div>
              {openEntity === "permisos" && (
                <ul>
                  <li style={subItemStyle} onClick={() => setPanelContent("permisoListar")}>Listar</li>
                  <li style={subItemStyle} onClick={() => setPanelContent("permisoEditar")}>Editar Items</li>
                </ul>
              )}
            </li>
            {/* RolPermiso (top-level) */}
            <li>
              <div onClick={() => toggleEntity("rolPermiso")} style={{ cursor: "pointer" }}>
                RolPermiso {openEntity === "rolPermiso" ? "▼" : "▶"}
              </div>
              {openEntity === "rolPermiso" && (
                <ul>
                  <li style={subItemStyle} onClick={() => setPanelContent("rolPermisoListar")}>Listar</li>
                  <li style={subItemStyle} onClick={() => setPanelContent("rolPermisoCrear")}>Crear</li>
                  <li style={subItemStyle} onClick={() => setPanelContent("rolPermisoEditar")}>Editar Items</li>
                </ul>
              )}
            </li>
          {/* Manual Panel-Admin */}
          <li>
            <div
              onClick={() => {
                setPanelContent("manualPanelAdmin");
                setOpenEntity(null);
                setOpenSubMenu(null);
              }}
              style={{ cursor: "pointer", fontWeight: "bold", color: panelContent === "manualPanelAdmin" ? '#1976d2' : undefined }}
            >
              Manual Panel-Admin
            </div>
          </li>
        </ul>
      </aside>
      {/* Contenido principal */}
      <div className="main-content">

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
          {panelContent === "usuarioEditar" && <UsuarioListar modoEdicion={true} />}
          {/* Roles */}
          {panelContent === "rolListar" && <RolListar />}
          {panelContent === "rolCrear" && <RolCrear />}
          {panelContent === "rolEditar" && <RolListar modoEdicion={true} />}
          {/* Permisos */}
          {panelContent === "permisoListar" && <PermisoListar />}
          {panelContent === "permisoEditar" && <PermisoListar modoEdicion={true} />}
          {panelContent === "rolPermisoListar" && <RolPermisoListar />}
          {panelContent === "rolPermisoEditar" && <RolPermisoListar modoEdicion={true} />}
          {panelContent === "rolPermisoCrear" && <RolPermisoCrear />}
          {/* Botones especiales */}
          {panelContent === "createUser" && <CreateUserForm />}
          {panelContent === "changePassword" && <ChangePassword />}
          {panelContent === "manualPanelAdmin" && <AdminHelp />}
          {!panelContent && <Outlet />}
        </div>
      </div>
      </div>
    </>
  );
}