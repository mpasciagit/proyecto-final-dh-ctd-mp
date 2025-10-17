import React from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // En producción, aquí enviarías el error a un servicio de monitoring
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = import.meta.env.DEV;
      
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-lg w-full">
            {/* Error Card */}
            <div className="bg-white rounded-lg shadow-lg border border-red-200 overflow-hidden">
              {/* Header */}
              <div className="bg-red-50 px-6 py-4 border-b border-red-200">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold text-red-900">
                      ¡Oops! Algo salió mal
                    </h1>
                    <p className="text-sm text-red-700 mt-1">
                      Ha ocurrido un error inesperado en la aplicación
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    No te preocupes, estos errores nos ayudan a mejorar la aplicación. 
                    Intenta alguna de estas opciones:
                  </p>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={this.handleReload}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Recargar página
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={this.handleGoBack}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                      </button>

                      <button
                        onClick={this.handleGoHome}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Home className="w-4 h-4" />
                        Inicio
                      </button>
                    </div>
                  </div>

                  {/* Development Error Details */}
                  {isDevelopment && this.state.error && (
                    <details className="mt-6">
                      <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-3 hover:text-gray-900">
                        Ver detalles técnicos (desarrollo)
                      </summary>
                      <div className="bg-gray-100 rounded-lg p-4 text-xs font-mono">
                        <div className="mb-3">
                          <span className="font-semibold text-red-600">Error:</span>
                          <pre className="mt-1 whitespace-pre-wrap text-red-800">
                            {this.state.error.toString()}
                          </pre>
                        </div>
                        
                        {this.state.errorInfo && (
                          <div>
                            <span className="font-semibold text-gray-700">Stack Trace:</span>
                            <pre className="mt-1 whitespace-pre-wrap text-gray-600 text-xs overflow-x-auto">
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </div>
                        )}
                      </div>
                    </details>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Si el problema persiste, contacta con el soporte técnico
                </p>
              </div>
            </div>

            {/* Additional Help */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Código de error: <span className="font-mono">ERR_{Date.now()}</span>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para capturar errores en componentes funcionales
export const useErrorHandler = () => {
  const handleError = (error, errorInfo) => {
    console.error('Error capturado:', error, errorInfo);
    
    // En producción, enviar a servicio de monitoring
    if (!import.meta.env.DEV) {
      // Ejemplo: Sentry.captureException(error);
    }
  };

  return handleError;
};

// Componente wrapper para páginas individuales
export const PageErrorBoundary = ({ children, fallback }) => {
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;