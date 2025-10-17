import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ReservationContext = createContext();

export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
};

export const ReservationProvider = ({ children }) => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const RESERVATIONS_KEY = 'user_reservations';

  // Cargar reservas del usuario desde localStorage
  useEffect(() => {
    if (user) {
      const savedReservations = localStorage.getItem(`${RESERVATIONS_KEY}_${user.id}`);
      if (savedReservations) {
        setReservations(JSON.parse(savedReservations));
      }
    } else {
      setReservations([]);
    }
  }, [user]);

  // Guardar reservas en localStorage cuando cambien
  const saveReservations = (newReservations) => {
    if (user) {
      localStorage.setItem(`${RESERVATIONS_KEY}_${user.id}`, JSON.stringify(newReservations));
      setReservations(newReservations);
    }
  };

  // Crear nueva reserva
  const createReservation = async (reservationData) => {
    if (!user) {
      throw new Error('Usuario debe estar autenticado');
    }

    setIsLoading(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newReservation = {
        id: Date.now(),
        userId: user.id,
        vehicleId: reservationData.vehicleId,
        vehicleName: reservationData.vehicleName,
        vehicleImage: reservationData.vehicleImage,
        startDate: reservationData.startDate,
        endDate: reservationData.endDate,
        pickupLocation: reservationData.pickupLocation,
        dropoffLocation: reservationData.dropoffLocation,
        totalDays: reservationData.totalDays,
        dailyPrice: reservationData.dailyPrice,
        totalPrice: reservationData.totalPrice,
        customerInfo: {
          firstName: reservationData.firstName || user.firstName,
          lastName: reservationData.lastName || user.lastName,
          email: reservationData.email || user.email,
          phone: reservationData.phone || user.phone,
          driverLicense: reservationData.driverLicense,
          emergencyContact: reservationData.emergencyContact,
        },
        additionalServices: reservationData.additionalServices || [],
        specialRequests: reservationData.specialRequests || '',
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        confirmationCode: generateConfirmationCode()
      };

      const updatedReservations = [...reservations, newReservation];
      saveReservations(updatedReservations);

      return { success: true, reservation: newReservation };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar reserva
  const cancelReservation = async (reservationId) => {
    setIsLoading(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedReservations = reservations.map(reservation => 
        reservation.id === reservationId 
          ? { ...reservation, status: 'cancelled', cancelledAt: new Date().toISOString() }
          : reservation
      );

      saveReservations(updatedReservations);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener reserva por ID
  const getReservationById = (reservationId) => {
    return reservations.find(reservation => reservation.id === parseInt(reservationId));
  };

  // Obtener reservas activas (confirmadas y futuras)
  const getActiveReservations = () => {
    const now = new Date();
    return reservations.filter(reservation => 
      reservation.status === 'confirmed' && 
      new Date(reservation.endDate) >= now
    );
  };

  // Obtener historial completo
  const getReservationHistory = () => {
    return reservations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  // Verificar disponibilidad de vehículo en fechas específicas
  const checkVehicleAvailability = (vehicleId, startDate, endDate) => {
    const conflictingReservations = reservations.filter(reservation => 
      reservation.vehicleId === vehicleId && 
      reservation.status === 'confirmed' &&
      (
        (new Date(startDate) >= new Date(reservation.startDate) && new Date(startDate) < new Date(reservation.endDate)) ||
        (new Date(endDate) > new Date(reservation.startDate) && new Date(endDate) <= new Date(reservation.endDate)) ||
        (new Date(startDate) <= new Date(reservation.startDate) && new Date(endDate) >= new Date(reservation.endDate))
      )
    );

    return conflictingReservations.length === 0;
  };

  // Generar código de confirmación
  const generateConfirmationCode = () => {
    const prefix = 'CR';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  // Calcular precio total
  const calculateTotalPrice = (dailyPrice, startDate, endDate, additionalServices = []) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    const basePrice = dailyPrice * days;
    const servicesPrice = additionalServices.reduce((total, service) => total + service.price, 0);
    
    return {
      days,
      basePrice,
      servicesPrice,
      totalPrice: basePrice + servicesPrice
    };
  };

  const value = {
    reservations,
    isLoading,
    createReservation,
    cancelReservation,
    getReservationById,
    getActiveReservations,
    getReservationHistory,
    checkVehicleAvailability,
    calculateTotalPrice
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};