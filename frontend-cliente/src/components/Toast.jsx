import { useEffect, useState } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info, ExternalLink } from 'lucide-react';

const Toast = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Mostrar toast con animación
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300);
  };

  const handleAction = () => {
    if (notification.action?.onClick) {
      notification.action.onClick();
      handleRemove();
    }
  };

  // Configuración de estilos por tipo
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-500',
      textColor: 'text-green-800',
      progressColor: 'bg-green-500'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-500',
      textColor: 'text-red-800',
      progressColor: 'bg-red-500'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-500',
      textColor: 'text-yellow-800',
      progressColor: 'bg-yellow-500'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-800',
      progressColor: 'bg-blue-500'
    }
  };

  const config = typeConfig[notification.type] || typeConfig.info;
  const IconComponent = config.icon;

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out mb-4
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${config.bgColor} ${config.borderColor} border rounded-lg shadow-lg
        min-w-80 max-w-md overflow-hidden
      `}
    >
      {/* Contenido principal */}
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
          </div>
          
          <div className="ml-3 flex-1">
            <p className={`text-sm font-medium ${config.textColor}`}>
              {notification.message}
            </p>
            
            {/* Timestamp */}
            <p className="mt-1 text-xs text-gray-500">
              {new Date(notification.createdAt).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Botón de cerrar */}
          {!notification.persistent && (
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={handleRemove}
                className={`
                  inline-flex rounded-md p-1.5 transition-colors
                  ${config.textColor} hover:bg-white/50 focus:outline-none 
                  focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
                `}
              >
                <span className="sr-only">Cerrar</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Botón de acción */}
        {notification.action && (
          <div className="mt-3">
            <button
              onClick={handleAction}
              className={`
                inline-flex items-center px-3 py-1.5 border border-transparent 
                text-xs font-medium rounded-md transition-colors
                ${notification.type === 'success' 
                  ? 'text-green-700 bg-green-100 hover:bg-green-200' 
                  : notification.type === 'error'
                  ? 'text-red-700 bg-red-100 hover:bg-red-200'
                  : notification.type === 'warning'
                  ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200'
                  : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                }
              `}
            >
              {notification.action.label}
              {notification.action.external && (
                <ExternalLink className="ml-1 h-3 w-3" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Barra de progreso (solo para notificaciones con duración) */}
      {!notification.persistent && notification.duration > 0 && (
        <div className="h-1 bg-gray-200">
          <div
            className={`h-full ${config.progressColor} animate-progress`}
            style={{
              animation: `progress ${notification.duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Toast;