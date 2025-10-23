// 🔄 Índice de Servicios - Integración Backend
// Exporta todos los servicios para la integración con backend-proy-final

// Servicios principales
export { default as authService } from './authService.js';
export { default as productService } from './productService.js';
export { default as categoryService } from './categoryService.js';
export { default as reservationService } from './reservationService.js';
export { default as favoriteService } from './favoriteService.js';
export { default as reviewService } from './reviewService.js';

// Configuración de API
export { default as API_CONFIG, apiRequest, getAuthHeaders, buildApiUrl } from '../config/api.js';

// Helper para inicializar servicios
export const initializeServices = () => {
  console.log('🚀 Servicios de integración backend inicializados');
  console.log('📡 Backend URL:', 'http://localhost:8080/api');
  
  // Verificar conectividad (opcional)
  return fetch('http://localhost:8080/api/productos')
    .then(response => {
      if (response.ok) {
        console.log('✅ Conexión con backend establecida');
        return true;
      } else {
        console.warn('⚠️ Backend no responde correctamente');
        return false;
      }
    })
    .catch(error => {
      console.warn('⚠️ No se pudo conectar con el backend:', error.message);
      return false;
    });
};

// Estados de conexión
export const CONNECTION_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  CHECKING: 'checking'
};

// Helper para manejar errores de API
export const handleApiError = (error, context = '') => {
  console.error(`API Error ${context}:`, error);
  
  // Mapear errores comunes
  if (error.message.includes('401')) {
    return 'Sesión expirada. Por favor, inicia sesión nuevamente.';
  }
  
  if (error.message.includes('403')) {
    return 'No tienes permisos para realizar esta acción.';
  }
  
  if (error.message.includes('404')) {
    return 'El recurso solicitado no fue encontrado.';
  }
  
  if (error.message.includes('500')) {
    return 'Error interno del servidor. Intenta más tarde.';
  }
  
  if (error.message.includes('fetch')) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión.';
  }
  
  return error.message || 'Ha ocurrido un error inesperado.';
};