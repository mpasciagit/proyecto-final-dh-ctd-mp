// 🔐 Servicio de Autenticación
import { apiRequest } from '../config/api.js';
import API_CONFIG from '../config/api.js';

class AuthService {
  
  // 🔑 Login
  async login(email, password) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      // Guardar token en localStorage
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        
        // 🔧 FIX: Guardar datos completos del usuario desde la respuesta del backend
        const userData = {
          id: response.usuarioId,
          email: response.email,
          nombre: response.nombre,
          apellido: response.apellido,
          roles: response.roles
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }
  
  // 📝 Registro
  async register(userData) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      
      // Guardar token en localStorage si viene en la respuesta
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        
        // 🔧 FIX: Guardar datos completos del usuario desde la respuesta del backend
        const userDataComplete = {
          id: response.usuarioId,
          email: response.email,
          nombre: response.nombre,
          apellido: response.apellido,
          roles: response.roles
        };
        localStorage.setItem('user', JSON.stringify(userDataComplete));
      }
      
      return response;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }
  
  // 🚪 Logout
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Opcional: llamada al backend para invalidar token
  }
  
  // ✅ Verificar si está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  }
  
  // 👤 Obtener usuario actual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  
  // 🔄 Cambiar contraseña
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ 
          currentPassword, 
          newPassword 
        })
      });
      
      return response;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }
  
  // 🔒 Olvidé mi contraseña
  async forgotPassword(email) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      
      return response;
    } catch (error) {
      console.error('Error en forgot password:', error);
      throw error;
    }
  }
  
  // 🔓 Resetear contraseña
  async resetPassword(token, newPassword) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ token, newPassword })
      });
      
      return response;
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      throw error;
    }
  }
  
  // 🔍 Verificar validez del token
  async verifyToken() {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {
      // Intentar hacer una petición autenticada simple
      await apiRequest('/usuarios'); // Endpoint para verificar token
      return true;
    } catch (error) {
      // Si falla, el token no es válido
      this.logout();
      return false;
    }
  }
}

// Exportar instancia singleton
const authService = new AuthService();
export { authService };
export default authService;