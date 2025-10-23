import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es';
registerLocale('es', es);
import { Calendar, MapPin, Search, Users, Car } from 'lucide-react';
import { categoryService } from '../services/categoryService';

const SearchSection = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: '',
    startDate: null,
    endDate: null,
    vehicleType: '',
    passengers: 1
  });

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚀 Cargar categorías del backend
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasData = await categoryService.getAllCategories();
        setCategorias(categoriasData);
        console.log('✅ Categorías cargadas desde backend:', categoriasData);
      } catch (error) {
        console.error('❌ Error al cargar categorías:', error);
        console.log('🟡 SEARCHSECTION - USANDO FALLBACK - DATOS MOCKADOS (NO BACKEND)');
        // Fallback a categorías por defecto si falla el backend
        setCategorias([
          { id: 1, nombre: 'Económico [MOCK]' },
          { id: 2, nombre: 'SUV [MOCK]' },
          { id: 3, nombre: 'Lujo [MOCK]' },
          { id: 4, nombre: 'Pickup [MOCK]' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!searchData.startDate || !searchData.endDate) {
      alert('Por favor selecciona las fechas de retiro y devolución');
      return;
    }
    
    if (searchData.startDate >= searchData.endDate) {
      alert('La fecha de devolución debe ser posterior a la fecha de retiro');
      return;
    }

    // Construir query params para la búsqueda
    const params = new URLSearchParams({
      location: searchData.location,
      startDate: searchData.startDate.toISOString(),
      endDate: searchData.endDate.toISOString(),
      categoria: searchData.vehicleType, // Enviar el ID de la categoría como 'categoria'
      passengers: searchData.passengers.toString()
    });

    // Navegar a productos con los filtros aplicados
    navigate(`/productos?${params.toString()}`);
  };

  // 🚗 Generar tipos de vehículo dinámicamente desde categorías del backend
  const vehicleTypes = [
    { value: '', label: 'Todos los vehículos' },
    ...categorias.map(categoria => ({
      value: categoria.id, // Usar el ID como value
      label: categoria.nombre
    }))
  ];

  const locations = [
    'Buenos Aires',
    'Córdoba',
    'Rosario',
    'Mendoza',
    'La Plata',
    'Mar del Plata',
    'Salta',
    'Bariloche'
  ];

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Encuentra tu vehículo ideal
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Alquila el auto perfecto para tu próximo viaje. 
            Más de 1000 vehículos disponibles en toda Argentina.
          </p>
        </div>

        {/* Formulario de búsqueda */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-gray-900">
          <form onSubmit={handleSearch} className="space-y-6">
            
            {/* Título del formulario */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Buscar vehículo
              </h2>
              <p className="text-gray-600">
                Completa los datos para encontrar las mejores opciones
              </p>
            </div>

            {/* Grid de campos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Ubicación */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Ubicación
                </label>
                <select
                  value={searchData.location}
                  onChange={(e) => setSearchData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Seleccionar ciudad</option>
                  {locations.map(location => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo de vehículo */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Car className="inline w-4 h-4 mr-1" />
                  Tipo de vehículo
                </label>
                <select
                  value={searchData.vehicleType}
                  onChange={(e) => setSearchData(prev => ({ ...prev, vehicleType: e.target.value }))}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <option value="">Cargando categorías...</option>
                  ) : (
                    vehicleTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Número de pasajeros */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  Pasajeros
                </label>
                <select
                  value={searchData.passengers}
                  onChange={(e) => setSearchData(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'pasajero' : 'pasajeros'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rango de fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fecha de retiro */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Fecha de retiro
                </label>
                <DatePicker
                  selected={searchData.startDate}
                  onChange={(date) => setSearchData(prev => ({ ...prev, startDate: date }))}
                  selectsStart
                  startDate={searchData.startDate}
                  endDate={searchData.endDate}
                  minDate={today}
                  placeholderText="Seleccionar fecha de retiro"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  dateFormat="dd/MM/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  locale="es"
                />
              </div>

              {/* Fecha de devolución */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Fecha de devolución
                </label>
                <DatePicker
                  selected={searchData.endDate}
                  onChange={(date) => setSearchData(prev => ({ ...prev, endDate: date }))}
                  selectsEnd
                  startDate={searchData.startDate}
                  endDate={searchData.endDate}
                  minDate={searchData.startDate || tomorrow}
                  placeholderText="Seleccionar fecha de devolución"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  dateFormat="dd/MM/yyyy"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  locale="es"
                />
              </div>
            </div>

            {/* Botón de búsqueda */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Search className="w-5 h-5" />
                Realizar búsqueda
              </button>
            </div>

            {/* Información adicional */}
            <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
              <p>
                💡 <strong>Tip:</strong> Los precios pueden variar según la temporada y disponibilidad. 
                ¡Reserva con anticipación para obtener las mejores tarifas!
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;