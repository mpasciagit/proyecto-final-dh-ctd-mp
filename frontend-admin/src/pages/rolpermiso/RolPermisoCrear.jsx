import React, { useState } from "react";
import { useCrudActions } from "../../hooks/useCrudActions";


export default function RolPermisoCrear() {
  const { data: roles, loading: loadingRoles, error: errorRoles } = useCrudActions("/api/roles");
  const { data: permisos, loading: loadingPermisos, error: errorPermisos } = useCrudActions("/api/permisos");
  const [selectedRol, setSelectedRol] = useState("");
  const [selectedPermisos, setSelectedPermisos] = useState(["", "", "", "", ""]);
  const [status, setStatus] = useState([null, null, null, null, null]);
  const [loading, setLoading] = useState(false);

  const handlePermisoChange = (idx, value) => {
    const updated = [...selectedPermisos];
    updated[idx] = value;
    setSelectedPermisos(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRol) return;
    setLoading(true);
    const newStatus = [...status];
    await Promise.all(selectedPermisos.map(async (permisoId, idx) => {
      if (!permisoId) {
        newStatus[idx] = null;
        return;
      }
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/rol-permiso", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ rolId: selectedRol, permisoId })
        });
        if (res.ok) {
          newStatus[idx] = "ok";
        } else {
          const data = await res.json();
          newStatus[idx] = data?.error || "error";
        }
      } catch {
        newStatus[idx] = "error";
      }
    }));
    setStatus(newStatus);
    setLoading(false);
  };

  if (loadingRoles || loadingPermisos) return <p>Cargando datos...</p>;
  if (errorRoles) return <p style={{ color: 'red' }}>Error cargando roles: {errorRoles}</p>;
  if (errorPermisos) return <p style={{ color: 'red' }}>Error cargando permisos: {errorPermisos}</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #ccc", borderRadius: 8 }}>
      <h2>Asignar Permisos a Rol</h2>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, width: '100%' }}>
        <label style={{ minWidth: 90 }}>Rol:&nbsp;</label>
        <select
          value={selectedRol}
          onChange={e => setSelectedRol(e.target.value)}
          required
          style={{ flex: 1, padding: '6px', borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="">Seleccione un rol</option>
          {roles.map(rol => (
            <option key={rol.id} value={rol.id}>{rol.nombre}</option>
          ))}
        </select>
        {/* Bloque invisible para alinear con feedback de permisos */}
        <span style={{ display: 'inline-block', width: 60, height: 24, visibility: 'hidden' }}>OK</span>
      </div>
      {[0,1,2,3,4].map(idx => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 12, width: '100%' }}>
          <label style={{ minWidth: 90 }}>Permiso {idx+1}:&nbsp;</label>
          <select
            value={selectedPermisos[idx]}
            onChange={e => handlePermisoChange(idx, e.target.value)}
            style={{ flex: 1, padding: '6px', borderRadius: 4, border: '1px solid #ccc' }}
          >
            <option value="">Seleccione un permiso</option>
            {permisos.map(perm => (
              <option key={perm.id} value={perm.id}>{perm.nombre}</option>
            ))}
          </select>
          {status[idx] === "ok" && <span style={{ color: "green", marginLeft: 8 }}>✅ OK</span>}
          {status[idx] && status[idx] !== "ok" && <span style={{ color: "red", marginLeft: 8 }}>❌ {status[idx]}</span>}
        </div>
      ))}
      <button
        type="submit"
        disabled={loading || !selectedRol}
        style={{ marginTop: 16, width: "100%", cursor: 'pointer' }}
      >
        {loading ? "Asignando..." : "Asignar Permisos"}
      </button>
    </form>
  );
}
