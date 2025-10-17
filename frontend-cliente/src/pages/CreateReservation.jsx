import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, Phone, Mail, CreditCard, Shield, Clock, Check } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../context/AuthContext';
import { useReservations } from '../context/ReservationContext';
import { useReservationNotifications } from '../hooks/useReservationNotifications';

// Mock de productos (deberíamos usar el mismo del contexto de productos)
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
    id: 5, 
    nombre: "Toyota RAV4", 
    categoria: "suv", 
    precio: 80, 
    pasajeros: 7, 
    ubicacion: "Buenos Aires",
    imagen: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400",
    disponible: true 
  }
];

const CreateReservation = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { createReservation, isLoading, calculateTotalPrice, checkVehicleAvailability } = useReservations();
  const { notifyCreated, notifyError } = useReservationNotifications();

  // Estados del formulario
  const [vehicle, setVehicle] = useState(null);
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    pickupLocation: '',
    dropoffLocation: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    driverLicense: '',
    emergencyContact: '',
    specialRequests: '',
    additionalServices: []
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1); // 1: Fechas, 2: Datos, 3: Confirmación
  const [priceCalculation, setPriceCalculation] = useState(null);

  // Servicios adicionales disponibles
  const additionalServices = [
    { id: 'gps', name: 'GPS', price: 5, description: 'Sistema de navegación GPS' },
    { id: 'childSeat', name: 'Asiento para niños', price: 8, description: 'Asiento de seguridad infantil' },
    { id: 'insurance', name: 'Seguro completo', price: 15, description: 'Cobertura total contra daños' },
    { id: 'driver', name: 'Conductor adicional', price: 10, description: 'Licencia para segundo conductor' }
  ];

  // Cargar vehículo y datos iniciales
  useEffect(() => {
    const vehicleData = productos.find(p => p.id === parseInt(vehicleId));
    if (vehicleData) {
      setVehicle(vehicleData);
      
      // Prellenar ubicaciones
      setFormData(prev => ({
        ...prev,
        pickupLocation: vehicleData.ubicacion,
        dropoffLocation: vehicleData.ubicacion
      }));
    }

    // Prellenar fechas si vienen en la URL
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    
    if (startDateParam && endDateParam) {
      setFormData(prev => ({
        ...prev,
        startDate: new Date(startDateParam),
        endDate: new Date(endDateParam)
      }));
    }

    // Prellenar datos del usuario
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [vehicleId, searchParams, user]);

  // Calcular precio cuando cambien fechas o servicios
  useEffect(() => {
    if (vehicle && formData.startDate && formData.endDate) {
      const calculation = calculateTotalPrice(
        vehicle.precio,
        formData.startDate,
        formData.endDate,
        formData.additionalServices
      );
      setPriceCalculation(calculation);
    }
  }, [vehicle, formData.startDate, formData.endDate, formData.additionalServices, calculateTotalPrice]);

  // Validar disponibilidad
  const validateAvailability = () => {
    if (!vehicle || !formData.startDate || !formData.endDate) return false;
    
    return checkVehicleAvailability(vehicle.id, formData.startDate, formData.endDate);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Manejar servicios adicionales
  const handleServiceToggle = (service) => {
    const isSelected = formData.additionalServices.find(s => s.id === service.id);
    
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        additionalServices: prev.additionalServices.filter(s => s.id !== service.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        additionalServices: [...prev.additionalServices, service]
      }));
    }
  };

  // Validar paso actual
  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.startDate) newErrors.startDate = 'Selecciona la fecha de retiro';
      if (!formData.endDate) newErrors.endDate = 'Selecciona la fecha de devolución';
      if (formData.startDate && formData.endDate && formData.startDate >= formData.endDate) {
        newErrors.endDate = 'La fecha de devolución debe ser posterior a la de retiro';
      }
      if (!formData.pickupLocation) newErrors.pickupLocation = 'Selecciona el lugar de retiro';

      // Verificar disponibilidad
      if (formData.startDate && formData.endDate && !validateAvailability()) {
        newErrors.availability = 'El vehículo no está disponible en estas fechas';
      }
    }

    if (stepNumber === 2) {
      if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
      if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
      if (!formData.email.trim()) newErrors.email = 'El email es requerido';
      if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
      if (!formData.driverLicense.trim()) newErrors.driverLicense = 'El número de licencia es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Siguiente paso
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  // Paso anterior
  const prevStep = () => {
    setStep(step - 1);
  };

  // Procesar reserva
  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    const reservationData = {
      vehicleId: vehicle.id,
      vehicleName: vehicle.nombre,
      vehicleImage: vehicle.imagen,
      startDate: formData.startDate.toISOString(),
      endDate: formData.endDate.toISOString(),
      pickupLocation: formData.pickupLocation,
      dropoffLocation: formData.dropoffLocation,
      totalDays: priceCalculation.days,
      dailyPrice: vehicle.precio,
      totalPrice: priceCalculation.totalPrice,
      ...formData
    };

    const result = await createReservation(reservationData);

    if (result.success) {
      // Mostrar notificación de éxito
      notifyCreated({
        vehicleName: result.reservation.vehicleName,
        confirmationCode: result.reservation.confirmationCode
      });
      navigate(`/reserva-confirmada/${result.reservation.id}`);
    } else {
      // Mostrar notificación de error
      notifyError(result.error);
      setErrors({ general: result.error });
    }
  };

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    navigate('/login', { state: { from: location } });
    return null;
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando información del vehículo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reservar Vehículo
          </h1>
          
          {/* Indicador de pasos */}
          <div className="flex items-center space-x-4 mb-6">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > num ? <Check className="w-4 h-4" /> : num}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {num === 1 && 'Fechas'}
                  {num === 2 && 'Datos'}
                  {num === 3 && 'Confirmación'}
                </span>
                {num < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-4"></div>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Información del vehículo */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <img
                src={vehicle.imagen}
                alt={vehicle.nombre}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {vehicle.nombre}
              </h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {vehicle.ubicacion}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {vehicle.pasajeros} pasajeros
                </div>
              </div>
              
              {/* Resumen de precios */}
              {priceCalculation && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Resumen de costos</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>${vehicle.precio}/día × {priceCalculation.days} días</span>
                      <span>${priceCalculation.basePrice}</span>
                    </div>
                    {formData.additionalServices.length > 0 && (
                      <div className="flex justify-between">
                        <span>Servicios adicionales</span>
                        <span>${priceCalculation.servicesPrice}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${priceCalculation.totalPrice}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Formulario de reserva */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              
              {/* Error general */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errors.general}
                </div>
              )}

              {/* Paso 1: Fechas y ubicación */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Fechas y ubicación
                  </h2>

                  {/* Fechas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline w-4 h-4 mr-1" />
                        Fecha de retiro
                      </label>
                      <DatePicker
                        selected={formData.startDate}
                        onChange={(date) => handleInputChange('startDate', date)}
                        minDate={new Date()}
                        placeholderText="Seleccionar fecha"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        dateFormat="dd/MM/yyyy"
                      />
                      {errors.startDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="inline w-4 h-4 mr-1" />
                        Fecha de devolución
                      </label>
                      <DatePicker
                        selected={formData.endDate}
                        onChange={(date) => handleInputChange('endDate', date)}
                        minDate={formData.startDate || new Date()}
                        placeholderText="Seleccionar fecha"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        dateFormat="dd/MM/yyyy"
                      />
                      {errors.endDate && (
                        <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
                      )}
                    </div>
                  </div>

                  {/* Error de disponibilidad */}
                  {errors.availability && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {errors.availability}
                    </div>
                  )}

                  {/* Ubicaciones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline w-4 h-4 mr-1" />
                        Lugar de retiro
                      </label>
                      <input
                        type="text"
                        value={formData.pickupLocation}
                        onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Dirección de retiro"
                      />
                      {errors.pickupLocation && (
                        <p className="mt-1 text-sm text-red-600">{errors.pickupLocation}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="inline w-4 h-4 mr-1" />
                        Lugar de devolución
                      </label>
                      <input
                        type="text"
                        value={formData.dropoffLocation}
                        onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Dirección de devolución"
                      />
                    </div>
                  </div>

                  {/* Servicios adicionales */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Servicios adicionales (opcional)
                    </h3>
                    <div className="space-y-3">
                      {additionalServices.map(service => (
                        <label key={service.id} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.additionalServices.find(s => s.id === service.id) !== undefined}
                            onChange={() => handleServiceToggle(service)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <div className="ml-3 flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-gray-900">{service.name}</span>
                              <span className="text-blue-600 font-semibold">+${service.price}/día</span>
                            </div>
                            <p className="text-sm text-gray-600">{service.description}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={nextStep}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Paso 2: Datos del conductor */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Datos del conductor
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apellido
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline w-4 h-4 mr-1" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline w-4 h-4 mr-1" />
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <CreditCard className="inline w-4 h-4 mr-1" />
                        Número de licencia de conducir
                      </label>
                      <input
                        type="text"
                        value={formData.driverLicense}
                        onChange={(e) => handleInputChange('driverLicense', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ej: 12345678"
                      />
                      {errors.driverLicense && (
                        <p className="mt-1 text-sm text-red-600">{errors.driverLicense}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contacto de emergencia
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nombre y teléfono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Solicitudes especiales (opcional)
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Cualquier solicitud especial o comentario..."
                    />
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={nextStep}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              )}

              {/* Paso 3: Confirmación */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Confirmación de reserva
                  </h2>

                  {/* Resumen de la reserva */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Resumen de tu reserva</h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vehículo:</span>
                        <span className="font-medium">{vehicle.nombre}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fechas:</span>
                        <span className="font-medium">
                          {formData.startDate?.toLocaleDateString()} - {formData.endDate?.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duración:</span>
                        <span className="font-medium">{priceCalculation?.days} días</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Conductor:</span>
                        <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Retiro:</span>
                        <span className="font-medium">{formData.pickupLocation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Devolución:</span>
                        <span className="font-medium">{formData.dropoffLocation}</span>
                      </div>
                      {formData.additionalServices.length > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Servicios adicionales:</span>
                          <span className="font-medium">
                            {formData.additionalServices.map(s => s.name).join(', ')}
                          </span>
                        </div>
                      )}
                      <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span className="text-blue-600">${priceCalculation?.totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Políticas */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-2">Términos y condiciones</p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>El conductor debe tener al menos 21 años</li>
                          <li>Se requiere licencia de conducir válida</li>
                          <li>El vehículo debe devolverse con el mismo nivel de combustible</li>
                          <li>Cancelación gratuita hasta 24 horas antes</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={prevStep}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Confirmar Reserva
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReservation;