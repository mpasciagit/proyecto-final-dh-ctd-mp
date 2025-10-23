import { useState, useEffect } from 'react';
// Modal simple para mostrar el texto completo de la reseña
function ReviewModal({ open, onClose, comentario }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full shadow-lg">
        <h3 className="text-lg font-bold mb-4">Tu reseña</h3>
        <div
          className="mb-6 text-gray-800 whitespace-pre-line break-words max-h-60 overflow-auto"
          style={{ wordBreak: 'break-word' }}
        >
          {comentario}
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}
import { useLocation } from 'react-router-dom';
import productService from '../services/productService';
import { Link } from 'react-router-dom';
import { Star, Calendar, MapPin, Car, Clock, CheckCircle, XCircle, Eye, Plus } from 'lucide-react';
import { useReservations } from '../context/ReservationContext';
import reviewService from '../services/reviewService';
import ReviewSystem from '../components/ReviewSystem';
import { useAuth } from '../context/AuthContext';

export default function Reservas() {

  const { user } = useAuth();
  const { getReservationHistory, cancelReservation, isLoading, loadUserReservations } = useReservations();
  const location = useLocation();
  const [selectedTab, setSelectedTab] = useState('all'); // all, active, completed, cancelled
  const [cancelingId, setCancelingId] = useState(null);

  const allReservations = getReservationHistory();
  const [enrichedReservations, setEnrichedReservations] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewReserva, setReviewReserva] = useState(null);
  // Estado global para el modal de reseña
  const [openReviewModalId, setOpenReviewModalId] = useState(null);


  // Forzar recarga de reservas cada vez que se entra a Mis Reservas
  useEffect(() => {
    if (user && location.pathname === '/mis-reservas') {
      loadUserReservations();
    }
  }, [user, location.pathname]);

  // Cargar reviews del usuario al montar
  useEffect(() => {
    const fetchReviews = async () => {
      if (user?.id) {
        const reviews = await reviewService.getReviewsByUser(user.id);
        setUserReviews(reviews);
      }
    };
    fetchReviews();
  }, [user]);

  // Enriquecer reservas con nombre e imagen del producto si faltan
  useEffect(() => {
    const enrichReservations = async () => {
      const promises = allReservations.map(async (reservation) => {
        // Si ya tiene nombre e imagen, no hace falta enriquecer
        if (reservation.vehicleImage && reservation.vehicleName) return reservation;
        if (!reservation.productoId && !reservation.productId) return reservation;
        try {
          const productId = reservation.productoId || reservation.productId;
          const productData = await productService.getProductById(productId);
          const productImages = await productService.getProductImages(productId);
          return {
            ...reservation,
            vehicleName: productData?.nombre || reservation.vehicleName || 'Vehículo',
            vehicleImage: productImages?.[0]?.url || productData?.imagenes?.[0]?.url || productData?.imagen?.url || reservation.vehicleImage || '/placeholder-car.jpg',
          };
        } catch (e) {
          return {
            ...reservation,
            vehicleName: reservation.vehicleName || 'Vehículo',
            vehicleImage: reservation.vehicleImage || '/placeholder-car.jpg',
          };
        }
      });
      const enriched = await Promise.all(promises);
      setEnrichedReservations(enriched);
    };
    enrichReservations();
  }, [allReservations]);

  // Filtrar reservas según la pestaña seleccionada
  // Considerar FINALIZADA como completada
  const filteredReservations = enrichedReservations.filter(reservation => {
    const now = new Date();
    const endDate = new Date(reservation.endDate);
    const isFinalizada = reservation.estado === 'FINALIZADA' || reservation.status === 'FINALIZADA';
    switch (selectedTab) {
      case 'active':
        return (reservation.status === 'confirmed' && endDate >= now) || (reservation.estado === 'CONFIRMADA' && endDate >= now);
      case 'completed':
        return isFinalizada || (reservation.status === 'confirmed' && endDate < now);
      case 'cancelled':
        return reservation.status === 'cancelled' || reservation.estado === 'CANCELADA';
      default:
        return true;
    }
  });

  const handleCancelReservation = async (reservationId) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;
    
    setCancelingId(reservationId);
    const result = await cancelReservation(reservationId);
    
    if (result.success) {
      alert('Reserva cancelada exitosamente');
    } else {
      alert('Error al cancelar la reserva: ' + result.error);
    }
    
    setCancelingId(null);
  };

  const getStatusBadge = (reservation) => {
    const now = new Date();
    const endDate = new Date(reservation.endDate);
    if (reservation.status === 'cancelled' || reservation.estado === 'CANCELADA') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelada
        </span>
      );
    }
    if (reservation.estado === 'FINALIZADA' || reservation.status === 'FINALIZADA' || (reservation.status === 'confirmed' && endDate < now)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completada
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Clock className="w-3 h-3 mr-1" />
        Activa
      </span>
    );
  };

  const canCancelReservation = (reservation) => {
    const now = new Date();
    const startDate = new Date(reservation.startDate);
    const hoursUntilStart = (startDate - now) / (1000 * 60 * 60);
    
    return reservation.status === 'confirmed' && hoursUntilStart > 24;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Reservas
          </h1>
          <p className="text-gray-600">
            Gestiona todas tus reservas de vehículos
          </p>
        </div>
        
        <Link
          to="/productos"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Reserva
        </Link>
      </div>

      {/* Pestañas de filtro */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'Todas', count: allReservations.length },
            { key: 'active', label: 'Activas', count: allReservations.filter(r => (r.estado === 'CONFIRMADA' || r.status === 'confirmed') && new Date(r.endDate) >= new Date()).length },
            { key: 'completed', label: 'Completadas', count: allReservations.filter(r => r.estado === 'FINALIZADA' || r.status === 'FINALIZADA').length },
            { key: 'cancelled', label: 'Canceladas', count: allReservations.filter(r => r.estado === 'CANCELADA' || r.status === 'cancelled').length }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Lista de reservas */}
      {filteredReservations.length === 0 ? (
        <div className="text-center py-12">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay reservas {selectedTab !== 'all' && `${selectedTab === 'active' ? 'activas' : selectedTab === 'completed' ? 'completadas' : 'canceladas'}`}
          </h3>
          <p className="text-gray-500 mb-6">
            {selectedTab === 'all' 
              ? 'Aún no has realizado ninguna reserva'
              : `No tienes reservas ${selectedTab === 'active' ? 'activas' : selectedTab === 'completed' ? 'completadas' : 'canceladas'} en este momento`
            }
          </p>
          <Link
            to="/productos"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Hacer una Reserva
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
            {filteredReservations.map((reservation) => (
              <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row">
                {/* Imagen del vehículo */}
                <div className="md:w-1/4 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r">
                  <img
                    src={reservation.vehicleImage || '/placeholder-car.jpg'}
                    alt={reservation.vehicleName || 'Vehículo'}
                    className="w-32 h-20 object-cover rounded-md"
                  />
                </div>
                {/* Info principal */}
                <div className="flex-1 p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {reservation.vehicleName}
                      </h3>
                      {getStatusBadge(reservation)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>
                        {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    {/* Botón Ver Detalles */}
                    <div className="mt-3">
                      <Link
                        to={`/reserva-confirmada/${reservation.id}`}
                        className="flex items-center px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                        style={{ width: 'auto', minWidth: 0, maxWidth: '200px' }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver Detalles
                      </Link>
                    </div>
                  </div>
                  {/* Columna derecha: Reseña o botón reseña */}
                  <div className="mt-4 md:mt-0 md:ml-8 flex flex-col items-end min-w-[180px]">
                    {/* Mostrar reseña si existe */}
                    {userReviews.some(r => r.reservaId === reservation.id) ? (
                      (() => {
                        const review = userReviews.find(r => r.reservaId === reservation.id);
                        const puntuacion = review?.puntuacion || 0;
                        return (
                          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-green-800 text-sm w-full mb-2">
                            <span className="block text-xs text-gray-700 mb-1">Tu reseña:</span>
                            <span className="flex items-center mb-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg key={i} className={`inline w-4 h-4 ${i < puntuacion ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><polygon points="9.9,1.1 7.6,6.6 1.6,7.6 6,11.9 4.9,17.9 9.9,14.9 14.9,17.9 13.8,11.9 18.2,7.6 12.2,6.6 "/></svg>
                              ))}
                            </span>
                            <button className="text-blue-600 underline font-medium" onClick={() => setOpenReviewModalId(reservation.id)}>
                              Ver reseña
                            </button>
                          </div>
                        );
                      })()
                    ) : reservation.estado === 'FINALIZADA' || reservation.status === 'FINALIZADA' ? (
                      <button
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm w-full mb-2"
                        onClick={() => {
                          setShowReviewForm(true);
                          setReviewReserva(reservation);
                        }}
                      >
                        Dejar Reseña
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      {/* Modal global para mostrar la reseña seleccionada */}
      {openReviewModalId && (
        <ReviewModal
          open={!!openReviewModalId}
          onClose={() => setOpenReviewModalId(null)}
          comentario={
            (userReviews.find(r => r.reservaId === openReviewModalId)?.comentario) || ''
          }
        />
      )}

      {/* Formulario de review modal fuera del map */}
      {showReviewForm && reviewReserva && (
        <ReviewSystem
          productId={reviewReserva.productId || reviewReserva.vehicleId || reviewReserva.productoId || reviewReserva.producto_id || reviewReserva.idProducto}
          reviews={[]}
          stats={{ averageRating: 0, totalReviews: 0, distribution: {} }}
          onAddReview={async (reviewData) => {
            // Forzar obtención de productId desde la reserva
            const productId =
              reviewReserva.productId ||
              reviewReserva.vehicleId ||
              reviewReserva.productoId ||
              reviewReserva.producto_id ||
              reviewReserva.idProducto;
            if (!productId) {
              alert('Error: No se pudo determinar el productId de la reserva. Contacta a soporte.');
              throw new Error('No se pudo determinar el productId de la reserva');
            }
            await reviewService.createReview({
              ...reviewData,
              reservaId: reviewReserva.id,
              productId,
              userId: user.id
            });
            setShowReviewForm(false);
            setReviewReserva(null);
            // Refrescar reviews del usuario
            const reviews = await reviewService.getReviewsByUser(user.id);
            setUserReviews(reviews);
          }}
          canUserReview={true}
          reservaIdParaReview={reviewReserva.id}
          showReviewForm={true}
        />
      )}
    </div>
  );
}
