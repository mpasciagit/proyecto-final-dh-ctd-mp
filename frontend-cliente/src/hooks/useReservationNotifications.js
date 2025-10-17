import { useNotification } from '../context/NotificationContext';

export const useReservationNotifications = () => {
  const { notifyReservationCreated, notifyReservationCanceled, notifyReservationError } = useNotification();

  const notifyCreated = (reservationData) => {
    notifyReservationCreated(reservationData);
  };

  const notifyCanceled = (reservationData) => {
    notifyReservationCanceled(reservationData);
  };

  const notifyError = (message) => {
    notifyReservationError(message);
  };

  return {
    notifyCreated,
    notifyCanceled,
    notifyError
  };
};