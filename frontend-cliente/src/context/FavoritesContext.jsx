import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import favoriteService from '../services/favoriteService';
import productService from '../services/productService';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🔄 Cargar favoritos del usuario desde el backend
  const loadUserFavorites = async () => {
    if (!isAuthenticated || !user?.id) {
      setFavorites([]);
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔍 Cargando favoritos del usuario:', user.id);
      
      // Obtener favoritos del backend
      let backendFavorites;
      try {
        backendFavorites = await favoriteService.getFavoritesByUser(user.id);
        console.log('📋 Favoritos del backend:', backendFavorites);
      } catch (favoriteError) {
        console.error('❌ ERROR específico al obtener favoritos:', favoriteError);
        console.error('❌ Mensaje del error:', favoriteError.message);
        console.error('❌ Detalles del error:', favoriteError);
        throw favoriteError;
      }
      
      // Enriquecer cada favorito con datos completos del producto
      const enrichedFavorites = await Promise.all(
        backendFavorites.map(async (favorite) => {
          try {
            const productData = await productService.getProductById(favorite.productoId);
            console.log(`📦 Datos del producto ${favorite.productoId}:`, productData);
            
            // Obtener imágenes del producto
            let productImages = [];
            try {
              productImages = await productService.getProductImages(favorite.productoId);
            } catch (imageError) {
              console.warn(`⚠️ No se pudieron obtener imágenes para producto ${favorite.productoId}:`, imageError);
            }
            
            return {
              id: favorite.productoId, // Usar productoId como id para consistencia
              favoriteId: favorite.id, // ID del registro de favorito
              nombre: productData?.nombre || 'Producto sin nombre',
              categoria: productData?.categoriaNombre || 'Sin categoría',
              precio: productData?.precio || 0,
              pasajeros: productData?.pasajeros || 0,
              ubicacion: productData?.ubicacion || 'Ubicación no disponible',
              imagen: productImages?.[0]?.url || productData?.imagenes?.[0]?.url || productData?.imagen || '/placeholder-car.jpg',
              addedAt: favorite.fechaCreacion || favorite.createdAt || new Date().toISOString()
            };
          } catch (productError) {
            console.error(`❌ Error al obtener datos del producto ${favorite.productoId}:`, productError);
            // Retornar datos mínimos si falla la carga del producto
            return {
              id: favorite.productoId,
              favoriteId: favorite.id,
              nombre: `Producto ${favorite.productoId}`,
              categoria: 'Sin categoría',
              precio: 0,
              pasajeros: 0,
              ubicacion: 'N/A',
              imagen: '/placeholder-car.jpg',
              addedAt: favorite.fechaCreacion || favorite.createdAt || new Date().toISOString()
            };
          }
        })
      );
      
      console.log('✅ Favoritos enriquecidos:', enrichedFavorites);
      console.log('📊 Total de favoritos cargados:', enrichedFavorites.length);
      setFavorites(enrichedFavorites);
    } catch (error) {
      console.error('❌ Error al cargar favoritos:', error);
      console.error('❌ Tipo de error:', typeof error);
      console.error('❌ Stack del error:', error.stack);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar favoritos cuando el usuario cambie
  useEffect(() => {
    loadUserFavorites();
  }, [user, isAuthenticated]);

  // Agregar producto a favoritos
  const addToFavorites = async (product) => {
    if (!isAuthenticated || !user?.id) {
      throw new Error('Debes iniciar sesión para agregar favoritos');
    }

    console.log('🔍 Estado de autenticación:', { isAuthenticated, user });
    setIsLoading(true);

    try {
      // Verificar si ya está en favoritos
      const isAlreadyFavorite = favorites.find(fav => fav.id === product.id);
      if (isAlreadyFavorite) {
        throw new Error('Este vehículo ya está en tus favoritos');
      }

      // Agregar al backend
      console.log('❤️ Agregando a favoritos:', { usuarioId: user.id, productoId: product.id });
      await favoriteService.addFavorite(user.id, product.id);
      
      // Recargar favoritos desde el backend
      await loadUserFavorites();

      return { success: true, message: 'Agregado a favoritos' };
    } catch (error) {
      console.error('❌ Error al agregar favorito:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Quitar producto de favoritos
  const removeFromFavorites = async (productId) => {
    if (!isAuthenticated || !user?.id) {
      throw new Error('Debes iniciar sesión para gestionar favoritos');
    }

    setIsLoading(true);

    try {
      // Encontrar el favorito por productId
      const favorite = favorites.find(fav => fav.id === productId);
      if (!favorite) {
        throw new Error('Este producto no está en favoritos');
      }

      // Eliminar del backend usando el favoriteId
      console.log('🗑️ Eliminando favorito:', { favoriteId: favorite.favoriteId, productId });
      if (!favorite.favoriteId) {
        throw new Error('No se puede eliminar: ID de favorito no encontrado');
      }
      
      await favoriteService.removeFavorite(favorite.favoriteId);
      
      // Recargar favoritos desde el backend
      await loadUserFavorites();

      return { success: true, message: 'Eliminado de favoritos' };
    } catch (error) {
      console.error('❌ Error al eliminar favorito:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favorito (agregar o quitar)
  const toggleFavorite = async (product) => {
    const currentFavorite = favorites.find(fav => fav.id === product.id);
    
    console.log('🔄 Toggle favorito:', { 
      productId: product.id, 
      productName: product.nombre,
      isCurrentlyFavorite: !!currentFavorite,
      currentFavorites: favorites.map(f => ({ id: f.id, name: f.nombre }))
    });
    
    if (currentFavorite) {
      console.log('➖ Eliminando de favoritos...');
      const result = await removeFromFavorites(product.id);
      console.log('✅ Resultado eliminación:', result);
      return result;
    } else {
      console.log('➕ Agregando a favoritos...');
      const result = await addToFavorites(product);
      console.log('✅ Resultado adición:', result);
      return result;
    }
  };

  // Verificar si un producto es favorito
  const isFavorite = (productId) => {
    const result = favorites.some(fav => fav.id === productId);
    // Solo logear si hay favoritos para evitar spam
    if (favorites.length > 0) {
      console.log('❓ Verificando isFavorite:', { 
        productId, 
        result, 
        favoriteIds: favorites.map(f => f.id),
        totalFavorites: favorites.length 
      });
    }
    return result;
  };

  // Obtener todos los favoritos
  const getFavorites = () => {
    return favorites.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  };

  // Limpiar todos los favoritos
  const clearFavorites = async () => {
    if (!isAuthenticated || !user?.id) {
      throw new Error('Debes iniciar sesión para gestionar favoritos');
    }

    setIsLoading(true);

    try {
      // Eliminar todos los favoritos del backend uno por uno
      const deletePromises = favorites.map(async (favorite) => {
        if (!favorite.favoriteId) {
          console.warn('⚠️ Favorito sin ID, saltando:', favorite);
          return;
        }
        return favoriteService.removeFavorite(favorite.favoriteId);
      });

      await Promise.all(deletePromises.filter(Boolean));
      
      // Recargar favoritos desde el backend
      await loadUserFavorites();

      return { success: true, message: 'Favoritos eliminados' };
    } catch (error) {
      console.error('❌ Error al limpiar favoritos:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener estadísticas de favoritos
  const getFavoritesStats = () => {
    const total = favorites.length;
    const categories = {};
    
    // Contar categorías, manejando valores undefined o vacíos
    favorites.forEach(fav => {
      const categoryName = fav.categoria || 'Sin categoría';
      categories[categoryName] = (categories[categoryName] || 0) + 1;
    });

    // Encontrar la categoría más popular
    let mostFavoritedCategory = 'N/A';
    if (Object.keys(categories).length > 0) {
      mostFavoritedCategory = Object.keys(categories).reduce((a, b) => 
        categories[a] > categories[b] ? a : b
      );
    }

    console.log('📊 Estadísticas de favoritos:', {
      total,
      categories,
      mostFavoritedCategory
    });

    return {
      total,
      categories,
      mostFavoritedCategory,
      isEmpty: total === 0
    };
  };

  // 🐛 Función de debugging
  const debugFavorites = () => {
    console.log('🐛 DEBUG FAVORITOS:');
    console.log('- Usuario actual:', user);
    console.log('- Autenticado:', isAuthenticated);
    console.log('- Favoritos en estado:', favorites);
    console.log('- Total favoritos:', favorites.length);
    console.log('- Loading:', isLoading);
    
    // También intentar recargar favoritos
    if (user?.id) {
      console.log('🔄 Recargando favoritos del usuario ID:', user.id);
      loadUserFavorites();
    }
  };

  // Exponer función de debug en window para acceso desde consola
  if (typeof window !== 'undefined') {
    window.debugFavorites = debugFavorites;
  }

  const value = {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavorites,
    clearFavorites,
    getFavoritesStats,
    loadUserFavorites,
    debugFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};