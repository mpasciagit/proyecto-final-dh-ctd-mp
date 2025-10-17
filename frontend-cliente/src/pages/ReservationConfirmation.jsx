import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Check, Calendar, MapPin, User, Mail, Phone, Download, Share2, ArrowLeft } from 'lucide-react';
import { useReservations } from '../context/ReservationContext';
import { useAuth } from '../context/AuthContext';

const ReservationConfirmation = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const { getReservationById } = useReservations();
  const { isAuthenticated } = useAuth();
  const [reservation, setReservation] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const reservationData = getReservationById(parseInt(reservationId));
    if (reservationData) {
      setReservation(reservationData);
    } else {
      navigate('/reservas');
    }
  }, [reservationId, getReservationById, isAuthenticated, navigate]);

  const downloadConfirmation = () => {
    // En una implementación real, esto generaría un PDF
    alert('En una implementación real, esto descargaría un PDF con la confirmación');
  };

  const shareReservation = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Mi Reserva de Vehículo',
        text: `He reservado un ${reservation.vehicleName} del ${new Date(reservation.startDate).toLocaleDateString()} al ${new Date(reservation.endDate).toLocaleDateString()}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copiar al clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  if (!reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando confirmación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header de éxito */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Reserva Confirmada!
          </h1>
          <p className="text-gray-600 text-lg">
            Tu reserva ha sido procesada exitosamente
          </p>
        </div>

        {/* Información de la reserva */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          
          {/* Header con código de confirmación */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">
                  Código de Confirmación
                </h2>
                <p className="text-blue-100 text-sm">
                  Guarda este código para futuras referencias
                </p>
              </div>
              <div className="mt-3 sm:mt-0">
                <span className="text-2xl font-mono font-bold">
                  {reservation.confirmationCode}
                </span>
              </div>
            </div>
          </div>

          {/* Detalles de la reserva */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Información del vehículo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Información del Vehículo
                </h3>
                
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={reservation.vehicleImage}
                    alt={reservation.vehicleName}
                    className="w-24 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {reservation.vehicleName}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      ${reservation.dailyPrice}/día
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Período de alquiler</p>
                      <p className="font-medium">
                        {new Date(reservation.startDate).toLocaleDateString()} - {' '}
                        {new Date(reservation.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {reservation.totalDays} {reservation.totalDays === 1 ? 'día' : 'días'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Retiro</p>
                      <p className="font-medium">{reservation.pickupLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Devolución</p>
                      <p className="font-medium">{reservation.dropoffLocation}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del cliente */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Datos del Conductor
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Nombre completo</p>
                      <p className="font-medium">
                        {reservation.customerInfo.firstName} {reservation.customerInfo.lastName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{reservation.customerInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-medium">{reservation.customerInfo.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                      🪪
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Licencia de conducir</p>
                      <p className="font-medium">{reservation.customerInfo.driverLicense}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Servicios adicionales */}
            {reservation.additionalServices.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Servicios Adicionales
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {reservation.additionalServices.map((service) => (
                    <div key={service.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{service.name}</span>
                      <span className="text-blue-600 font-semibold">+${service.price}/día</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Solicitudes especiales */}
            {reservation.specialRequests && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Solicitudes Especiales
                </h3>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {reservation.specialRequests}
                </p>
              </div>
            )}

            {/* Resumen de costos */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Resumen de Costos
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Alquiler ({reservation.totalDays} {reservation.totalDays === 1 ? 'día' : 'días'} × ${reservation.dailyPrice})
                  </span>
                  <span>${reservation.dailyPrice * reservation.totalDays}</span>
                </div>
                
                {reservation.additionalServices.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Servicios adicionales</span>
                    <span>${reservation.additionalServices.reduce((total, service) => total + service.price * reservation.totalDays, 0)}</span>
                  </div>
                )}
                
                <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-blue-600">${reservation.totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            onClick={downloadConfirmation}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Descargar Confirmación
          </button>
          
          <button
            onClick={shareReservation}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Compartir
          </button>
        </div>

        {/* Información importante */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Información Importante
          </h3>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• Llega 30 minutos antes de tu hora de retiro programada</p>
            <p>• Trae tu licencia de conducir válida y tarjeta de crédito</p>
            <p>• El vehículo debe devolverse con el mismo nivel de combustible</p>
            <p>• Para modificaciones o cancelaciones, contacta con soporte antes de 24 horas</p>
          </div>
        </div>

        {/* Navegación */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al Inicio
          </Link>
          
          <Link
            to="/reservas"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            Ver Mis Reservas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirmation;