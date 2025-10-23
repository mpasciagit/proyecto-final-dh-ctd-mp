// 🚗 Servicio de Productos (Vehículos)
import { apiRequest } from '../config/api.js';
import API_CONFIG from '../config/api.js';

class ProductService {
  
  // 📋 Obtener todos los productos
  async getAllProducts() {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PRODUCTOS.BASE);
      return response || [];
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }
  
  // 🔍 Obtener producto por ID
  async getProductById(id) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PRODUCTOS.BY_ID(id));
      return response;
    } catch (error) {
      console.error(`Error al obtener producto ${id}:`, error);
      throw error;
    }
  }
  
  // 📂 Obtener productos por categoría
  async getProductsByCategory(categoryId) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PRODUCTOS.BY_CATEGORIA(categoryId));
      return response || [];
    } catch (error) {
      console.error(`Error al obtener productos de categoría ${categoryId}:`, error);
      throw error;
    }
  }
  
  // 🔍 Buscar productos por nombre
  async searchProductsByName(name) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PRODUCTOS.BY_NOMBRE(name));
      return response || [];
    } catch (error) {
      console.error(`Error al buscar productos por nombre "${name}":`, error);
      throw error;
    }
  }
  
  // ✅ Obtener productos reservables
  async getReservableProducts() {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PRODUCTOS.RESERVABLES);
      return response || [];
    } catch (error) {
      console.error('Error al obtener productos reservables:', error);
      throw error;
    }
  }
  
  // 📦 Obtener productos disponibles (con stock)
  async getAvailableProducts() {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PRODUCTOS.DISPONIBLES);
      return response || [];
    } catch (error) {
      console.error('Error al obtener productos disponibles:', error);
      throw error;
    }
  }

  // 🖼️ Obtener imágenes de un producto específico
  async getProductImages(productId) {
    try {
      const response = await apiRequest(`/imagenes/producto/${productId}`);
      console.log(`✅ Imágenes cargadas para producto ${productId}:`, response);
      return response || [];
    } catch (error) {
      console.error(`Error al obtener imágenes del producto ${productId}:`, error);
      throw error;
    }
  }
  
  // ✔️ Verificar disponibilidad de producto
  async checkProductAvailability(productId, quantity = 1) {
    try {
      const response = await apiRequest(
        API_CONFIG.ENDPOINTS.PRODUCTOS.VERIFICAR_DISPONIBILIDAD(productId, quantity)
      );
      return response;
    } catch (error) {
      console.error(`Error al verificar disponibilidad del producto ${productId}:`, error);
      throw error;
    }
  }
  
  // 🔄 Crear nuevo producto (Admin)
  async createProduct(productData) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PRODUCTOS.BASE, {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      return response;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }
  
  // ✏️ Actualizar producto (Admin)
  async updateProduct(id, productData) {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.PRODUCTOS.BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
      return response;
    } catch (error) {
      console.error(`Error al actualizar producto ${id}:`, error);
      throw error;
    }
  }
  
  // 🗑️ Eliminar producto (Admin)
  async deleteProduct(id) {
    try {
      await apiRequest(API_CONFIG.ENDPOINTS.PRODUCTOS.BY_ID(id), {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error(`Error al eliminar producto ${id}:`, error);
      throw error;
    }
  }
  
  // 🔍 Filtros avanzados (simular búsqueda por múltiples criterios)
  async searchProducts(filters = {}) {
    try {
      let products = await this.getAllProducts();
      
      // Aplicar filtros localmente (hasta que tengamos endpoints específicos)
      if (filters.category) {
        products = products.filter(p => p.categoriaId === filters.category);
      }
      
      if (filters.minPrice !== undefined) {
        products = products.filter(p => p.precio >= filters.minPrice);
      }
      
      if (filters.maxPrice !== undefined) {
        products = products.filter(p => p.precio <= filters.maxPrice);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter(p => 
          p.nombre.toLowerCase().includes(searchTerm) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(searchTerm))
        );
      }
      
      return products;
    } catch (error) {
      console.error('Error en búsqueda avanzada:', error);
      throw error;
    }
  }
}

// Exportar instancia singleton
const productService = new ProductService();
export { productService };
export default productService;