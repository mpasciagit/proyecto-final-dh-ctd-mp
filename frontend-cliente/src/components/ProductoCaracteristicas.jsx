import React from 'react';
import { Settings } from 'lucide-react';


/**
 * Componente para mostrar las características de un producto específico
/**
 * Componente para mostrar las características de un producto específico
 * Ahora recibe el array de características directamente como prop
 */
const ProductoCaracteristicas = ({
    caracteristicas = [],
    maxItems = 3,
    layout = 'list', // 'list' para listado | 'grid' para detalle
    showTitle = false
}) => {
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
                        {caracteristica.caracteristicaIconoUrl ? (
                            <img
                                src={caracteristica.caracteristicaIconoUrl}
                                alt={caracteristica.caracteristicaNombre}
                                className="w-4 h-4"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'inline';
                                }}
                            />
                        ) : null}
                        <Settings
                            className="w-4 h-4"
                            style={{ display: caracteristica.caracteristicaIconoUrl ? 'none' : 'inline' }}
                        />
                        {/* Mostrar el valor específico del producto */}
                        <span title={`${caracteristica.caracteristicaNombre}`}>{caracteristica.valor}</span>
                    </div>
                ))}
            </div>
        );
    }

    // Layout para detalle (grid)
    return (
        <div>
            {showTitle && (
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Características</h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {caracteristicas.slice(0, maxItems).map((caracteristica) => (
                    <div key={caracteristica.id} className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg text-center">
                        {/* Ícono más grande para el detalle */}
                        {caracteristica.caracteristicaIconoUrl ? (
                            <img
                                src={caracteristica.caracteristicaIconoUrl}
                                alt={caracteristica.caracteristicaNombre}
                                className="w-8 h-8"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'inline';
                                }}
                            />
                        ) : null}
                        <Settings
                            className="w-8 h-8 text-gray-400"
                            style={{ display: caracteristica.caracteristicaIconoUrl ? 'none' : 'inline' }}
                        />
                        <div>
                            <div className="text-gray-900 font-medium text-sm">
                                {caracteristica.caracteristicaNombre}
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