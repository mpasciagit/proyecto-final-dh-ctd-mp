import { useState, useEffect } from 'react';
import { productoCaracteristicaService } from '../services/productoCaracteristicaService';
import { caracteristicaService } from '../services/caracteristicaService';

/**
 * Hook personalizado para obtener las características completas de un producto
 * Combina datos de ProductoCaracteristica (con valores) y Caracteristica (con nombres, descripciones, iconos)
 */
export const useProductoCaracteristicas = (productoId) => {
    const [caracteristicas, setCaracteristicas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!productoId) {
            setCaracteristicas([]);
            setLoading(false);
            return;
        }

        const fetchCaracteristicas = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. Obtener las relaciones producto-característica (con valores)
                const productoCaracteristicas = await productoCaracteristicaService.findByProductoId(productoId);
                
                // 2. Obtener todas las características (con nombres, descripciones, iconos)
                const allCaracteristicas = await caracteristicaService.findAll();
                
                // 3. Crear un map para acceso rápido a características por ID
                const caracteristicasMap = new Map(
                    allCaracteristicas.map(c => [c.id, c])
                );
                
                // 4. Combinar los datos: ProductoCaracteristica + Caracteristica
                const caracteristicasCompletas = productoCaracteristicas.map(pc => {
                    const caracteristica = caracteristicasMap.get(pc.caracteristicaId);
                    
                    return {
                        id: pc.id,
                        productoId: pc.productoId,
                        caracteristicaId: pc.caracteristicaId,
                        valor: pc.valor, // ← El valor específico para este producto
                        // Datos de la característica
                        nombre: caracteristica?.nombre || 'Característica desconocida',
                        descripcion: caracteristica?.descripcion || '',
                        iconoUrl: caracteristica?.iconoUrl || null
                    };
                });

                setCaracteristicas(caracteristicasCompletas);
            } catch (err) {
                console.error('Error al cargar características del producto:', err);
                setError(err);
                setCaracteristicas([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCaracteristicas();
    }, [productoId]);

    return {
        caracteristicas,
        loading,
        error,
        // Función para refrescar los datos
        refetch: () => {
            if (productoId) {
                setLoading(true);
                const fetchCaracteristicas = async () => {
                    // ... (mismo código de arriba)
                };
                fetchCaracteristicas();
            }
        }
    };
};