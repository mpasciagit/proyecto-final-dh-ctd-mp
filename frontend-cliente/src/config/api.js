// 🔧 Configuración de API para integración con backend
const API_CONFIG = {
  // URLs base
  BASE_URL: 'http://localhost:8080/api',
  
  // Endpoints principales
  ENDPOINTS: {
    // Autenticación
    AUTH: {
      LOGIN: '/auth/authenticate',
      REGISTER: '/auth/register',
      CHANGE_PASSWORD: '/auth/change-password',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password'
    },
    
    // Productos (Vehículos)
    PRODUCTOS: {
      BASE: '/productos',
      BY_ID: (id) => `/productos/${id}`,
      BY_CATEGORIA: (categoriaId) => `/productos/categoria/${categoriaId}`,
      BY_NOMBRE: (nombre) => `/productos/nombre/${nombre}`,
      RESERVABLES: '/productos/reservables',
      DISPONIBLES: '/productos/disponibles',
      VERIFICAR_DISPONIBILIDAD: (id, cantidad) => `/productos/${id}/disponibilidad/${cantidad}`
    },
    
    // Categorías
    CATEGORIAS: {
      BASE: '/categorias',
      BY_ID: (id) => `/categorias/${id}`
    },
    
    // Reservas
    RESERVAS: {
      BASE: '/reservas',
      BY_ID: (id) => `/reservas/${id}`,
      BY_USUARIO: (usuarioId) => `/reservas/usuario/${usuarioId}`,
      BY_PRODUCTO: (productoId) => `/reservas/producto/${productoId}`,
      BY_ESTADO: (estado) => `/reservas/estado/${estado}`,
      BY_RANGO_FECHAS: '/reservas/rango-fechas'
    },
    
    // Favoritos
    FAVORITOS: {
      BASE: '/favoritos',
      BY_USUARIO: (usuarioId) => `/favoritos/usuario/${usuarioId}`
    },
    
    // Reviews
    REVIEWS: {
      BASE: '/reviews',
      BY_PRODUCTO: (productoId) => `/reviews/producto/${productoId}`,
      BY_USUARIO: (usuarioId) => `/reviews/usuario/${usuarioId}`
    },
    
    // Usuarios
    USUARIOS: {
      BASE: '/usuarios',
      BY_ID: (id) => `/usuarios/${id}`
    }
  }
};

// 🔑 Helper para obtener headers con autenticación
export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// 🌐 Helper para construir URL completa
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// 📡 Configuración de fetch con manejo de errores
export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  const config = {
    headers: getAuthHeaders(),
    ...options
  };

  try {
    const response = await fetch(url, config);

    // Si la respuesta no es ok (4xx o 5xx), lanzar error
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      throw new Error(errorData.message || errorData || `HTTP Error ${response.status}`);
    }

    // Si es 204 No Content, retornar un objeto con mensaje de éxito
    if (response.status === 204) {
      return { successMessage: 'Operación completada sin contenido de respuesta.' };
    }

    // Obtener el Content-Type para decidir cómo leer el cuerpo
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      // Caso A: Si es JSON
      return await response.json();
    } else {
      // Caso B: Si es texto plano
      const text = await response.text();
      return { successMessage: text };
    }
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default API_CONFIG;