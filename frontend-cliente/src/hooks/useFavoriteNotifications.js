import { useNotification } from '../context/NotificationContext';

export const useFavoriteNotifications = () => {
  const { notifyFavoriteAdded, notifyFavoriteRemoved, showError } = useNotification();

  const notifyAdded = (productName) => {
    notifyFavoriteAdded(productName);
  };

  const notifyRemoved = (productName) => {
    notifyFavoriteRemoved(productName);
  };

  const notifyError = (message) => {
    showError(message);
  };

  return {
    notifyAdded,
    notifyRemoved,
    notifyError
  };
};