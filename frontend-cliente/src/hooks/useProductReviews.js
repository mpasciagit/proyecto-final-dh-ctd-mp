import { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';

/**
 * Hook personalizado para manejar reviews de un producto específico
 * Proporciona reviews formateadas y estadísticas calculadas
 */
export const useProductReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    verifiedCount: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReviews = async () => {
    if (!productId) return;
    
    try {
      setLoading(true);
      setError(null);

      // Cargar reviews formateadas del producto
      const productReviews = await reviewService.getFormattedReviewsByProduct(productId);
      setReviews(productReviews);

      // Calcular estadísticas
      if (productReviews.length > 0) {
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / productReviews.length;
        
        // Distribución de calificaciones
        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        productReviews.forEach(review => {
          distribution[review.rating]++;
        });

        // Contar reviews verificadas (simulado - el backend no tiene este campo)
        const verifiedCount = productReviews.filter(review => review.verified).length;

        setStats({
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews: productReviews.length,
          verifiedCount,
          distribution
        });
      } else {
        setStats({
          averageRating: 0,
          totalReviews: 0,
          verifiedCount: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
      }
    } catch (err) {
      console.error('Error al cargar reviews del producto:', err);
      setError(err.message || 'Error al cargar reviews');
      setReviews([]);
      setStats({
        averageRating: 0,
        totalReviews: 0,
        verifiedCount: 0,
        distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  return {
    reviews,
    stats,
    loading,
    error,
    refetch: loadReviews
  };
};