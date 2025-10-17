import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { productos, precioRango, pasajerosRango } from "../utils/productData";
import { AdvancedFilters, SortingControls, ProductCard } from "../components";

const ITEMS_PER_PAGE = 9;

const Productos = () => {
  const [searchParams] = useSearchParams();
  
  // Estados para filtros
  const [filters, setFilters] = useState({
    marca: [],
    categoria: [],
    ubicacion: [],
    transmision: [],
    combustible: [],
    precioMin: precioRango.min,
    precioMax: precioRango.max,
    pasajerosMin: pasajerosRango.min,
    pasajerosMax: pasajerosRango.max,
    rating: 0,
    caracteristicas: [],
    soloDisponibles: false,
    conGPS: false,
    aireAcondicionado: false
  });

  // Estados para ordenamiento y paginación
  const [sortBy, setSortBy] = useState('precio');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Inicializar filtros desde URL
  useEffect(() => {
    const categoria = searchParams.get('categoria');
    const ubicacion = searchParams.get('ubicacion');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (categoria || ubicacion || startDate || endDate) {
      setFilters(prev => ({
        ...prev,
        categoria: categoria ? [categoria] : [],
        ubicacion: ubicacion ? [ubicacion] : [],
        // Aquí podrías agregar lógica de fechas si necesitas filtrar por disponibilidad
      }));
    }
  }, [searchParams]);

  // Función para aplicar filtros
  const filteredProducts = useMemo(() => {
    return productos.filter(product => {
      // Filtro por marca
      if (filters.marca.length > 0 && !filters.marca.includes(product.marca)) {
        return false;
      }

      // Filtro por categoría
      if (filters.categoria.length > 0 && !filters.categoria.includes(product.categoria)) {
        return false;
      }

      // Filtro por ubicación
      if (filters.ubicacion.length > 0 && !filters.ubicacion.includes(product.ubicacion)) {
        return false;
      }

      // Filtro por transmisión
      if (filters.transmision.length > 0 && !filters.transmision.includes(product.transmision)) {
        return false;
      }

      // Filtro por combustible
      if (filters.combustible.length > 0 && !filters.combustible.includes(product.combustible)) {
        return false;
      }

      // Filtro por precio
      if (product.precio < filters.precioMin || product.precio > filters.precioMax) {
        return false;
      }

      // Filtro por pasajeros
      if (product.pasajeros < filters.pasajerosMin || product.pasajeros > filters.pasajerosMax) {
        return false;
      }

      // Filtro por rating
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }

      // Filtro por características
      if (filters.caracteristicas.length > 0) {
        const hasRequiredFeatures = filters.caracteristicas.every(feature => 
          product.caracteristicas?.includes(feature)
        );
        if (!hasRequiredFeatures) {
          return false;
        }
      }

      // Filtro solo disponibles
      if (filters.soloDisponibles && !product.disponible) {
        return false;
      }

      // Filtro con GPS
      if (filters.conGPS && !product.gps) {
        return false;
      }

      // Filtro aire acondicionado
      if (filters.aireAcondicionado && !product.aireAcondicionado) {
        return false;
      }

      return true;
    });
  }, [filters]);

  // Función para ordenar productos
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    
    sorted.sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'precio':
          valueA = a.precio;
          valueB = b.precio;
          break;
        case 'rating':
          valueA = a.rating || 0;
          valueB = b.rating || 0;
          break;
        case 'nombre':
          valueA = a.nombre.toLowerCase();
          valueB = b.nombre.toLowerCase();
          break;
        case 'pasajeros':
          valueA = a.pasajeros;
          valueB = b.pasajeros;
          break;
        case 'año':
          valueA = a.año;
          valueB = b.año;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });

    return sorted;
  }, [filteredProducts, sortBy, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, sortOrder]);

  // Funciones de manejo
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      marca: [],
      categoria: [],
      ubicacion: [],
      transmision: [],
      combustible: [],
      precioMin: precioRango.min,
      precioMax: precioRango.max,
      pasajerosMin: pasajerosRango.min,
      pasajerosMax: pasajerosRango.max,
      rating: 0,
      caracteristicas: [],
      soloDisponibles: false,
      conGPS: false,
      aireAcondicionado: false
    });
  };

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Nuestros Vehículos
        </h1>
        <p className="text-gray-600">
          Encuentra el vehículo perfecto para tu próximo viaje. Usa nuestros filtros avanzados para refinar tu búsqueda.
        </p>
      </div>

      {/* Filtros avanzados */}
      <AdvancedFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        resultCount={sortedProducts.length}
      />

      {/* Controles de ordenamiento */}
      <SortingControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        resultCount={sortedProducts.length}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Grid de productos */}
      {currentProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {currentProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product}
              showAvailability={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
              🚗
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron vehículos
            </h3>
            <p className="text-gray-500 mb-6">
              No hay vehículos que coincidan con los filtros seleccionados. 
              Intenta ajustar tus criterios de búsqueda.
            </p>
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Paginación inferior (para móviles) */}
      {totalPages > 1 && currentProducts.length > 0 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Primera
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            {/* Números de página */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (pageNum > totalPages) return null;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-2 text-sm border rounded-md ${
                    currentPage === pageNum
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Última
            </button>
          </nav>
        </div>
      )}
    </section>
  );
};

export default Productos;