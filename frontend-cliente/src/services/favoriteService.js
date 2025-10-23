// ❤️ Servicio de Favoritos
import { apiRequest } from '../config/api.js';
import API_CONFIG from '../config/api.js';

class FavoriteService {
  
  // 📋 Obtener todos los favoritos
  async getAllFavorites() {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.FAVORITOS.BASE);
      return response || [];
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      throw error;
    }
  }
  
  // 👤 Obtener favoritos por usuario
  async getFavoritesByUser(userId) {
    console.log('🔍 Obteniendo favoritos del usuario:', userId);
    console.log('🔍 API_CONFIG:', API_CONFIG);
    console.log('🔍 BY_USUARIO function:', API_CONFIG.ENDPOINTS.FAVORITOS.BY_USUARIO);
    
    try {
      const endpoint = API_CONFIG.ENDPOINTS.FAVORITOS.BY_USUARIO(userId);
      console.log('📋 Endpoint construido:', endpoint);
      console.log('📋 URL completa:', `${API_CONFIG.BASE_URL}${endpoint}`);
      
      const response = await apiRequest(endpoint);
      console.log('📋 Respuesta favoritos del backend:', response);
      return response || [];
    } catch (error) {
      console.error(`❌ Error al obtener favoritos del usuario ${userId}:`, error);
      console.error('📋 Endpoint utilizado:', endpoint);
      console.error('📋 Error completo:', error);
      throw error;
    }
  }
  
  // ❤️ Agregar producto a favoritos
  async addFavorite(userId, productId) {
    try {
      console.log('🔍 Agregando favorito:', { userId, productId });
      const response = await apiRequest(API_CONFIG.ENDPOINTS.FAVORITOS.BASE, {
        method: 'POST',
        body: JSON.stringify({
          usuarioId: userId,
          productoId: productId
        })
      });
      
      console.log('✅ Favorito agregado:', response);
      return response;
    } catch (error) {
      console.error('❌ Error al agregar favorito:', error);
      console.error('📋 Datos enviados:', { userId, productId });
      throw error;
    }
  }

  // 🔄 Agregar/Quitar de favoritos (toggle) - DEPRECATED: usar addFavorite/removeFavorite
  async toggleFavorite(userId, productId) {
    try {
      // Verificar si ya existe el favorito
      const userFavorites = await this.getFavoritesByUser(userId);
      const existingFavorite = userFavorites.find(fav => fav.productoId === productId);
      
      if (existingFavorite) {
        // Si existe, eliminarlo
        await this.removeFavorite(existingFavorite.id);
        return { action: 'removed', favorite: existingFavorite };
      } else {
        // Si no existe, agregarlo
        const newFavorite = await this.addFavorite(userId, productId);
        return { action: 'added', favorite: newFavorite };
      }
    } catch (error) {
      console.error('Error al toggle favorito:', error);
      throw error;
    }
  }
  
  // ✅ Verificar si un producto está en favoritos
  async isFavorite(userId, productId) {
    try {
      const userFavorites = await this.getFavoritesByUser(userId);
      return userFavorites.some(fav => fav.productoId === productId);
    } catch (error) {
      console.error('Error al verificar favorito:', error);
      return false;
    }
  }
  
  // 🗑️ Eliminar favorito específico
  async removeFavorite(favoriteId) {
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.FAVORITOS.BASE}/${favoriteId}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error(`Error al eliminar favorito ${favoriteId}:`, error);
      throw error;
    }
  }
}

// Exportar instancia singleton
const favoriteService = new FavoriteService();
export { favoriteService };
export default favoriteService;