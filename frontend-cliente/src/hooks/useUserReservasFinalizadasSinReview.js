import { useState, useEffect } from 'react';
import reservaService from '../services/reservationService';
import reviewService from '../services/reviewService';

/**
 * Hook para saber si el usuario tiene reservas FINALIZADAS de un producto sin review
 * Devuelve true si puede dejar review, false si no
 */
export const useUserReservasFinalizadasSinReview = (userId, productId) => {
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      setLoading(true);
      if (!userId || !productId) {
        setCanReview(false);
        setLoading(false);
        return;
      }
      try {
        // 1. Traer reservas FINALIZADAS del usuario para ese producto
        const reservas = await reservaService.getReservasByUser(userId);
        const finalizadas = reservas.filter(r => r.productoId === productId && r.estado === 'FINALIZADA');
        if (finalizadas.length === 0) {
          setCanReview(false);
          setLoading(false);
          return;
        }
        // 2. Traer reviews del usuario para ese producto
        const userReviews = await reviewService.getReviewsByUser(userId);
        // 3. Verificar si alguna reserva finalizada NO tiene review
        const reservaIdsConReview = userReviews.map(r => r.reservaId);
        const puede = finalizadas.some(res => !reservaIdsConReview.includes(res.id));
        setCanReview(puede);
      } catch (e) {
        setCanReview(false);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [userId, productId]);

  return { canReview, loading };
};
