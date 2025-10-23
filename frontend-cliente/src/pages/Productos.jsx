import { useSearchParams, Link } from "react-router-dom";
import { Calendar, MapPin, Car, Users, Filter, X, Settings, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { FavoriteButton } from "../components";
import { ProductListSkeleton } from "../components/LoadingSkeletons";
import ProductoCaracteristicas from "../components/ProductoCaracteristicas";
import { useDebouncedValue } from "../utils/optimizationUtils";
import productService from "../services/productService";
import categoryService from "../services/categoryService";

export default function Productos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categorias, setCategorias] = useState([]);
  
  // Extraer parámetros de búsqueda
  const location = searchParams.get("location");
  const vehicleType = searchParams.get("vehicleType");
  const passengers = parseInt(searchParams.get("passengers")) || 0;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const categoria = searchParams.get("categoria"); // Para compatibilidad con navegación por categorías

  // Cargar datos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 📂 Cargar categorías primero (siempre necesario)
        const categoriasData = await categoryService.getAllCategories();
        setCategorias(categoriasData);
        
        let productosData = [];
        
        // 🎯 Si hay filtro por categoría, usar endpoint específico
        if (categoria) {
          console.log('🔍 Filtrando por categoría:', categoria);
          // Si categoria es un número (ID), usarlo directamente
          const categoriaId = Number(categoria);
          if (!isNaN(categoriaId)) {
            productosData = await productService.getProductsByCategory(categoriaId);
            console.log('✅ Productos de categoría cargados:', productosData);
          } else {
            // Buscar el ID de la categoría por nombre (compatibilidad)
            const categoriaObj = categoriasData.find(c => 
              c.nombre.toLowerCase() === categoria.toLowerCase()
            );
            if (categoriaObj) {
              productosData = await productService.getProductsByCategory(categoriaObj.id);
              console.log('✅ Productos de categoría cargados:', productosData);
            } else {
              console.warn('❌ Categoría no encontrada:', categoria);
              productosData = [];
            }
          }
        } else {
          // 📋 Si no hay filtro por categoría, cargar todos los productos
          console.log('📋 Cargando todos los productos...');
          productosData = await productService.getAllProducts();
        }
        
        // 🖼️ Cargar imágenes para cada producto
        console.log('🖼️ Cargando imágenes para productos...');
        const productosConImagenes = await Promise.all(
          productosData.map(async (producto) => {
            try {
              const imagenes = await productService.getProductImages(producto.id);
              return {
                ...producto,
                imagenes: imagenes || []
              };
            } catch (error) {
              console.error(`Error al cargar imágenes del producto ${producto.id}:`, error);
              return {
                ...producto,
                imagenes: []
              };
            }
          })
        );

        setProductos(productosConImagenes);
        
        // Debug: mostrar estructura de datos
        console.log('🚗 Productos cargados con imágenes:', productosConImagenes);
        console.log('🚗 Primer producto estructura:', productosConImagenes[0]);
        console.log('�️ Imágenes del primer producto:', productosConImagenes[0]?.imagenes);
        console.log('📂 Categorías disponibles:', categoriasData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error al cargar los productos. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoria]); // 🔄 Recargar cuando cambie el filtro de categoría

  // Aplicar filtros
  let productosFiltrados = productos;

  console.log('🔍 Parámetros de filtrado recibidos:');
  console.log('  - categoria:', categoria);
  console.log('  - vehicleType:', vehicleType);
  console.log('  - location:', location);
  console.log('  - passengers:', passengers);

  // 📝 NOTA: Si hay filtro por categoría, los productos ya vienen filtrados del backend
  // Solo aplicamos filtros adicionales (ubicación, pasajeros, etc.)

  if (location) {
    productosFiltrados = productosFiltrados.filter(p => 
      p.ciudad?.toLowerCase().includes(location.toLowerCase()) ||
      p.ubicacion?.toLowerCase().includes(location.toLowerCase())
    );
    console.log('🏙️ Después de filtrar por ubicación:', productosFiltrados.length);
  }

  if (vehicleType) {
    console.log('🚗 Filtrando por vehicleType:', vehicleType);
    console.log('🚗 Productos antes del filtro:', productosFiltrados.length);
    productosFiltrados = productosFiltrados.filter(p => {
      const categoriaComparar = p.categoria?.nombre?.toLowerCase() || p.categoria?.toLowerCase();
      console.log(`  - Producto "${p.nombre}" tiene categoría: "${categoriaComparar}" vs "${vehicleType.toLowerCase()}"`);
      return categoriaComparar === vehicleType.toLowerCase();
    });
    console.log('🚗 Después de filtrar por vehicleType:', productosFiltrados.length);
  }

  // 📂 No filtrar por categoría aquí si ya se filtró en el backend
  if (categoria) {
    console.log('📂 ✅ Productos ya filtrados por categoría en backend');
  }

  if (passengers > 0) {
    productosFiltrados = productosFiltrados.filter(p => 
      (p.pasajeros || p.capacidadPasajeros) >= passengers
    );
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

      {/* Manejo de errores */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
          <p className="text-red-800">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

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
              <div className="h-48 w-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {producto.imagenes?.[0]?.url || producto.imagen ? (
                  <img
                    src={producto.imagenes[0].url || producto.imagen}
                    alt={producto.nombre}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onLoad={() => {
                      console.log(`✅ Backend imagen producto OK: ${producto.nombre}`);
                    }}
                    onError={(e) => {
                      console.error(`❌ BACKEND FALLO - Imagen producto: ${producto.nombre}`);
                      e.target.style.backgroundColor = '#fee2e2';
                      e.target.style.border = '2px solid #dc2626';
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-500 border-2 border-gray-300">
                    <div className="text-center">
                      <p className="text-2xl">📷</p>
                      <p className="text-xs">Sin imagen</p>
                      <p className="text-xs">en backend</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {producto.nombre}
                </h3>
                <p className="text-sm text-gray-500 capitalize mb-3">
                  {producto.categoriaNombre || producto.categoria || 'Sin categoría'}
                </p>
                
                {/* Características reales del Backend */}
                <ProductoCaracteristicas productoId={producto.id} />
                
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">
                    ${producto.precio || producto.precioBase || 0}/día
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
