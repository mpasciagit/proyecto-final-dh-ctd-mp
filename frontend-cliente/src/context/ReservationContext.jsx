import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import reservationService from '../services/reservationService';

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

  // Cargar reservas del usuario desde backend
  useEffect(() => {
    if (user) {
      loadUserReservations();
    } else {
      setReservations([]);
    }
  }, [user]);

  // 📋 Cargar reservas del usuario desde el backend
  const loadUserReservations = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const userReservations = await reservationService.getReservationsByUser(user.id);
      // Plan A: Mantener fechas como strings (YYYY-MM-DD)
      const reservationsWithStringDates = userReservations.map(reservation => ({
        ...reservation,
        startDate: reservation.fechaInicio || '',
        endDate: reservation.fechaFin || '',
        // Para compatibilidad, mantener también los campos originales
        fechaInicio: reservation.fechaInicio || '',
        fechaFin: reservation.fechaFin || ''
      }));
      setReservations(reservationsWithStringDates);
    } catch (error) {
      console.error('❌ Error al cargar reservas:', error);
      setReservations([]);
    } finally {
      setIsLoading(false);
    }
  };


  // Guardar reservas (ya no se usa localStorage)
  const saveReservations = (newReservations) => {
    setReservations(newReservations);
  };

  // Crear nueva reserva
  const createReservation = async (reservationData) => {
    if (!user) {
      throw new Error('Usuario debe estar autenticado');
    }

    setIsLoading(true);

    try {
      // 📤 Preparar datos para el backend
      const backendData = {
        startDate: reservationData.startDate,
        endDate: reservationData.endDate,
        userId: user.id,
        productId: reservationData.vehicleId,
        status: 'PENDIENTE'
      };

      const newReservation = await reservationService.createReservation(backendData);
      
      // 🔄 Recargar reservas del usuario para tener datos actualizados
      await loadUserReservations();

      return { success: true, reservation: newReservation };
    } catch (error) {
      console.error('❌ Error al crear reserva:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar reserva
  const cancelReservation = async (reservationId) => {
    setIsLoading(true);

    try {
      // 🚫 Cancelar reserva en el backend
      await reservationService.cancelReservation(reservationId);
      
      // 🔄 Recargar reservas para tener datos actualizados
      await loadUserReservations();

      return { success: true };
    } catch (error) {
      console.error('❌ Error al cancelar reserva:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener reserva por ID
  const getReservationById = async (reservationId) => {
    try {
      // 🔍 Buscar primero en las reservas cargadas
      const localReservation = reservations.find(reservation => reservation.id === parseInt(reservationId));
      if (localReservation) {
        return localReservation;
      }

      // 📡 Si no está en memoria, consultar al backend
      const reservation = await reservationService.getReservationById(reservationId);
      // Plan A: Mantener fechas como strings
      if (reservation) {
        return {
          ...reservation,
          startDate: reservation.fechaInicio || '',
          endDate: reservation.fechaFin || '',
          fechaInicio: reservation.fechaInicio || '',
          fechaFin: reservation.fechaFin || ''
        };
      }
      return reservation;
    } catch (error) {
      console.error('❌ Error al obtener reserva por ID:', error);
      return null;
    }
  };

  // Obtener reservas activas (confirmadas y futuras)
  const getActiveReservations = () => {
    // Plan A: Comparar fechas como strings (YYYY-MM-DD)
    const todayStr = new Date().toISOString().split('T')[0];
    return reservations.filter(reservation =>
      reservation.status === 'confirmed' &&
      reservation.endDate >= todayStr
    );
  };

  // Obtener historial completo
  const getReservationHistory = () => {
    // Plan A: Ordenar por string (YYYY-MM-DD) si createdAt es string, si no, mantener lógica
    return reservations.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.localeCompare(a.createdAt);
      }
      return 0;
    });
  };

  // Verificar disponibilidad de vehículo en fechas específicas
  const checkVehicleAvailability = (vehicleId, startDate, endDate) => {
    // Plan A: Comparar fechas como strings (YYYY-MM-DD)
    const conflictingReservations = reservations.filter(reservation =>
      reservation.vehicleId === vehicleId &&
      reservation.status === 'confirmed' &&
      (
        (startDate >= reservation.startDate && startDate < reservation.endDate) ||
        (endDate > reservation.startDate && endDate <= reservation.endDate) ||
        (startDate <= reservation.startDate && endDate >= reservation.endDate)
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
    // Plan A: Parsear solo para cálculo, no para guardar
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