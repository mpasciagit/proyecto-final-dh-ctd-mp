import { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useFavoriteNotifications } from '../hooks/useFavoriteNotifications';

const FavoriteButton = ({ 
  product, 
  size = 'default',
  variant = 'ghost',
  showText = false,
  className = '' 
}) => {
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite, isLoading } = useFavorites();
  const { notifyAdded, notifyRemoved, notifyError } = useFavoriteNotifications();
  const [actionLoading, setActionLoading] = useState(false);

  const isProductFavorite = isFavorite(product.id);

  // Tamaños del botón
  const sizes = {
    sm: 'p-1.5',
    default: 'p-2',
    lg: 'p-3'
  };

  // Tamaños del icono
  const iconSizes = {
    sm: 16,
    default: 20,
    lg: 24
  };

  // Variantes del botón
  const variants = {
    ghost: `hover:bg-gray-100 ${isProductFavorite ? 'text-red-500' : 'text-gray-400'}`,
    solid: `${isProductFavorite 
      ? 'bg-red-500 text-white hover:bg-red-600' 
      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
    }`,
    outline: `border-2 ${isProductFavorite 
      ? 'border-red-500 text-red-500 hover:bg-red-50' 
      : 'border-gray-300 text-gray-600 hover:border-gray-400'
    }`
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      notifyError('Debes iniciar sesión para agregar favoritos');
      return;
    }

    setActionLoading(true);
    const wasFavorite = isFavorite(product.id);

    try {
      const result = await toggleFavorite(product);
      
      if (result.success) {
        // Mostrar notificación según la acción
        if (wasFavorite) {
          notifyRemoved(product.nombre);
        } else {
          notifyAdded(product.nombre);
        }
      } else {
        notifyError(result.error);
      }
    } catch (error) {
      notifyError(error.message || 'Error al gestionar favorito');
    } finally {
      setActionLoading(false);
    }
  };

  const buttonClasses = `
    relative inline-flex items-center justify-center
    transition-all duration-200 ease-in-out
    rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizes[size]}
    ${variants[variant]}
    ${className}
  `.trim();

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={actionLoading || isLoading}
      className={buttonClasses}
      aria-label={isProductFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      title={
        !isAuthenticated 
          ? 'Inicia sesión para agregar favoritos'
          : isProductFavorite 
            ? 'Quitar de favoritos' 
            : 'Agregar a favoritos'
      }
    >
      {actionLoading || isLoading ? (
        <Loader2 
          size={iconSizes[size]} 
          className="animate-spin text-current" 
        />
      ) : (
        <Heart
          size={iconSizes[size]}
          className={`transition-all duration-200 ${
            isProductFavorite 
              ? 'fill-current scale-110' 
              : 'hover:scale-110'
          }`}
        />
      )}
      
      {showText && (
        <span className="ml-2 text-sm">
          {isProductFavorite ? 'En favoritos' : 'Favorito'}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;