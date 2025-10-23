// 📅 Servicio de Reservas
import { apiRequest } from '../config/api.js';
import API_CONFIG from '../config/api.js';

class ReservationService {
  // Alias para compatibilidad con hooks: getReservasByUser
  async getReservasByUser(userId) {
    return this.getReservationsByUser(userId);
  }
  
  // 📋 Obtener todas las reservas
  async getAllReservations() {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.RESERVAS.BASE);
      return response || [];
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      throw error;
    }
  }
  
  // 🔍 Obtener reserva por ID
  async getReservationById(id) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.RESERVAS.BY_ID(id));
      return response;
    } catch (error) {
      console.error(`Error al obtener reserva ${id}:`, error);
      throw error;
    }
  }
  
  // 👤 Obtener reservas por usuario
  async getReservationsByUser(userId) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.RESERVAS.BY_USUARIO(userId));
      return response || [];
    } catch (error) {
      console.error(`Error al obtener reservas del usuario ${userId}:`, error);
      throw error;
    }
  }
  
  // 🚗 Obtener reservas por producto
  async getReservationsByProduct(productId) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.RESERVAS.BY_PRODUCTO(productId));
      return response || [];
    } catch (error) {
      console.error(`Error al obtener reservas del producto ${productId}:`, error);
      throw error;
    }
  }
  
  // 📊 Obtener reservas por estado
  async getReservationsByStatus(status) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.RESERVAS.BY_ESTADO(status));
      return response || [];
    } catch (error) {
      console.error(`Error al obtener reservas con estado ${status}:`, error);
      throw error;
    }
  }
  
  // 📅 Obtener reservas por rango de fechas
  async getReservationsByDateRange(startDate, endDate) {
    try {
      const params = new URLSearchParams({
        desde: startDate,
        hasta: endDate
      });
      
      const response = await apiRequest(
        `${API_CONFIG.ENDPOINTS.RESERVAS.BY_RANGO_FECHAS}?${params}`
      );
      return response || [];
    } catch (error) {
      console.error('Error al obtener reservas por rango de fechas:', error);
      throw error;
    }
  }
  
  // ✅ Crear nueva reserva
  async createReservation(reservationData) {
    try {
      // Formatear datos para el backend
      const formattedData = {
        fechaInicio: new Date(reservationData.startDate).toISOString().split('T')[0], // Formato YYYY-MM-DD
        fechaFin: new Date(reservationData.endDate).toISOString().split('T')[0],     // Formato YYYY-MM-DD
        usuarioId: reservationData.userId,
        productoId: reservationData.productId,
        estado: reservationData.status || 'PENDIENTE'
      };
      
      const response = await apiRequest(API_CONFIG.ENDPOINTS.RESERVAS.BASE, {
        method: 'POST',
        body: JSON.stringify(formattedData)
      });
      
      return response;
    } catch (error) {
      console.error('Error al crear reserva:', error);
      throw error;
    }
  }
  
  // ✏️ Actualizar reserva
  async updateReservation(id, reservationData) {
    try {
      const formattedData = {
        id: id,
        fechaInicio: reservationData.startDate,
        fechaFin: reservationData.endDate,
        usuarioId: reservationData.userId,
        productoId: reservationData.productId,
        estado: reservationData.status
      };
      
      const response = await apiRequest(API_CONFIG.ENDPOINTS.RESERVAS.BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(formattedData)
      });
      
      return response;
    } catch (error) {
      console.error(`Error al actualizar reserva ${id}:`, error);
      throw error;
    }
  }
  
  // 🗑️ Cancelar/Eliminar reserva
  async cancelReservation(id) {
    try {
      await apiRequest(API_CONFIG.ENDPOINTS.RESERVAS.BY_ID(id), {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error(`Error al cancelar reserva ${id}:`, error);
      throw error;
    }
  }
  
  // 📊 Verificar disponibilidad para nuevas reservas
  async checkAvailability(productId, startDate, endDate) {
    try {
      // Obtener reservas existentes del producto
      const existingReservations = await this.getReservationsByProduct(productId);
      
      // Filtrar reservas activas (no canceladas)
      const activeReservations = existingReservations.filter(
        reservation => reservation.estado !== 'CANCELADA'
      );
      
      // Verificar conflictos de fechas
      const hasConflict = activeReservations.some(reservation => {
        const reserveStart = new Date(reservation.fechaInicio);
        const reserveEnd = new Date(reservation.fechaFin);
        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);
        
        // Verificar solapamiento
        return (newStart < reserveEnd && newEnd > reserveStart);
      });
      
      return !hasConflict;
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      throw error;
    }
  }
  
  // 📅 Obtener fechas ocupadas para un producto
  async getUnavailableDates(productId) {
    try {
      const reservations = await this.getReservationsByProduct(productId);
      
      // Filtrar solo reservas activas
      const activeReservations = reservations.filter(
        reservation => ['PENDIENTE', 'CONFIRMADA'].includes(reservation.estado)
      );
      
      // Convertir a array de rangos de fechas
      return activeReservations.map(reservation => ({
        start: reservation.fechaInicio,
        end: reservation.fechaFin
      }));
    } catch (error) {
      console.error('Error al obtener fechas no disponibles:', error);
      return [];
    }
  }
}

// Exportar instancia singleton
const reservationService = new ReservationService();
export { reservationService };
export default reservationService;