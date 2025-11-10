import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import favoriteService from "../services/favoriteService";
import productService from "../services/productService";

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
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

      // Obtener favoritos del backend
      const backendFavorites = await favoriteService.getFavoritesByUser(user.id);

      // ✅ Enriquecer con datos completos del producto (incluye características)
      const enrichedFavorites = await Promise.all(
        backendFavorites.map(async (favorite) => {
          try {
            const productData = await productService.getProductById(favorite.productoId);

            const imagen =
              productData?.imagenes?.[0]?.url ||
              productData?.imagen ||
              "/placeholder-car.jpg";

            const caracteristicas =
              productData?.caracteristicas?.map((c) => ({
                id: c.id,
                nombre: c.nombre,
                iconoUrl: c.iconoUrl,
                valor: c.descripcion || c.valor || "", // soporte para ambos campos
              })) || [];

            return {
              id: favorite.productoId,
              favoriteId: favorite.id,
              nombre: productData?.nombre || "Producto sin nombre",
              categoria: productData?.categoriaNombre || "Sin categoría",
              precio: productData?.precio || 0,
              pasajeros: productData?.pasajeros || 0,
              ubicacion: productData?.ubicacion || "Ubicación no disponible",
              imagen,
              caracteristicas,
              addedAt: favorite.fechaCreacion || new Date().toISOString(),
            };
          } catch (productError) {
            console.error(
              `❌ Error al obtener datos del producto ${favorite.productoId}:`,
              productError
            );
            return {
              id: favorite.productoId,
              favoriteId: favorite.id,
              nombre: `Producto ${favorite.productoId}`,
              categoria: "Sin categoría",
              precio: 0,
              pasajeros: 0,
              ubicacion: "N/A",
              imagen: "/placeholder-car.jpg",
              caracteristicas: [],
              addedAt: favorite.fechaCreacion || new Date().toISOString(),
            };
          }
        })
      );

      setFavorites(enrichedFavorites);
    } catch (error) {
      console.error("❌ Error al cargar favoritos:", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserFavorites();
  }, [user, isAuthenticated]);

  // ➕ Agregar producto a favoritos
  const addToFavorites = async (product) => {
    if (!isAuthenticated || !user?.id) {
      throw new Error("Debes iniciar sesión para agregar favoritos");
    }

    setIsLoading(true);

    try {
      const already = favorites.find((fav) => fav.id === product.id);
      if (already) {
        throw new Error("Este vehículo ya está en tus favoritos");
      }

      await favoriteService.addFavorite(user.id, product.id);
      await loadUserFavorites();
      return { success: true };
    } catch (error) {
      console.error("❌ Error al agregar favorito:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // ➖ Quitar producto de favoritos
  const removeFromFavorites = async (productId) => {
    if (!isAuthenticated || !user?.id) {
      throw new Error("Debes iniciar sesión para gestionar favoritos");
    }

    setIsLoading(true);

    try {
      const favorite = favorites.find((fav) => fav.id === productId);
      if (!favorite) {
        throw new Error("Este producto no está en favoritos");
      }

      await favoriteService.removeFavorite(favorite.favoriteId);
      await loadUserFavorites();
      return { success: true };
    } catch (error) {
      console.error("❌ Error al eliminar favorito:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // 🔁 Alternar favorito
  const toggleFavorite = async (product) => {
    const exists = favorites.find((fav) => fav.id === product.id);
    if (exists) {
      return await removeFromFavorites(product.id);
    } else {
      return await addToFavorites(product);
    }
  };

  // ✅ Verificar si un producto es favorito
  const isFavorite = (productId) =>
    favorites.some((fav) => fav.id === productId);

  // 📋 Obtener favoritos
  const getFavorites = () =>
    favorites.sort(
      (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
    );

  // 🧹 Limpiar todos los favoritos
  const clearFavorites = async () => {
    if (!isAuthenticated || !user?.id) {
      throw new Error("Debes iniciar sesión para gestionar favoritos");
    }

    setIsLoading(true);
    try {
      const deletePromises = favorites.map((fav) =>
        favoriteService.removeFavorite(fav.favoriteId)
      );
      await Promise.all(deletePromises);
      await loadUserFavorites();
      return { success: true };
    } catch (error) {
      console.error("❌ Error al limpiar favoritos:", error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
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
    loadUserFavorites,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
