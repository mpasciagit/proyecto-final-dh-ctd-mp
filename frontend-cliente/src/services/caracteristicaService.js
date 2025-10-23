import { apiRequest } from '../config/api.js';

const API_URL = '/caracteristicas';

export const caracteristicaService = {
    // Obtener todas las características
    findAll: async () => {
        try {
            const response = await apiRequest(API_URL);
            return response;
        } catch (error) {
            console.error('Error al obtener características:', error);
            throw error;
        }
    },

    // Obtener una característica específica por ID
    findById: async (id) => {
        try {
            const response = await apiRequest(`${API_URL}/${id}`);
            return response;
        } catch (error) {
            console.error(`Error al obtener característica ${id}:`, error);
            throw error;
        }
    }
};