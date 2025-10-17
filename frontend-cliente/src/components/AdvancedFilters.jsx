import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, SlidersHorizontal, Star } from 'lucide-react';
import { marcas, categorias, ubicaciones, transmisiones, combustibles, precioRango, pasajerosRango } from '../utils/productData';

const AdvancedFilters = ({ filters, onFiltersChange, onClearFilters, resultCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Contar filtros activos
  useEffect(() => {
    let count = 0;
    if (filters.marca?.length > 0) count++;
    if (filters.categoria?.length > 0) count++;
    if (filters.ubicacion?.length > 0) count++;
    if (filters.transmision?.length > 0) count++;
    if (filters.combustible?.length > 0) count++;
    if (filters.precioMin !== precioRango.min || filters.precioMax !== precioRango.max) count++;
    if (filters.pasajerosMin !== pasajerosRango.min || filters.pasajerosMax !== pasajerosRango.max) count++;
    if (filters.rating > 0) count++;
    if (filters.caracteristicas?.length > 0) count++;
    if (filters.soloDisponibles) count++;
    
    setActiveFilters(count);
  }, [filters]);

  const handleCheckboxChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [filterType]: newValues
    });
  };

  const handleRangeChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: parseInt(value)
    });
  };

  const handleBooleanChange = (filterType, value) => {
    onFiltersChange({
      ...filters,
      [filterType]: value
    });
  };

  const caracteristicasDisponibles = [
    'Aire acondicionado',
    'GPS',
    'Bluetooth',
    'USB',
    'Cámara trasera',
    'Asientos de cuero',
    '4x4',
    'Techo solar',
    'Control crucero'
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      {/* Header del filtro */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Filtros avanzados</h3>
          {activeFilters > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {activeFilters} {activeFilters === 1 ? 'filtro' : 'filtros'} activo{activeFilters === 1 ? '' : 's'}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {activeFilters > 0 && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
              Limpiar
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            {isExpanded ? 'Ocultar' : 'Mostrar'}
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Contenido de filtros */}
      {isExpanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* Filtro por Precio */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Precio por día</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>${filters.precioMin}</span>
                  <span>${filters.precioMax}</span>
                </div>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={precioRango.min}
                    max={precioRango.max}
                    value={filters.precioMin}
                    onChange={(e) => handleRangeChange('precioMin', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <input
                    type="range"
                    min={precioRango.min}
                    max={precioRango.max}
                    value={filters.precioMax}
                    onChange={(e) => handleRangeChange('precioMax', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>
            </div>

            {/* Filtro por Marca */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Marca</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {marcas.map(marca => (
                  <label key={marca} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.marca?.includes(marca) || false}
                      onChange={() => handleCheckboxChange('marca', marca)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{marca}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Categoría */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Categoría</h4>
              <div className="space-y-2">
                {categorias.map(categoria => (
                  <label key={categoria} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.categoria?.includes(categoria) || false}
                      onChange={() => handleCheckboxChange('categoria', categoria)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{categoria}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Ubicación */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Ubicación</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {ubicaciones.map(ubicacion => (
                  <label key={ubicacion} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.ubicacion?.includes(ubicacion) || false}
                      onChange={() => handleCheckboxChange('ubicacion', ubicacion)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{ubicacion}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Transmisión */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Transmisión</h4>
              <div className="space-y-2">
                {transmisiones.map(transmision => (
                  <label key={transmision} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.transmision?.includes(transmision) || false}
                      onChange={() => handleCheckboxChange('transmision', transmision)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{transmision}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Combustible */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Combustible</h4>
              <div className="space-y-2">
                {combustibles.map(combustible => (
                  <label key={combustible} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.combustible?.includes(combustible) || false}
                      onChange={() => handleCheckboxChange('combustible', combustible)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">{combustible}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Pasajeros */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Pasajeros</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{filters.pasajerosMin}</span>
                  <span>{filters.pasajerosMax}</span>
                </div>
                <input
                  type="range"
                  min={pasajerosRango.min}
                  max={pasajerosRango.max}
                  value={filters.pasajerosMin}
                  onChange={(e) => handleRangeChange('pasajerosMin', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="range"
                  min={pasajerosRango.min}
                  max={pasajerosRango.max}
                  value={filters.pasajerosMax}
                  onChange={(e) => handleRangeChange('pasajerosMax', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Filtro por Rating */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Valoración mínima</h4>
              <div className="space-y-2">
                {[4.5, 4.0, 3.5, 3.0].map(rating => (
                  <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() => handleRangeChange('rating', rating)}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-700">{rating}+</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtro por Características */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Características</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {caracteristicasDisponibles.map(caracteristica => (
                  <label key={caracteristica} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.caracteristicas?.includes(caracteristica) || false}
                      onChange={() => handleCheckboxChange('caracteristicas', caracteristica)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{caracteristica}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filtros adicionales */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Opciones</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.soloDisponibles || false}
                    onChange={(e) => handleBooleanChange('soloDisponibles', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Solo disponibles</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.conGPS || false}
                    onChange={(e) => handleBooleanChange('conGPS', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Con GPS</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.aireAcondicionado || false}
                    onChange={(e) => handleBooleanChange('aireAcondicionado', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Aire acondicionado</span>
                </label>
              </div>
            </div>
          </div>

          {/* Footer con resumen */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {resultCount} vehículo{resultCount !== 1 ? 's' : ''} encontrado{resultCount !== 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={onClearFilters}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpiar filtros
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;