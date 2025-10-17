import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Generar ID único para cada notificación
  const generateId = () => {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  };

  // Mostrar notificación
  const showNotification = useCallback((message, type = 'info', options = {}) => {
    const id = generateId();
    const notification = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      duration: options.duration || 5000,
      persistent: options.persistent || false,
      action: options.action || null,
      createdAt: new Date().toISOString(),
      ...options
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove si no es persistente
    if (!notification.persistent && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }

    return id;
  }, []);

  // Métodos de conveniencia para diferentes tipos
  const showSuccess = useCallback((message, options = {}) => {
    return showNotification(message, 'success', options);
  }, [showNotification]);

  const showError = useCallback((message, options = {}) => {
    return showNotification(message, 'error', options);
  }, [showNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return showNotification(message, 'warning', options);
  }, [showNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return showNotification(message, 'info', options);
  }, [showNotification]);

  // Remover notificación específica
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Limpiar todas las notificaciones
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Limpiar notificaciones por tipo
  const clearNotificationsByType = useCallback((type) => {
    setNotifications(prev => prev.filter(notification => notification.type !== type));
  }, []);

  // Notificaciones para operaciones de reserva
  const notifyReservationCreated = useCallback((reservationData) => {
    return showSuccess(
      `¡Reserva confirmada! Tu vehículo ${reservationData.vehicleName} está reservado.`,
      {
        duration: 7000,
        action: {
          label: 'Ver Reserva',
          onClick: () => window.location.href = '/reservas'
        }
      }
    );
  }, [showSuccess]);

  const notifyReservationCanceled = useCallback((reservationData) => {
    return showInfo(
      `Reserva cancelada: ${reservationData.vehicleName}`,
      { duration: 5000 }
    );
  }, [showInfo]);

  const notifyReservationError = useCallback((error) => {
    return showError(
      `Error en la reserva: ${error}`,
      { duration: 6000 }
    );
  }, [showError]);

  // Notificaciones para favoritos
  const notifyFavoriteAdded = useCallback((productName) => {
    return showSuccess(
      `${productName} agregado a favoritos`,
      {
        duration: 3000,
        action: {
          label: 'Ver Favoritos',
          onClick: () => window.location.href = '/mis-favoritos'
        }
      }
    );
  }, [showSuccess]);

  const notifyFavoriteRemoved = useCallback((productName) => {
    return showInfo(
      `${productName} eliminado de favoritos`,
      { duration: 3000 }
    );
  }, [showInfo]);

  // Notificaciones de autenticación
  const notifyLoginSuccess = useCallback((userName) => {
    return showSuccess(
      `¡Bienvenido de vuelta, ${userName}!`,
      { duration: 4000 }
    );
  }, [showSuccess]);

  const notifyLogoutSuccess = useCallback(() => {
    return showInfo(
      'Sesión cerrada correctamente',
      { duration: 3000 }
    );
  }, [showInfo]);

  const notifyAuthError = useCallback((error) => {
    return showError(
      `Error de autenticación: ${error}`,
      { duration: 5000 }
    );
  }, [showError]);

  // Notificaciones de conectividad
  const notifyOffline = useCallback(() => {
    return showWarning(
      'Sin conexión a internet. Algunas funciones pueden no estar disponibles.',
      { 
        persistent: true,
        action: {
          label: 'Reintentar',
          onClick: () => window.location.reload()
        }
      }
    );
  }, [showWarning]);

  const notifyOnline = useCallback(() => {
    // Primero eliminar notificaciones de offline
    clearNotificationsByType('warning');
    return showSuccess(
      'Conexión restaurada',
      { duration: 2000 }
    );
  }, [showSuccess, clearNotificationsByType]);

  // Obtener notificaciones activas
  const getActiveNotifications = useCallback(() => {
    return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notifications]);

  // Obtener estadísticas de notificaciones
  const getNotificationStats = useCallback(() => {
    const stats = {
      total: notifications.length,
      byType: {},
      persistent: 0,
      recent: 0 // últimos 5 minutos
    };

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    notifications.forEach(notification => {
      // Contar por tipo
      stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
      
      // Contar persistentes
      if (notification.persistent) {
        stats.persistent++;
      }
      
      // Contar recientes
      if (new Date(notification.createdAt) > fiveMinutesAgo) {
        stats.recent++;
      }
    });

    return stats;
  }, [notifications]);

  const value = {
    notifications: getActiveNotifications(),
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAllNotifications,
    clearNotificationsByType,
    // Métodos específicos para diferentes funcionalidades
    notifyReservationCreated,
    notifyReservationCanceled,
    notifyReservationError,
    notifyFavoriteAdded,
    notifyFavoriteRemoved,
    notifyLoginSuccess,
    notifyLogoutSuccess,
    notifyAuthError,
    notifyOffline,
    notifyOnline,
    // Utilidades
    getNotificationStats
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};