import React from 'react';
import { Settings } from 'lucide-react';
import { useProductoCaracteristicas } from '../hooks/useProductoCaracteristicas';

/**
 * Componente para mostrar las características de un producto específico
 * Utiliza el hook useProductoCaracteristicas para obtener datos del backend
 */
const ProductoCaracteristicas = ({ 
    productoId, 
    maxItems = 3, 
    layout = 'list', // 'list' para listado | 'grid' para detalle
    showTitle = false 
}) => {
    const { caracteristicas, loading, error } = useProductoCaracteristicas(productoId);

    if (loading) {
        return (
            <div className="space-y-2 mb-3">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-center gap-2 animate-pulse">
                        <div className="w-4 h-4 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        console.error('❌ Error cargando características para producto', productoId, ':', error);
        // Fallback silencioso - mostrar mensaje genérico
        return (
            <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Settings className="w-4 h-4" />
                    <span>Características no disponibles</span>
                </div>
            </div>
        );
    }

    if (!caracteristicas || caracteristicas.length === 0) {
        return (
            <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Settings className="w-4 h-4" />
                    <span>Sin características especificadas</span>
                </div>
            </div>
        );
    }

    // Layout para listado de productos (compacto)
    if (layout === 'list') {
        return (
            <div className="space-y-2 mb-3">
                {caracteristicas.slice(0, maxItems).map((caracteristica) => (
                    <div key={caracteristica.id} className="flex items-center gap-2 text-sm text-slate-600">
                        {/* Mostrar ícono personalizado o fallback */}
                        {caracteristica.iconoUrl ? (
                            <img 
                                src={caracteristica.iconoUrl} 
                                alt={caracteristica.nombre}
                                className="w-4 h-4"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'inline';
                                }}
                            />
                        ) : null}
                        <Settings 
                            className="w-4 h-4" 
                            style={{ display: caracteristica.iconoUrl ? 'none' : 'inline' }} 
                        />
                        
                        {/* Mostrar el valor específico del producto */}
                        <span title={`${caracteristica.nombre}: ${caracteristica.descripcion}`}>
                            {caracteristica.valor}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    // Layout para detalle de producto (grid)
    return (
        <div>
            {showTitle && (
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Características</h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {caracteristicas.slice(0, maxItems).map((caracteristica) => (
                    <div key={caracteristica.id} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg text-center">
                        {/* Ícono más grande para el detalle */}
                        {caracteristica.iconoUrl ? (
                            <img 
                                src={caracteristica.iconoUrl} 
                                alt={caracteristica.nombre}
                                className="w-8 h-8"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'inline';
                                }}
                            />
                        ) : null}
                        <Settings 
                            className="w-8 h-8 text-gray-400" 
                            style={{ display: caracteristica.iconoUrl ? 'none' : 'inline' }} 
                        />
                        
                        <div>
                            <div className="text-gray-900 font-medium text-sm">
                                {caracteristica.nombre}
                            </div>
                            <div className="text-gray-600 text-xs mt-1">
                                {caracteristica.valor}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductoCaracteristicas;