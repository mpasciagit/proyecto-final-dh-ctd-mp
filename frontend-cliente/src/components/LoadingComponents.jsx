// 🔄 Componentes de Loading y Error para integración backend
import { AlertCircle, Loader2 } from 'lucide-react';

// Loading Spinner
export const LoadingSpinner = ({ size = 'medium', text = 'Cargando...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500 mb-2`} />
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
};

// Error Message
export const ErrorMessage = ({ message = 'Ha ocurrido un error', onRetry = null }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
      <p className="text-red-700 text-center mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Reintentar
        </button>
      )}
    </div>
  );
};

// Loading para página completa
export const PageLoading = ({ text = 'Cargando productos...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="large" text={text} />
    </div>
  );
};

// Loading para lista de productos
export const ProductsLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
          <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
          <div className="space-y-2">
            <div className="bg-gray-300 h-4 rounded w-3/4"></div>
            <div className="bg-gray-300 h-4 rounded w-1/2"></div>
            <div className="bg-gray-300 h-6 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default { LoadingSpinner, ErrorMessage, PageLoading, ProductsLoading };