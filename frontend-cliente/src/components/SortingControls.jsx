import { ChevronDown } from 'lucide-react';

const SortingControls = ({ sortBy, sortOrder, onSortChange, resultCount, currentPage, totalPages, onPageChange }) => {
  const sortOptions = [
    { value: 'precio-asc', label: 'Precio: menor a mayor' },
    { value: 'precio-desc', label: 'Precio: mayor a menor' },
    { value: 'rating-desc', label: 'Mejor valorados' },
    { value: 'rating-asc', label: 'Menor valoración' },
    { value: 'nombre-asc', label: 'Nombre: A-Z' },
    { value: 'nombre-desc', label: 'Nombre: Z-A' },
    { value: 'pasajeros-desc', label: 'Más pasajeros' },
    { value: 'pasajeros-asc', label: 'Menos pasajeros' },
    { value: 'año-desc', label: 'Más recientes' },
    { value: 'año-asc', label: 'Más antiguos' }
  ];

  const currentSortValue = `${sortBy}-${sortOrder}`;
  const currentSortLabel = sortOptions.find(option => option.value === currentSortValue)?.label || 'Ordenar por';

  const handleSortChange = (value) => {
    const [field, order] = value.split('-');
    onSortChange(field, order);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Información de resultados */}
      <div className="text-sm text-gray-600">
        Mostrando <span className="font-medium">{resultCount}</span> vehículo{resultCount !== 1 ? 's' : ''}
        {totalPages > 1 && (
          <>
            {' '}• Página <span className="font-medium">{currentPage}</span> de <span className="font-medium">{totalPages}</span>
          </>
        )}
      </div>

      {/* Controles de ordenamiento */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <select
            value={currentSortValue}
            onChange={(e) => handleSortChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Paginación simple */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-3 py-1 text-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortingControls;