import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

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

  const FAVORITES_KEY = 'user_favorites';

  // Cargar favoritos del usuario desde localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedFavorites = localStorage.getItem(`${FAVORITES_KEY}_${user.id}`);
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
          console.error('Error loading favorites:', error);
          setFavorites([]);
        }
      }
    } else {
      setFavorites([]);
    }
  }, [user, isAuthenticated]);

  // Guardar favoritos en localStorage
  const saveFavorites = (newFavorites) => {
    if (isAuthenticated && user) {
      localStorage.setItem(`${FAVORITES_KEY}_${user.id}`, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    }
  };

  // Agregar producto a favoritos
  const addToFavorites = async (product) => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para agregar favoritos');
    }

    setIsLoading(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));

      // Verificar si ya está en favoritos
      const isAlreadyFavorite = favorites.find(fav => fav.id === product.id);
      if (isAlreadyFavorite) {
        throw new Error('Este vehículo ya está en tus favoritos');
      }

      const favoriteItem = {
        id: product.id,
        nombre: product.nombre,
        categoria: product.categoria,
        precio: product.precio,
        pasajeros: product.pasajeros,
        ubicacion: product.ubicacion,
        imagen: product.imagen,
        addedAt: new Date().toISOString()
      };

      const updatedFavorites = [...favorites, favoriteItem];
      saveFavorites(updatedFavorites);

      return { success: true, message: 'Agregado a favoritos' };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Quitar producto de favoritos
  const removeFromFavorites = async (productId) => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para gestionar favoritos');
    }

    setIsLoading(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 300));

      const updatedFavorites = favorites.filter(fav => fav.id !== productId);
      saveFavorites(updatedFavorites);

      return { success: true, message: 'Eliminado de favoritos' };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle favorito (agregar o quitar)
  const toggleFavorite = async (product) => {
    const isFavorite = favorites.find(fav => fav.id === product.id);
    
    if (isFavorite) {
      return await removeFromFavorites(product.id);
    } else {
      return await addToFavorites(product);
    }
  };

  // Verificar si un producto es favorito
  const isFavorite = (productId) => {
    return favorites.some(fav => fav.id === productId);
  };

  // Obtener todos los favoritos
  const getFavorites = () => {
    return favorites.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  };

  // Limpiar todos los favoritos
  const clearFavorites = async () => {
    if (!isAuthenticated) {
      throw new Error('Debes iniciar sesión para gestionar favoritos');
    }

    setIsLoading(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));

      saveFavorites([]);
      return { success: true, message: 'Favoritos eliminados' };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener estadísticas de favoritos
  const getFavoritesStats = () => {
    const total = favorites.length;
    const categories = {};
    
    favorites.forEach(fav => {
      categories[fav.categoria] = (categories[fav.categoria] || 0) + 1;
    });

    const mostFavoritedCategory = Object.keys(categories).reduce((a, b) => 
      categories[a] > categories[b] ? a : b, ''
    );

    return {
      total,
      categories,
      mostFavoritedCategory,
      isEmpty: total === 0
    };
  };

  const value = {
    favorites,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavorites,
    clearFavorites,
    getFavoritesStats
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};