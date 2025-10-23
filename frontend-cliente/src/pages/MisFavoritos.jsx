import { Link } from 'react-router-dom';
import { Heart, Trash2, Search, Car, Users, MapPin, ShoppingCart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import FavoriteButton from '../components/FavoriteButton';

const MisFavoritos = () => {
  const { user } = useAuth();
  const { getFavorites, getFavoritesStats, clearFavorites, isLoading } = useFavorites();
  
  const favorites = getFavorites();
  const stats = getFavoritesStats();

  const handleClearAll = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar todos tus favoritos?')) {
      try {
        await clearFavorites();
      } catch (error) {
        console.error('Error clearing favorites:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Favoritos</h1>
                <p className="text-gray-600">
                  Hola {user?.nombre}, aquí tienes tus vehículos favoritos
                </p>
              </div>
            </div>
            
            {!stats.isEmpty && (
              <button
                onClick={handleClearAll}
                disabled={isLoading}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar todos
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        {!stats.isEmpty && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-500 fill-current" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Favoritos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Car className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categoría Favorita</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {stats.mostFavoritedCategory || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Search className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Categorías</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {Object.keys(stats.categories).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Favoritos */}
        {stats.isEmpty ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No tienes favoritos aún
            </h3>
            <p className="mt-2 text-gray-500">
              Explora nuestros vehículos y agrega los que más te gusten
            </p>
            <div className="mt-6">
              <Link
                to="/productos"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                <Search className="h-5 w-5 mr-2" />
                Explorar Vehículos
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Imagen del vehículo */}
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/400/300';
                    }}
                  />
                  
                  {/* Botón de favorito superpuesto */}
                  <div className="absolute top-3 right-3">
                    <FavoriteButton 
                      product={product}
                      variant="solid"
                      size="default"
                    />
                  </div>
                  
                  {/* Badge de categoría */}
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-800 capitalize">
                      {product.categoria}
                    </span>
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {product.nombre}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize mt-1">
                        {product.categoria}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">
                        ${product.precio.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">por día</p>
                    </div>
                  </div>

                  {/* Detalles del vehículo */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {product.pasajeros} pasajeros
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {product.ubicacion}
                    </div>
                  </div>

                  {/* Fecha agregado */}
                  <div className="text-xs text-gray-500 mb-4">
                    Agregado el {formatDate(product.addedAt)}
                  </div>

                  {/* Acciones */}
                  <div className="flex space-x-3">
                    <Link
                      to={`/productos/${product.id}`}
                      className="flex-1 bg-red-600 text-white text-center py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                    >
                      Ver Detalles
                    </Link>
                    <Link
                      to={`/reservar/${product.id}`}
                      className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                      title="Reservar ahora"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sección de acciones adicionales */}
        {!stats.isEmpty && (
          <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                ¿No encuentras lo que buscas?
              </h3>
              <p className="text-gray-600 mb-6">
                Explora más vehículos o busca por categoría específica
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/productos"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Ver Todos los Vehículos
                </Link>
                <Link
                  to="/categorias"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                >
                  <Car className="h-5 w-5 mr-2" />
                  Explorar por Categorías
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MisFavoritos;