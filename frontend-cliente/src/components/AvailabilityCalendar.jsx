import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, AlertCircle, CheckCircle, Clock, Users } from 'lucide-react';
import { useReservations } from '../context/ReservationContext';
import { useAuth } from '../context/AuthContext';

const AvailabilityCalendar = ({ vehicleId, vehicleName, onDateSelect, initialStartDate, initialEndDate }) => {
  const { checkVehicleAvailability, getReservationHistory, calculateTotalPrice } = useReservations();
  const { isAuthenticated } = useAuth();
  
  const [startDate, setStartDate] = useState(initialStartDate || null);
  const [endDate, setEndDate] = useState(initialEndDate || null);
  const [isAvailable, setIsAvailable] = useState(null);
  const [occupiedDates, setOccupiedDates] = useState([]);
  const [priceCalculation, setPriceCalculation] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Precio base del vehículo (en una app real vendría de props o contexto)
  const dailyPrice = vehicleId === 1 ? 45 : vehicleId === 2 ? 50 : vehicleId === 5 ? 80 : 60;

  // Cargar fechas ocupadas al montar el componente
  useEffect(() => {
    loadOccupiedDates();
  }, [vehicleId]);

  // Verificar disponibilidad cuando cambien las fechas
  useEffect(() => {
    if (startDate && endDate && vehicleId) {
      const available = checkVehicleAvailability(vehicleId, startDate, endDate);
      setIsAvailable(available);
      
      // Calcular precio si hay fechas válidas
      if (available && startDate < endDate) {
        const calculation = calculateTotalPrice(dailyPrice, startDate, endDate);
        setPriceCalculation(calculation);
        
        // Notificar al componente padre
        if (onDateSelect) {
          onDateSelect({
            startDate,
            endDate,
            isAvailable: available,
            priceCalculation: calculation
          });
        }
      } else {
        setPriceCalculation(null);
        if (onDateSelect) {
          onDateSelect({
            startDate,
            endDate,
            isAvailable: available,
            priceCalculation: null
          });
        }
      }
    }
  }, [startDate, endDate, vehicleId, checkVehicleAvailability, calculateTotalPrice, onDateSelect, dailyPrice]);

  const loadOccupiedDates = () => {
    const allReservations = getReservationHistory();
    const vehicleReservations = allReservations.filter(
      reservation => reservation.vehicleId === vehicleId && reservation.status === 'confirmed'
    );

    const occupied = [];
    vehicleReservations.forEach(reservation => {
      const start = new Date(reservation.startDate);
      const end = new Date(reservation.endDate);
      
      // Agregar todas las fechas del rango
      const currentDate = new Date(start);
      while (currentDate <= end) {
        occupied.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    setOccupiedDates(occupied);
  };

  // Función para determinar si una fecha está ocupada
  const isDateOccupied = (date) => {
    return occupiedDates.some(occupiedDate => 
      occupiedDate.toDateString() === date.toDateString()
    );
  };

  // Función para personalizar el estilo de las fechas en el calendario
  const getDayClassName = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
      return 'react-datepicker__day--disabled opacity-50';
    }
    
    if (isDateOccupied(date)) {
      return 'react-datepicker__day--occupied bg-red-200 text-red-800';
    }
    
    return '';
  };

  // Función para deshabilitar fechas ocupadas
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return date < today || isDateOccupied(date);
  };

  const getAvailabilityMessage = () => {
    if (!startDate || !endDate) {
      return {
        type: 'info',
        message: 'Selecciona las fechas para verificar disponibilidad',
        icon: Calendar
      };
    }
    
    if (startDate >= endDate) {
      return {
        type: 'warning',
        message: 'La fecha de devolución debe ser posterior a la de retiro',
        icon: AlertCircle
      };
    }
    
    if (isAvailable === false) {
      return {
        type: 'error',
        message: 'El vehículo no está disponible en estas fechas',
        icon: AlertCircle
      };
    }
    
    if (isAvailable === true) {
      return {
        type: 'success',
        message: `¡Disponible! ${priceCalculation?.days} ${priceCalculation?.days === 1 ? 'día' : 'días'} por $${priceCalculation?.totalPrice}`,
        icon: CheckCircle
      };
    }
    
    return null;
  };

  const availabilityStatus = getAvailabilityMessage();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Disponibilidad y Reserva
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
        </button>
      </div>

      {/* Información de precios */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Precio por día</span>
          <span className="text-2xl font-bold text-blue-600">${dailyPrice}</span>
        </div>
        {priceCalculation && (
          <div className="mt-2 text-sm text-gray-600">
            {priceCalculation.days} {priceCalculation.days === 1 ? 'día' : 'días'} × ${dailyPrice} = ${priceCalculation.totalPrice}
          </div>
        )}
      </div>

      {/* Selectores de fecha */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Fecha de retiro
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            minDate={new Date()}
            excludeDates={occupiedDates}
            filterDate={(date) => !isDateDisabled(date)}
            dayClassName={getDayClassName}
            placeholderText="Seleccionar fecha de retiro"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            dateFormat="dd/MM/yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            monthsShown={1}
            inline={showDetails}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Fecha de devolución
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate || new Date()}
            excludeDates={occupiedDates}
            filterDate={(date) => !isDateDisabled(date)}
            dayClassName={getDayClassName}
            placeholderText="Seleccionar fecha de devolución"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            dateFormat="dd/MM/yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            monthsShown={1}
            inline={showDetails}
          />
        </div>
      </div>

      {/* Calendario doble para vista detallada */}
      {showDetails && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Seleccionar fechas</h4>
              <DatePicker
                selected={startDate}
                onChange={(dates) => {
                  const [start, end] = dates;
                  setStartDate(start);
                  setEndDate(end);
                }}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                excludeDates={occupiedDates}
                filterDate={(date) => !isDateDisabled(date)}
                dayClassName={getDayClassName}
                monthsShown={2}
                showDisabledMonthNavigation
                inline
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Leyenda</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
                    <span>Fechas ocupadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
                    <span>Fechas seleccionadas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                    <span>Fechas disponibles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded opacity-50"></div>
                    <span>Fechas pasadas</span>
                  </div>
                </div>
              </div>

              {/* Próximas reservas */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Próximas reservas</h4>
                <div className="space-y-2 text-xs text-gray-600 max-h-32 overflow-y-auto">
                  {getReservationHistory()
                    .filter(r => r.vehicleId === vehicleId && r.status === 'confirmed' && new Date(r.endDate) >= new Date())
                    .slice(0, 3)
                    .map(reservation => (
                      <div key={reservation.id} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                        <Clock className="w-3 h-3 text-red-500" />
                        <span>
                          {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  {getReservationHistory().filter(r => r.vehicleId === vehicleId && r.status === 'confirmed' && new Date(r.endDate) >= new Date()).length === 0 && (
                    <p className="text-gray-500 italic">No hay reservas próximas</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Estado de disponibilidad */}
      {availabilityStatus && (
        <div className={`flex items-center gap-3 p-4 rounded-lg mb-6 ${
          availabilityStatus.type === 'success' ? 'bg-green-50 border border-green-200' :
          availabilityStatus.type === 'error' ? 'bg-red-50 border border-red-200' :
          availabilityStatus.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
          'bg-blue-50 border border-blue-200'
        }`}>
          <availabilityStatus.icon className={`w-5 h-5 ${
            availabilityStatus.type === 'success' ? 'text-green-600' :
            availabilityStatus.type === 'error' ? 'text-red-600' :
            availabilityStatus.type === 'warning' ? 'text-yellow-600' :
            'text-blue-600'
          }`} />
          <span className={`font-medium ${
            availabilityStatus.type === 'success' ? 'text-green-800' :
            availabilityStatus.type === 'error' ? 'text-red-800' :
            availabilityStatus.type === 'warning' ? 'text-yellow-800' :
            'text-blue-800'
          }`}>
            {availabilityStatus.message}
          </span>
        </div>
      )}

      {/* Resumen de la selección */}
      {startDate && endDate && isAvailable && priceCalculation && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Resumen de tu selección</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Vehículo:</span>
              <span className="font-medium">{vehicleName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Retiro:</span>
              <span className="font-medium">{startDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Devolución:</span>
              <span className="font-medium">{endDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duración:</span>
              <span className="font-medium">{priceCalculation.days} {priceCalculation.days === 1 ? 'día' : 'días'}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span className="text-blue-600">${priceCalculation.totalPrice}</span>
            </div>
          </div>
        </div>
      )}

      {/* Botón de reserva */}
      {startDate && endDate && isAvailable && isAuthenticated && (
        <a
          href={`/reservar/${vehicleId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
        >
          Continuar con la reserva
        </a>
      )}

      {/* Mensaje para usuarios no autenticados */}
      {startDate && endDate && isAvailable && !isAuthenticated && (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Inicia sesión para continuar con la reserva</p>
          <a
            href="/login"
            className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </a>
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <Users className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900 mb-1">Política de reservas</p>
            <ul className="space-y-1 text-xs">
              <li>• Cancelación gratuita hasta 24 horas antes</li>
              <li>• Precio incluye seguro básico</li>
              <li>• Combustible no incluido</li>
              <li>• Licencia de conducir válida requerida</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;