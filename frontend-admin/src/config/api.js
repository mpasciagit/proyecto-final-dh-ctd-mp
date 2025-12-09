// 📂 src/config/api.js
const API_BASE_URL = "http://localhost:8080/api";

/**
 * Función genérica para hacer requests al backend.
 * Incluye manejo automático de token JWT y errores HTTP.
 */
export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  // Combina headers y agrega token si existe
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Si la respuesta no es exitosa, lanzamos error
    if (!response.ok) {
      let message = `Error ${response.status}`;
      try {
        const errorBody = await response.text();
        message = `${message}: ${errorBody}`;
      } catch {
        /* ignore */
      }

      // Redirigir si el token expiró o no autorizado, solo si NO estamos en rutas públicas
      if (response.status === 401 || response.status === 403) {
        console.warn("🔐 Token inválido o acceso denegado, cerrando sesión...");
        localStorage.removeItem("token");
        const publicRoutes = ["/", "/login", "/register", "/forgot-password"];
        const currentPath = window.location.pathname;
        if (!publicRoutes.includes(currentPath)) {
          window.location.href = "/login";
        }
      }

      throw new Error(message);
    }

    // Devuelve JSON si es posible, si no, texto plano
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text();
    }
  } catch (error) {
    console.error("❌ Error en apiRequest:", error);
    throw error;
  }
}
