// src/components/SearchSection.jsx
import { useState, useEffect } from 'react';
import StepProgressBar from './StepProgressBar';
import { reservationSteps } from '../config/steps';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCategory,
  setDates,
  setPickupLocation,
  setDropoffLocation,
} from '../redux/slices/reservationSlice';
import { fetchCategories } from '../redux/slices/categorySlice';
import { useNavigate } from 'react-router-dom';

import RangeCalendarModal from './RangeCalendarModal';
import { Calendar, MapPin, Search, Car } from 'lucide-react';
import { locations } from '../utils/locations';

const SearchSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* Redux: categorías y reserva persistida */
  const { items: categorias, loading } = useSelector((state) => state.category);
  const reservation = useSelector((state) => state.reservation);

  /* Estado local del formulario, inicializado con Redux */
  const [searchData, setSearchData] = useState({
    location: reservation.pickupLocation || '',
    dropoffLocation: reservation.dropoffLocation || '',
    vehicleType: reservation.selectedCategory || '',
    startDate: reservation.selectedDates?.start
      ? new Date(reservation.selectedDates.start)
      : null,
    endDate: reservation.selectedDates?.end
      ? new Date(reservation.selectedDates.end)
      : null,
  });

  // Estado para controlar el modal de calendario de rango
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  // Campo que abrió el modal ("retiro" o "devolucion")
  const [calendarField, setCalendarField] = useState(null);
  // Estado para el rango seleccionado (sincronizado con searchData)
  const [selectedRange, setSelectedRange] = useState({
    startDate: searchData.startDate,
    endDate: searchData.endDate,
  });

  // Sincronizar selectedRange con searchData si cambian
  useEffect(() => {
    setSelectedRange({
      startDate: searchData.startDate,
      endDate: searchData.endDate,
    });
  }, [searchData.startDate, searchData.endDate]);

  // Handler para abrir el modal desde un input
  const handleCalendarInputClick = (field) => {
    setCalendarField(field); // "retiro" o "devolucion" (por si se quiere lógica especial)
    setShowCalendarModal(true);
  };

  // Handler para confirmar el rango en el modal
  const handleCalendarConfirm = (range) => {
    setShowCalendarModal(false);
    setCalendarField(null);
    // Actualizar fechas en searchData y redux
    setSearchData((prev) => ({
      ...prev,
      startDate: range.startDate,
      endDate: range.endDate,
    }));
    dispatch(setDates({ start: range.startDate, end: range.endDate }));
  };

  // Handler para cerrar el modal sin cambios
  const handleCalendarClose = () => {
    setShowCalendarModal(false);
    setCalendarField(null);
  };

  /* Fechas y errores */
  const [dateErrors, setDateErrors] = useState({ start: false, end: false });
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  /* Step Progress */
  const [activeStep, setActiveStep] = useState(0);

  /* Cargar categorías al montar */
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);


  /* Tipos de vehículo */
  const vehicleTypes = [
    { value: '', label: 'Todos los vehículos' },
    ...categorias.map((cat) => ({ value: cat.nombre, label: cat.nombre })),
  ];

  /* Submit del formulario */
  const handleSearch = (e) => {
    e.preventDefault();

    const errors = {
      start: !searchData.startDate,
      end: !searchData.endDate,
    };
    setDateErrors(errors);
    if (errors.start || errors.end) return;

    // Guardar en Redux (persistirá automáticamente)
    dispatch(setCategory(searchData.vehicleType));
    dispatch(setDates({ start: searchData.startDate, end: searchData.endDate }));
    dispatch(setPickupLocation(searchData.location));
    dispatch(setDropoffLocation(searchData.dropoffLocation));

    // Navegar con filtros (sin incluir location)
    const params = new URLSearchParams();
    if (searchData.vehicleType)
      params.append('vehicleType', searchData.vehicleType);
    if (searchData.startDate)
      params.append('startDate', searchData.startDate.toISOString().split('T')[0]);
    if (searchData.endDate)
      params.append('endDate', searchData.endDate.toISOString().split('T')[0]);

    navigate(`/productos?${params.toString()}`);
  };

  /* Render principal */
  return (
    <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Encuentra tu vehículo ideal
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Alquila el auto perfecto para tu próximo viaje. Más de 1000
            vehículos disponibles en toda Argentina.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-gray-900">
          {/* Progreso */}
          <div className="flex justify-center">
            <div className="w-full max-w-xl mx-auto">
              <StepProgressBar
                steps={reservationSteps}
                activeStep={activeStep}
                onStepClick={setActiveStep}
              />
            </div>
          </div>

          <form onSubmit={handleSearch} className="space-y-6 mt-6">
            {/* Fecha Retiro + Lugar Retiro */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Fecha de Retiro
                </label>
                <input
                  type="text"
                  readOnly
                  value={
                    searchData.startDate
                      ? searchData.startDate.toLocaleDateString("es-AR")
                      : "Seleccionar fecha de retiro"
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer"
                  onClick={() => handleCalendarInputClick("retiro")}
                />
                {dateErrors.start && (
                  <p className="text-red-600 text-sm mt-2">
                    Selecciona una fecha de retiro
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Lugar de Retiro
                </label>
                <select
                  value={searchData.location}
                  onChange={(e) =>
                    setSearchData((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Seleccionar ciudad</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fecha Devolución + Lugar Devolución */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Fecha de Devolución
                </label>
                <input
                  type="text"
                  readOnly
                  value={
                    searchData.endDate
                      ? searchData.endDate.toLocaleDateString("es-AR")
                      : "Seleccionar fecha de devolución"
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer"
                  onClick={() => handleCalendarInputClick("devolucion")}
                />
            {/* Modal de calendario de rango */}
            <RangeCalendarModal
              open={showCalendarModal}
              onClose={handleCalendarClose}
              onConfirm={handleCalendarConfirm}
              initialRange={{
                startDate: searchData.startDate || new Date(),
                endDate: searchData.endDate || new Date(),
                key: "selection"
              }}
            />
                {dateErrors.end && (
                  <p className="text-red-600 text-sm mt-2">
                    Selecciona una fecha de devolución
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  Lugar de Devolución
                </label>
                <select
                  value={searchData.dropoffLocation}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      dropoffLocation: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Seleccionar ciudad</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Categoría + Botón Buscar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Car className="inline w-4 h-4 mr-1" />
                  Categoría de Vehículos
                </label>
                <select
                  value={searchData.vehicleType}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      vehicleType: e.target.value,
                    }))
                  }
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg disabled:bg-gray-100"
                >
                  {loading ? (
                    <option value="">Cargando categorías...</option>
                  ) : (
                    vehicleTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Buscar Vehículo
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
