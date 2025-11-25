import { useState } from "react";
import "../../styles/tabla-admin.css";
import { useCrudActions } from "../../hooks/useCrudActions";

export default function RolPermisoListar() {
  const { data: rolPermisos, loading, error } = useCrudActions("/api/rol-permiso");
  const [sortConfig, setSortConfig] = useState({ key: null, asc: true });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, asc: !prev.asc };
      } else {
        return { key, asc: true };
      }
    });
  };

  if (loading) return <p>Cargando permisos por rol...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Ordenar datos según la columna seleccionada
  const datosOrdenados = [...rolPermisos];
  if (sortConfig.key) {
    datosOrdenados.sort((a, b) => {
      let aValue, bValue, aSec, bSec;
      if (sortConfig.key === "id") {
        aValue = Number(a.id);
        bValue = Number(b.id);
      } else if (sortConfig.key === "rol") {
        aValue = typeof a.rol === "object" ? (a.rol?.nombre || "") : (a.rol || "");
        bValue = typeof b.rol === "object" ? (b.rol?.nombre || "") : (b.rol || "");
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        // Secundario: permiso
        aSec = typeof a.permiso === "object" ? (a.permiso?.nombre || "") : (a.permiso || "");
        bSec = typeof b.permiso === "object" ? (b.permiso?.nombre || "") : (b.permiso || "");
        aSec = aSec.toLowerCase();
        bSec = bSec.toLowerCase();
      } else if (sortConfig.key === "permiso") {
        aValue = typeof a.permiso === "object" ? (a.permiso?.nombre || "") : (a.permiso || "");
        bValue = typeof b.permiso === "object" ? (b.permiso?.nombre || "") : (b.permiso || "");
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        // Secundario: rol
        aSec = typeof a.rol === "object" ? (a.rol?.nombre || "") : (a.rol || "");
        bSec = typeof b.rol === "object" ? (b.rol?.nombre || "") : (b.rol || "");
        aSec = aSec.toLowerCase();
        bSec = bSec.toLowerCase();
      }
      if (aValue < bValue) return sortConfig.asc ? -1 : 1;
      if (aValue > bValue) return sortConfig.asc ? 1 : -1;
      // Si son iguales, usar secundario
      if (aSec !== undefined && bSec !== undefined) {
        if (aSec < bSec) return sortConfig.asc ? -1 : 1;
        if (aSec > bSec) return sortConfig.asc ? 1 : -1;
      }
      return 0;
    });
  }

  return (
    <div className="tabla-admin-container">
      <h2>Listado de Permisos por Rol</h2>
      {rolPermisos.length === 0 ? (
        <p>No hay relaciones rol-permiso registradas.</p>
      ) : (
        <table className="tabla-categorias">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
                ID <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('rol')}>
                Rol <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('permiso')}>
                Permiso <span style={{fontSize:'0.95em'}}>▲▼</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {datosOrdenados.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{typeof item.rol === "object" ? item.rol?.nombre : item.rol}</td>
                <td>{typeof item.permiso === "object" ? item.permiso?.nombre : item.permiso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
