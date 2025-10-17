import { createPortal } from 'react-dom';
import { useNotification } from '../context/NotificationContext';
import Toast from './Toast';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  // Si no hay notificaciones, no renderizar nada
  if (notifications.length === 0) {
    return null;
  }

  // Crear portal para renderizar las notificaciones fuera del DOM normal
  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Contenedor de notificaciones - esquina superior derecha */}
      <div className="absolute top-4 right-4 space-y-2 pointer-events-auto">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
      </div>
    </div>,
    document.body
  );
};

export default NotificationContainer;