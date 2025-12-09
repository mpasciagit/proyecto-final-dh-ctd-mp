// src/hooks/useCrudActions.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

/**
 * Custom Hook para manejar las operaciones CRUD (Lectura, Actualización, Eliminación).
 * @param {string} endpoint - La ruta base del recurso (ej: "/api/caracteristicas").
 * @returns {object} Estado y funciones CRUD.
 */

export const useCrudActions = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Siempre obtener el token más reciente
  const getToken = () => localStorage.getItem("token");

  // Fetch de datos (Read)
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      const response = await axios.get(`http://localhost:8080${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("Acceso denegado");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Recarga datos al montar y cada vez que el endpoint cambie
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  // Actualización de ítem (Update - PUT)
  const saveItem = async (id, updatedData) => {
    try {
      const token = getToken();
      await axios.put(`http://localhost:8080${endpoint}/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Actualiza el estado localmente
      setData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
      );
      return true; // Éxito
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      alert("Error al guardar los cambios.");
      return false; // Fallo
    }
  };

  // Eliminación de ítem (Delete - DELETE)
  const deleteItem = async (idOrObj) => {
    try {
      const token = getToken();
      let url = `http://localhost:8080${endpoint}`;
      // Soporte especial para rol-permiso: espera objeto con rol y permiso
      if (endpoint === "/api/rol-permiso" && typeof idOrObj === "object" && (idOrObj.rolId || idOrObj.rol) && (idOrObj.permisoId || idOrObj.permiso)) {
        // Usar rolId y permisoId si existen, si no, fallback a lo anterior
        let rolId = idOrObj.rolId ?? null;
        let permisoId = idOrObj.permisoId ?? null;
        // Fallbacks si no existen los id
        if (!rolId) {
          if (typeof idOrObj.rol === "object") {
            rolId = idOrObj.rol.id;
          } else {
            rolId = idOrObj.rol;
          }
        }
        if (!permisoId) {
          if (typeof idOrObj.permiso === "object") {
            permisoId = idOrObj.permiso.id;
          } else {
            permisoId = idOrObj.permiso;
          }
        }
        url = `http://localhost:8080/api/rol-permiso/rol/${rolId}/permiso/${permisoId}`;
      } else {
        url = `${url}/${idOrObj}`;
      }
      await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filtra el elemento eliminado del estado local
      setData((prev) => {
        if (endpoint === "/api/rol-permiso" && typeof idOrObj === "object" && (idOrObj.rolId || idOrObj.rol) && (idOrObj.permisoId || idOrObj.permiso)) {
          let rolId = idOrObj.rolId ?? null;
          let permisoId = idOrObj.permisoId ?? null;
          if (!rolId) {
            if (typeof idOrObj.rol === "object") {
              rolId = idOrObj.rol.id;
            } else {
              rolId = idOrObj.rol;
            }
          }
          if (!permisoId) {
            if (typeof idOrObj.permiso === "object") {
              permisoId = idOrObj.permiso.id;
            } else {
              permisoId = idOrObj.permiso;
            }
          }
          return prev.filter((item) => {
            const itemRolId = item.rolId ?? (typeof item.rol === "object" ? item.rol.id : item.rol);
            const itemPermisoId = item.permisoId ?? (typeof item.permiso === "object" ? item.permiso.id : item.permiso);
            return !(itemRolId === rolId && itemPermisoId === permisoId);
          });
        } else {
          return prev.filter((item) => item.id !== idOrObj);
        }
      });
      return true; // Éxito
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar el ítem.");
      return false; // Fallo
    }
  };

  return { data, loading, error, fetchData, saveItem, deleteItem, setData };
};