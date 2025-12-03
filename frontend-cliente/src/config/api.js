// 🚨 Nuevo: Función para determinar dinámicamente la URL base de la API
const getDynamicBaseUrl = () => {
  const hostname = window.location.hostname;
  // Puerto de tu backend Spring Boot
  const BACKEND_PORT = '8080'; 

  // Verificar si estamos en desarrollo local (localhost o 127.0.0.1)
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

  if (isLocalhost) {
    // Si estamos en localhost, usamos la ruta relativa que será interceptada por el proxy de Vite
    // Ejemplo: /api
    return '/api'; 
  } else {
    // Si estamos en una IP de red (ej: 192.168.0.105), apuntamos DIRECTAMENTE al backend
    // Esto evita el conflicto de red del proxy de Vite.
    // Ejemplo: http://192.168.0.105:8080/api
    const protocol = window.location.protocol;
    return `${protocol}//${hostname}:${BACKEND_PORT}/api`;
  }
};


// 🔧 Configuración de API para integración con backend
const API_CONFIG = {
  // URLs base
  // 💥 CAMBIO CLAVE: Llama a la función para obtener la URL dinámica
  BASE_URL: getDynamicBaseUrl(),
  
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
      BY_RANGO_FECHAS: '/reservas/rango-fechas',
      DISPONIBILIDAD: '/reservas/disponibilidad' // <--- agregado
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
  // 🚨 RECOMENDACIÓN: Si usas Firebase u otra solución en el futuro,
  // recuerda reemplazar localStorage por la gestión de estado centralizada.
  const token = localStorage.getItem('authToken'); 
  return {
    'Content-Type': 'application/json',
    // Agrega el token si existe
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// 🌐 Helper para construir URL completa
export const buildApiUrl = (endpoint) => {
  // Ahora utiliza la BASE_URL dinámica
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// 📡 Configuración de fetch con manejo de errores
export const apiRequest = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  
  // Imprimir para depuración, así ves qué URL se está usando
  console.log(`[API] Solicitando a: ${url}`); 
  
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
        // Intenta leer como JSON primero
        errorData = await response.json();
      } catch {
        // Si falla, lee como texto
        errorData = await response.text();
      }
      // Lanza un error más descriptivo
      throw new Error(errorData.message || errorData || `HTTP Error ${response.status} en ${url}`);
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
      // Si hay contenido, se retorna; si no, se usa un mensaje de éxito.
      return text ? { textContent: text } : { successMessage: 'Respuesta de texto recibida.' };
    }
  } catch (error) {
    console.error(`[API ERROR] Falló la solicitud a ${url}:`, error);
    // Vuelve a lanzar el error para que pueda ser manejado por el componente que llamó
    throw error; 
  }
};

export default API_CONFIG;