import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const useAuthNotifications = () => {
  const { notifyLoginSuccess, notifyLogoutSuccess, notifyAuthError } = useNotification();

  const notifyLogin = (user) => {
    notifyLoginSuccess(user.firstName || user.nombre || 'Usuario');
  };

  const notifyLogout = () => {
    notifyLogoutSuccess();
  };

  const notifyError = (error) => {
    notifyAuthError(error);
  };

  return {
    notifyLogin,
    notifyLogout,
    notifyError
  };
};

// Alias para compatibilidad
export const useNotifications = () => {
  const { notifyLoginSuccess, notifyLogoutSuccess, notifyAuthError } = useNotification();

  return {
    showSuccess: notifyLoginSuccess,
    showError: notifyAuthError
  };
};