import { Link } from 'react-router-dom';
import { Star, Users, Fuel, Settings, MapPin, Calendar } from 'lucide-react';
import { memo } from 'react';
import { FavoriteButton } from './index';
import { ProductImage } from './LazyImage';
import { comparators } from '../utils/optimizationUtils';

const ProductCard = memo(({ product, showAvailability = true }) => {
  const {
    id,
    nombre,
    marca,
    categoria,
    precio,
    pasajeros,
    ubicacion,
    imagen,
    disponible,
    transmision,
    combustible,
    rating,
    reviews,
    caracteristicas = [],
    año
  } = product;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  const getCombustibleIcon = (tipo) => {
    switch (tipo) {
      case 'electrico':
        return '⚡';
      case 'hibrido':
        return '🔋';
      case 'diesel':
        return '⛽';
      default:
        return '⛽';
    }
  };

  const getTransmisionText = (transmision) => {
    return transmision === 'automatica' ? 'Automática' : 'Manual';
  };

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group relative">
      {/* Imagen optimizada con lazy loading */}
      <Link to={`/producto/${id}`} className="block relative">
        <ProductImage 
          product={product}
          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
          showBadge={showAvailability}
        />
        
        {/* Etiquetas de estado adicionales */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {año >= 2024 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Nuevo {año}
            </span>
          )}
        </div>

        {/* Botón de favoritos */}
        <div className="absolute top-3 right-3 z-10">
          <FavoriteButton 
            product={product}
            variant="solid"
            size="default"
          />
        </div>
        {!disponible && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <span className="text-white font-semibold">No disponible</span>
          </div>
        )}
      </Link>

      {/* Contenido de la tarjeta */}
      <div className="p-4">
        {/* Header con marca y nombre */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-blue-600">{marca}</span>
            <span className="text-xs text-gray-500 capitalize">{categoria}</span>
          </div>
          <Link 
            to={`/producto/${id}`}
            className="block"
          >
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {nombre}
            </h3>
          </Link>
        </div>

        {/* Rating y reviews */}
        {rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {renderStars(rating)}
            </div>
            <span className="text-sm text-gray-600">
              {rating} ({reviews} reseñas)
            </span>
          </div>
        )}

        {/* Características principales */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{pasajeros} pasajeros</span>
          </div>
          <div className="flex items-center gap-1">
            <Settings className="w-4 h-4" />
            <span>{getTransmisionText(transmision)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-base">{getCombustibleIcon(combustible)}</span>
            <span className="capitalize">{combustible}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{ubicacion}</span>
          </div>
        </div>

        {/* Características destacadas */}
        {caracteristicas.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {caracteristicas.slice(0, 3).map((caracteristica, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                >
                  {caracteristica}
                </span>
              ))}
              {caracteristicas.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                  +{caracteristicas.length - 3} más
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer con precio y acción */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              ${precio.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 ml-1">por día</span>
          </div>
          
          <div className="flex gap-2">
            <Link
              to={`/producto/${id}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Ver detalles
            </Link>
            {disponible && showAvailability && (
              <Link
                to={`/reservar/${id}`}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reservar
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}, comparators.product);

export default ProductCard;