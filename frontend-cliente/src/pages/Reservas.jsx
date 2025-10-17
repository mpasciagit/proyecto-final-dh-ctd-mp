import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Car, Clock, CheckCircle, XCircle, Eye, Plus } from 'lucide-react';
import { useReservations } from '../context/ReservationContext';

export default function Reservas() {
  const { getReservationHistory, cancelReservation, isLoading } = useReservations();
  const [selectedTab, setSelectedTab] = useState('all'); // all, active, completed, cancelled
  const [cancelingId, setCancelingId] = useState(null);

  const allReservations = getReservationHistory();

  // Filtrar reservas según la pestaña seleccionada
  const filteredReservations = allReservations.filter(reservation => {
    const now = new Date();
    const endDate = new Date(reservation.endDate);
    
    switch (selectedTab) {
      case 'active':
        return reservation.status === 'confirmed' && endDate >= now;
      case 'completed':
        return reservation.status === 'confirmed' && endDate < now;
      case 'cancelled':
        return reservation.status === 'cancelled';
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
    
    if (reservation.status === 'cancelled') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelada
        </span>
      );
    }
    
    if (endDate < now) {
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
            { key: 'active', label: 'Activas', count: allReservations.filter(r => r.status === 'confirmed' && new Date(r.endDate) >= new Date()).length },
            { key: 'completed', label: 'Completadas', count: allReservations.filter(r => r.status === 'confirmed' && new Date(r.endDate) < new Date()).length },
            { key: 'cancelled', label: 'Canceladas', count: allReservations.filter(r => r.status === 'cancelled').length }
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
            <div key={reservation.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  
                  {/* Información principal */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4 lg:mb-0">
                      <img
                        src={reservation.vehicleImage}
                        alt={reservation.vehicleName}
                        className="w-20 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {reservation.vehicleName}
                          </h3>
                          {getStatusBadge(reservation)}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>
                              {new Date(reservation.startDate).toLocaleDateString()} - {new Date(reservation.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="truncate">{reservation.pickupLocation}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{reservation.totalDays} {reservation.totalDays === 1 ? 'día' : 'días'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-blue-600">
                              ${reservation.totalPrice}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-xs text-gray-500">
                            <strong>Código:</strong> {reservation.confirmationCode} | 
                            <strong> Reservado:</strong> {new Date(reservation.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-3 mt-4 lg:mt-0 lg:ml-6">
                    <Link
                      to={`/reserva-confirmada/${reservation.id}`}
                      className="flex items-center px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalles
                    </Link>
                    
                    {canCancelReservation(reservation) && (
                      <button
                        onClick={() => handleCancelReservation(reservation.id)}
                        disabled={cancelingId === reservation.id}
                        className="flex items-center px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancelingId === reservation.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-1"></div>
                        ) : (
                          <XCircle className="w-4 h-4 mr-1" />
                        )}
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
