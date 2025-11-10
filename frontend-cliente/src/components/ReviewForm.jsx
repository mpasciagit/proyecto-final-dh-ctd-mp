import { useState } from 'react';
import { Star } from 'lucide-react';

export default function ReviewForm({ productId, reservaIdParaReview, user, onSubmit, onCancel }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        rating,
        comment,
        productId,
        reservaId: reservaIdParaReview,
        userId: user.id,
      });
    } catch (err) {
      setError('Error al enviar la reseña. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-600 bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Deja tu reseña</h2>
        <div className="flex items-center gap-2 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              className={
                star <= rating
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }
              aria-label={`Puntuar con ${star} estrellas`}
            >
              <Star className="w-8 h-8" fill={star <= rating ? '#facc15' : 'none'} />
            </button>
          ))}
        </div>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 min-h-[80px]"
          placeholder="Escribe tu comentario..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer"
            disabled={submitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            disabled={submitting || rating === 0 || comment.trim() === ''}
          >
            {submitting ? 'Enviando...' : 'Enviar reseña'}
          </button>
        </div>
      </form>
    </div>
  );
}
