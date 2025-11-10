import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Check, Calendar, MapPin, User, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useReservations } from '../context/ReservationContext';
import { useAuth } from '../context/AuthContext';
import StepProgressBar from '../components/StepProgressBar';
import { reservationSteps } from '../config/steps';
import productService from '../services/productService';
import { useSelector } from 'react-redux';

const ReservationConfirmation = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const { getReservationById } = useReservations();
  const { isAuthenticated, user } = useAuth();
  const [reservation, setReservation] = useState(null);

  // 🔁 Fallback: datos de Redux (por si no existen en backend)
  const reduxReservation = useSelector((state) => state.reservation);

  // Genera un código de confirmación tipo CRAAAAMMDDNNNN
  function generateConfirmationCode(date, id) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const nnnn = String(id).padStart(4, '0').slice(-4);
    return `CR${year}${month}${day}${nnnn}`;
  }

  useEffect(() => {
    const loadReservation = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        const reservationData = await getReservationById(parseInt(reservationId));
        if (reservationData) {
          let productData = null;
          let productImages = [];
          if (reservationData.productoId) {
            try {
              productData = await productService.getProductById(reservationData.productoId);
              productImages = await productService.getProductImages(reservationData.productoId);
            } catch (error) {
              console.error('Error al obtener datos del producto:', error);
            }
          }

          const startDate = new Date(reservationData.startDate);
          const endDate = new Date(reservationData.endDate);
          const diffTime = endDate.getTime() - startDate.getTime();
          const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

          const enhancedReservation = {
            ...reservationData,
            customerInfo: reservationData.customerInfo || {
              firstName: user?.firstName || reservationData.firstName || user?.nombre || 'Usuario',
              lastName: user?.lastName || reservationData.lastName || user?.apellido || '',
              email: reservationData.email || 'N/A',
              phone: reservationData.phone || 'N/A',
              driverLicense: reservationData.driverLicense || 'N/A',
              emergencyContact: reservationData.emergencyContact || 'N/A'
            },
            vehicleName: productData?.nombre || reservationData.vehicleName || reservationData.nombre || 'Vehículo',
            vehicleImage:
              productImages?.[0]?.url ||
              productData?.imagenes?.[0]?.url ||
              productData?.imagen?.url ||
              productData?.imagen ||
              reservationData.vehicleImage ||
              '/placeholder-car.jpg',
            dailyPrice: productData?.precio || reservationData.dailyPrice || reservationData.precio || 0,
            totalDays,
            totalPrice:
              reservationData.totalPrice ||
              ((productData?.precio || reservationData.dailyPrice || reservationData.precio || 0) * totalDays),
            confirmationCode: generateConfirmationCode(
              reservationData.createdAt || reservationData.fechaCreacion || new Date(),
              reservationData.id
            ),
            createdAt: reservationData.createdAt || reservationData.fechaCreacion || new Date().toISOString(),
            additionalServices: reservationData.additionalServices || [],
            specialRequests: reservationData.specialRequests || ''
          };

          setReservation(enhancedReservation);
        } else {
          navigate('/reservas');
        }
      } catch (error) {
        console.error('Error al cargar reserva:', error);
        navigate('/reservas');
      }
    };

    loadReservation();
  }, [reservationId, getReservationById, isAuthenticated, navigate]);

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
        <StepProgressBar steps={reservationSteps} activeStep={3} />

        {/* Header de éxito */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h1>
          <p className="text-gray-600 text-lg">
            Tu reserva ha sido procesada exitosamente. Pronto recibirás un correo con todos los detalles.
          </p>
        </div>

        {/* Información de la reserva */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {/* Header con código */}
          <div className="bg-blue-600 text-white px-6 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-1">Código de Confirmación</h2>
                <p className="text-blue-100 text-sm">Guarda este código para futuras referencias</p>
              </div>
              <div className="mt-3 sm:mt-0">
                <span className="text-2xl font-mono font-bold">{reservation.confirmationCode}</span>
              </div>
            </div>
          </div>

          {/* Detalles */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Vehículo */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Vehículo</h3>

                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={reservation.vehicleImage}
                    alt={reservation.vehicleName}
                    className="w-24 h-16 object-cover rounded-lg"
                    onError={(e) => (e.target.src = '/placeholder-car.jpg')}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{reservation.vehicleName}</h4>
                    <p className="text-gray-600 text-sm">
                      ${reservation.dailyPrice?.toLocaleString('es-AR')}/día
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Período de alquiler</p>
                      <p className="font-medium">
                        {new Date(reservation.startDate).toLocaleDateString()} -{' '}
                        {new Date(reservation.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-blue-600 font-semibold">
                        {reservation.totalDays} {reservation.totalDays === 1 ? 'día' : 'días'}
                      </p>
                    </div>
                  </div>

                  {/* 🏙️ Retiro */}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Retiro:{' '}
                        <span className="font-medium text-gray-900">
                          {reservation.pickupLocation ||
                            reduxReservation.pickupLocation ||
                            'No especificado'}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* 🏙️ Devolución */}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Devolución:{' '}
                        <span className="font-medium text-gray-900">
                          {reservation.dropoffLocation ||
                            reduxReservation.dropoffLocation ||
                            'No especificado'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cliente */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Conductor</h3>

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
                      <p className="font-medium">
                        {reservation.customerInfo.email && reservation.customerInfo.email !== 'N/A'
                          ? reservation.customerInfo.email
                          : user?.email || 'N/A'}
                      </p>
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
                    <div className="w-5 h-5 flex items-center justify-center text-gray-400">🪪</div>
                    <div>
                      <p className="text-sm text-gray-600">Licencia de conducir</p>
                      <p className="font-medium">{reservation.customerInfo.driverLicense}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Costos</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Alquiler ({reservation.totalDays}{' '}
                    {reservation.totalDays === 1 ? 'día' : 'días'} × $
                    {reservation.dailyPrice?.toLocaleString('es-AR')})
                  </span>
                  <span>
                    ${(reservation.dailyPrice * reservation.totalDays)?.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-blue-600">
                    ${reservation.totalPrice?.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info importante */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Información Importante</h3>
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
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Mis Reservas
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirmation;
