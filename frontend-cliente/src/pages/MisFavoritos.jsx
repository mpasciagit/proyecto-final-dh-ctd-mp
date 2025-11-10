import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";
import { useAuth } from "../context/AuthContext";
import FavoriteButton from "../components/FavoriteButton";
import ProductoCaracteristicas from "../components/ProductoCaracteristicas";

const MisFavoritos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getFavorites, clearFavorites, isLoading } = useFavorites();

  const favorites = getFavorites();

  const handleClearAll = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar todos tus favoritos?")) {
      try {
        await clearFavorites();
      } catch (error) {
        console.error("Error clearing favorites:", error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
  {/* Encabezado */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mis Favoritos</h1>
                {user && (
                  <p className="text-gray-600">
                    Elige uno de tus favoritos para reservar
                  </p>
                )}
              </div>
            </div>

            {favorites.length > 0 && (
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

  {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {favorites.length === 0 ? (
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
                to="/categorias"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Explorar Vehículos
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-shadow flex flex-col cursor-pointer"
                onClick={() => navigate(`/producto/${product.id}?modo=exploracion`)}
              >
                {/* Imagen */}
                <div className="relative h-48">
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-car.jpg";
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <FavoriteButton product={product} variant="solid" size="default" />
                  </div>
                </div>

                {/* Info del producto */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-slate-900 line-clamp-1">
                    {product.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2 capitalize">
                    {product.categoria}
                  </p>

                  {/* Características dinámicas */}
                  <ProductoCaracteristicas productoId={product.id} layout="list" maxItems={3} />

                  {/* Precio + botón */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-lg font-bold text-red-600">
                        ${product.precio.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">por día</p>
                    </div>
                  </div>

                  {/* Fecha agregado */}
                  <p className="text-xs text-gray-400 mt-3">
                    Agregado el {formatDate(product.addedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisFavoritos;
