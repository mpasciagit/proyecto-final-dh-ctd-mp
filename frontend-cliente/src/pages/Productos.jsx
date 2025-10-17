import { useSearchParams, Link } from "react-router-dom";
import { Calendar, MapPin, Car, Users, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";
import { FavoriteButton } from "../components";
import { ProductListSkeleton } from "../components/LoadingSkeletons";
import { useDebouncedValue } from "../utils/optimizationUtils";

// Mock de productos expandido con más detalles
const productos = [
  { 
    id: 1, 
    nombre: "Toyota Corolla", 
    categoria: "sedan", 
    precio: 45, 
    pasajeros: 5, 
    ubicacion: "Buenos Aires",
    imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400",
    disponible: true 
  },
  { 
    id: 2, 
    nombre: "Honda Civic", 
    categoria: "sedan", 
    precio: 50, 
    pasajeros: 5, 
    ubicacion: "Córdoba",
    imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400",
    disponible: true 
  },
  { 
    id: 3, 
    nombre: "Toyota Camry", 
    categoria: "sedan", 
    precio: 65, 
    pasajeros: 5, 
    ubicacion: "Buenos Aires",
    imagen: "https://images.unsplash.com/photo-1616788874313-95c6de7d91d4?q=80&w=400",
    disponible: true 
  },
  { 
    id: 4, 
    nombre: "Honda Accord", 
    categoria: "sedan", 
    precio: 70, 
    pasajeros: 5, 
    ubicacion: "Rosario",
    imagen: "https://images.unsplash.com/photo-1616788874313-95c6de7d91d4?q=80&w=400",
    disponible: true 
  },
  { 
    id: 5, 
    nombre: "Toyota RAV4", 
    categoria: "suv", 
    precio: 80, 
    pasajeros: 7, 
    ubicacion: "Buenos Aires",
    imagen: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400",
    disponible: true 
  },
  { 
    id: 6, 
    nombre: "Ford Explorer", 
    categoria: "suv", 
    precio: 90, 
    pasajeros: 8, 
    ubicacion: "Mendoza",
    imagen: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400",
    disponible: true 
  },
  { 
    id: 7, 
    nombre: "Ford F-150", 
    categoria: "pickup", 
    precio: 95, 
    pasajeros: 5, 
    ubicacion: "Salta",
    imagen: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=400",
    disponible: true 
  },
  { 
    id: 8, 
    nombre: "Volkswagen Gol", 
    categoria: "hatchback", 
    precio: 35, 
    pasajeros: 5, 
    ubicacion: "La Plata",
    imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400",
    disponible: true 
  },
  { 
    id: 9, 
    nombre: "BMW Z4", 
    categoria: "convertible", 
    precio: 150, 
    pasajeros: 2, 
    ubicacion: "Mar del Plata",
    imagen: "https://images.unsplash.com/photo-1603384696015-871af6a62b49?q=80&w=400",
    disponible: true 
  },
  { 
    id: 10, 
    nombre: "Mercedes-Benz C-Class", 
    categoria: "coupe", 
    precio: 120, 
    pasajeros: 4, 
    ubicacion: "Bariloche",
    imagen: "https://images.unsplash.com/photo-1603384696015-871af6a62b49?q=80&w=400",
    disponible: true 
  }
];

export default function Productos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  
  // Extraer parámetros de búsqueda
  const location = searchParams.get("location");
  const vehicleType = searchParams.get("vehicleType");
  const passengers = parseInt(searchParams.get("passengers")) || 0;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const categoria = searchParams.get("categoria"); // Para compatibilidad con navegación por categorías

  // Simular carga de datos
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [location, vehicleType, passengers, startDate, endDate, categoria]);

  // Aplicar filtros
  let productosFiltrados = productos;

  if (location) {
    productosFiltrados = productosFiltrados.filter(p => p.ubicacion === location);
  }

  if (vehicleType) {
    productosFiltrados = productosFiltrados.filter(p => p.categoria === vehicleType);
  }

  if (categoria) {
    productosFiltrados = productosFiltrados.filter(p => p.categoria === categoria);
  }

  if (passengers > 0) {
    productosFiltrados = productosFiltrados.filter(p => p.pasajeros >= passengers);
  }

  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchParams({});
  };

  // Función para obtener el nombre legible del tipo de vehículo
  const getVehicleTypeName = (type) => {
    const types = {
      'sedan': 'Sedán',
      'suv': 'SUV',
      'pickup': 'Pick-up',
      'hatchback': 'Hatchback',
      'coupe': 'Coupé',
      'convertible': 'Convertible'
    };
    return types[type] || type;
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = location || vehicleType || categoria || passengers > 0 || startDate || endDate;

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      
      {/* Header con título y filtros activos */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
          Vehículos Disponibles
        </h2>
        
        {/* Mostrar filtros activos */}
        {hasActiveFilters && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <Filter className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Filtros aplicados:</span>
              
              {location && (
                <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full text-sm">
                  <MapPin className="w-3 h-3" />
                  {location}
                </div>
              )}
              
              {(vehicleType || categoria) && (
                <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full text-sm">
                  <Car className="w-3 h-3" />
                  {getVehicleTypeName(vehicleType || categoria)}
                </div>
              )}
              
              {passengers > 0 && (
                <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full text-sm">
                  <Users className="w-3 h-3" />
                  {passengers}+ pasajeros
                </div>
              )}
              
              {startDate && endDate && (
                <div className="flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full text-sm">
                  <Calendar className="w-3 h-3" />
                  {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                </div>
              )}
            </div>
            
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Limpiar filtros
            </button>
          </div>
        )}

        {/* Contador de resultados */}
        {!loading && (
          <p className="text-center text-gray-600 mb-6">
            {productosFiltrados.length === 0 
              ? "No se encontraron vehículos que coincidan con tu búsqueda"
              : `Mostrando ${productosFiltrados.length} ${productosFiltrados.length === 1 ? 'vehículo' : 'vehículos'}`
            }
          </p>
        )}
      </div>

      {/* Grid de productos */}
      {loading ? (
        <ProductListSkeleton count={8} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productosFiltrados.map((producto) => (
          <div
            key={producto.id}
            className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow group relative"
          >
            {/* Botón de favoritos superpuesto */}
            <div className="absolute top-3 right-3 z-10">
              <FavoriteButton 
                product={producto}
                variant="solid"
                size="default"
              />
            </div>
            
            {/* Link que envuelve la imagen y contenido principal */}
            <Link to={`/producto/${producto.id}`} className="block">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src = '/api/placeholder/400/300';
                }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {producto.nombre}
                </h3>
                
                {/* Información del vehículo */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Car className="w-4 h-4" />
                    {getVehicleTypeName(producto.categoria)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4" />
                    {producto.pasajeros} pasajeros
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    {producto.ubicacion}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">
                    ${producto.precio}/día
                  </span>
                  <span className="text-sm text-blue-600 group-hover:underline">
                    Ver detalles →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
        </div>
      )}

      {!loading && productosFiltrados.length === 0 && (
        <p className="text-center text-slate-600 mt-8">
          No se encontraron vehículos para esta categoría.
        </p>
      )}
    </section>
  );
}
