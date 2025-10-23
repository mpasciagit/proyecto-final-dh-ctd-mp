import { apiRequest } from '../config/api.js';

const API_URL = '/producto-caracteristicas';

export const productoCaracteristicaService = {
    // Obtener todas las relaciones producto-característica
    findAll: async () => {
        try {
            const response = await apiRequest(API_URL);
            return response;
        } catch (error) {
            console.error('Error al obtener producto-caracteristicas:', error);
            throw error;
        }
    },

    // Obtener una relación específica por ID
    findById: async (id) => {
        try {
            const response = await apiRequest(`${API_URL}/${id}`);
            return response;
        } catch (error) {
            console.error(`Error al obtener producto-caracteristica ${id}:`, error);
            throw error;
        }
    },

    // Filtrar características por producto ID (filtrado en frontend)
    findByProductoId: async (productoId) => {
        try {
            const allRelations = await productoCaracteristicaService.findAll();
            return allRelations.filter(pc => pc.productoId === productoId);
        } catch (error) {
            console.error(`Error al obtener caracteristicas para producto ${productoId}:`, error);
            throw error;
        }
    }
};