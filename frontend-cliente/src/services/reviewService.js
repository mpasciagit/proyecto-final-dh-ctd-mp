// ⭐ Servicio de Reviews
import { apiRequest } from '../config/api.js';
import API_CONFIG from '../config/api.js';

class ReviewService {
  
  // 📋 Obtener todas las reviews
  async getAllReviews() {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.REVIEWS.BASE);
      return response || [];
    } catch (error) {
      console.error('Error al obtener reviews:', error);
      throw error;
    }
  }
  
  // 🚗 Obtener reviews por producto
  async getReviewsByProduct(productId) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.REVIEWS.BY_PRODUCTO(productId));
      return response || [];
    } catch (error) {
      console.error(`Error al obtener reviews del producto ${productId}:`, error);
      throw error;
    }
  }
  
  // 👤 Obtener reviews por usuario
  async getReviewsByUser(userId) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.REVIEWS.BY_USUARIO(userId));
      return response || [];
    } catch (error) {
      console.error(`Error al obtener reviews del usuario ${userId}:`, error);
      throw error;
    }
  }
  
  // ✅ Crear nueva review
  async createReview(reviewData) {
    try {
      // Ahora se requiere reservaId
      const formattedData = {
        puntuacion: reviewData.rating,
        comentario: reviewData.comment,
        usuarioId: reviewData.userId,
        productoId: reviewData.productId,
        reservaId: reviewData.reservaId
      };
      const response = await apiRequest(API_CONFIG.ENDPOINTS.REVIEWS.BASE, {
        method: 'POST',
        body: JSON.stringify(formattedData)
      });
      return response;
    } catch (error) {
      console.error('Error al crear review:', error);
      throw error;
    }
  }
  
  // ✏️ Actualizar review
  async updateReview(reviewId, reviewData) {
    try {
      const formattedData = {
        puntuacion: reviewData.rating,
        comentario: reviewData.comment,
        usuarioId: reviewData.userId,
        productoId: reviewData.productId
      };
      
      const response = await apiRequest(`${API_CONFIG.ENDPOINTS.REVIEWS.BASE}/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify(formattedData)
      });
      
      return response;
    } catch (error) {
      console.error(`Error al actualizar review ${reviewId}:`, error);
      throw error;
    }
  }
  
  // 🗑️ Eliminar review
  async deleteReview(reviewId) {
    try {
      await apiRequest(`${API_CONFIG.ENDPOINTS.REVIEWS.BASE}/${reviewId}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error(`Error al eliminar review ${reviewId}:`, error);
      throw error;
    }
  }
  
  // 📊 Calcular estadísticas de reviews para un producto
  async getProductReviewStats(productId) {
    try {
      const reviews = await this.getReviewsByProduct(productId);
      
      if (reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        };
      }
      
      // Calcular promedio
      const totalRating = reviews.reduce((sum, review) => sum + review.puntuacion, 0);
      const averageRating = totalRating / reviews.length;
      
      // Distribución de calificaciones
      const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviews.forEach(review => {
        ratingDistribution[review.puntuacion]++;
      });
      
      return {
        averageRating: Math.round(averageRating * 10) / 10, // Redondear a 1 decimal
        totalReviews: reviews.length,
        ratingDistribution
      };
    } catch (error) {
      console.error('Error al calcular estadísticas de reviews:', error);
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }
  }
  
  // 🔄 Mapear review del backend al formato del frontend
  mapBackendReviewToFrontend(backendReview, userName = null) {
    return {
      id: backendReview.id,
      rating: backendReview.puntuacion,
      comment: backendReview.comentario || '',
      date: backendReview.fechaCreacion,
      userId: backendReview.usuarioId,
      productId: backendReview.productoId,
      reservaId: backendReview.reservaId, // Nuevo campo
      userName: userName || `Usuario ${backendReview.usuarioId}`,
      userAvatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100`, // Default avatar
      verified: false, // Backend no tiene este campo
      helpful: 0 // Backend no tiene este campo
    };
  }

  // 🚗 Obtener reviews formateadas por producto (con mapeo al formato frontend)
  async getFormattedReviewsByProduct(productId) {
    try {
      const backendReviews = await this.getReviewsByProduct(productId);
      return backendReviews.map(review => this.mapBackendReviewToFrontend(review));
    } catch (error) {
      console.error(`Error al obtener reviews formateadas del producto ${productId}:`, error);
      throw error;
    }
  }

  // ✅ Verificar si el usuario ya hizo review del producto
  async hasUserReviewed(userId, productId) {
    try {
      const userReviews = await this.getReviewsByUser(userId);
      return userReviews.some(review => review.productoId === productId);
    } catch (error) {
      console.error('Error al verificar review del usuario:', error);
      return false;
    }
  }
}

// Exportar instancia singleton
const reviewService = new ReviewService();
export { reviewService };
export default reviewService;