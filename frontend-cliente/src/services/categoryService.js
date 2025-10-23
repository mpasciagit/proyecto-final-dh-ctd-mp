// 📂 Servicio de Categorías
import { apiRequest } from '../config/api.js';
import API_CONFIG from '../config/api.js';

class CategoryService {
  
  // 📋 Obtener todas las categorías
  async getAllCategories() {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.CATEGORIAS.BASE);
      return response || [];
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      throw error;
    }
  }
  
  // 🔍 Obtener categoría por ID
  async getCategoryById(id) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.CATEGORIAS.BY_ID(id));
      return response;
    } catch (error) {
      console.error(`Error al obtener categoría ${id}:`, error);
      throw error;
    }
  }
  
  // 🔄 Crear nueva categoría (Admin)
  async createCategory(categoryData) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.CATEGORIAS.BASE, {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });
      return response;
    } catch (error) {
      console.error('Error al crear categoría:', error);
      throw error;
    }
  }
  
  // ✏️ Actualizar categoría (Admin)
  async updateCategory(id, categoryData) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.CATEGORIAS.BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(categoryData)
      });
      return response;
    } catch (error) {
      console.error(`Error al actualizar categoría ${id}:`, error);
      throw error;
    }
  }
  
  // 🗑️ Eliminar categoría (Admin)
  async deleteCategory(id) {
    try {
      await apiRequest(API_CONFIG.ENDPOINTS.CATEGORIAS.BY_ID(id), {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error(`Error al eliminar categoría ${id}:`, error);
      throw error;
    }
  }
}

// Exportar instancia singleton
const categoryService = new CategoryService();
export { categoryService };
export default categoryService;