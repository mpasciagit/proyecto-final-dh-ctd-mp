import { useState } from 'react';
import { Star, ThumbsUp, CheckCircle, User, MessageSquare, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useAuthNotifications';

const ReviewSystem = ({ productId, reviews, stats, onAddReview, canUserReview }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest, helpful
  const [filterBy, setFilterBy] = useState('all'); // all, verified, 5, 4, 3, 2, 1

  // Función para renderizar estrellas
  const renderStars = (rating, size = 'w-4 h-4') => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className={`${size} fill-yellow-400 text-yellow-400`} />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className={`${size} text-gray-300`} />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className={`${size} fill-yellow-400 text-yellow-400`} />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className={`${size} text-gray-300`} />
      );
    }

    return stars;
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Función para filtrar y ordenar reseñas
  const getFilteredAndSortedReviews = () => {
    let filteredReviews = [...reviews];

    // Aplicar filtros
    if (filterBy !== 'all') {
      if (filterBy === 'verified') {
        filteredReviews = filteredReviews.filter(review => review.verified);
      } else if (['5', '4', '3', '2', '1'].includes(filterBy)) {
        filteredReviews = filteredReviews.filter(review => review.rating === parseInt(filterBy));
      }
    }

    // Aplicar ordenamiento
    filteredReviews.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

    return filteredReviews;
  };

  const filteredReviews = getFilteredAndSortedReviews();

  return (
    <div className="space-y-6">
      {/* Header de reseñas */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Reseñas de usuarios
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {renderStars(stats.averageRating, 'w-5 h-5')}
                <span className="text-lg font-semibold text-gray-900">
                  {stats.averageRating}
                </span>
                <span className="text-gray-500">
                  ({stats.totalReviews} reseñas)
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>{stats.verifiedCount} verificadas</span>
              </div>
            </div>
          </div>

          {/* Botón para escribir reseña */}
          {user && canUserReview && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Escribir reseña
            </button>
          )}
        </div>

        {/* Distribución de calificaciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = stats.distribution[rating];
              const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filtros y ordenamiento */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="highest">Mejor valorados</option>
            <option value="lowest">Menor valoración</option>
            <option value="helpful">Más útiles</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filtrar:</span>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todas las reseñas</option>
            <option value="verified">Solo verificadas</option>
            <option value="5">5 estrellas</option>
            <option value="4">4 estrellas</option>
            <option value="3">3 estrellas</option>
            <option value="2">2 estrellas</option>
            <option value="1">1 estrella</option>
          </select>
        </div>

        <span className="text-sm text-gray-500">
          Mostrando {filteredReviews.length} de {stats.totalReviews} reseñas
        </span>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              renderStars={renderStars}
              formatDate={formatDate}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Star className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay reseñas con estos filtros
            </h3>
            <p className="text-gray-500">
              Intenta cambiar los filtros para ver más reseñas.
            </p>
          </div>
        )}
      </div>

      {/* Formulario de nueva reseña */}
      {showReviewForm && (
        <ReviewForm
          productId={productId}
          onSubmit={onAddReview}
          onCancel={() => setShowReviewForm(false)}
          user={user}
        />
      )}
    </div>
  );
};

// Componente individual de reseña
const ReviewCard = ({ review, renderStars, formatDate }) => {
  const [showFullComment, setShowFullComment] = useState(false);
  const [helpful, setHelpful] = useState(review.helpful);
  const [hasMarkedHelpful, setHasMarkedHelpful] = useState(false);

  const handleMarkHelpful = () => {
    if (!hasMarkedHelpful) {
      setHelpful(helpful + 1);
      setHasMarkedHelpful(true);
    }
  };

  const shouldTruncate = review.comment.length > 300;
  const displayComment = showFullComment || !shouldTruncate 
    ? review.comment 
    : review.comment.substring(0, 300) + '...';

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      {/* Header de la reseña */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={review.userAvatar}
          alt={review.userName}
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100';
          }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">{review.userName}</h4>
            {review.verified && (
              <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <CheckCircle className="w-3 h-3" />
                <span>Compra verificada</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {renderStars(review.rating)}
            </div>
            <span className="text-sm text-gray-500">
              {formatDate(review.date)}
            </span>
          </div>
          {review.title && (
            <h5 className="font-medium text-gray-900 mb-2">
              {review.title}
            </h5>
          )}
        </div>
      </div>

      {/* Contenido de la reseña */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">
          {displayComment}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setShowFullComment(!showFullComment)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
          >
            {showFullComment ? 'Ver menos' : 'Ver más'}
          </button>
        )}
      </div>

      {/* Fotos de la reseña */}
      {review.photos && review.photos.length > 0 && (
        <div className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {review.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Foto ${index + 1} de la reseña`}
                className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Acciones de la reseña */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={handleMarkHelpful}
          disabled={hasMarkedHelpful}
          className={`flex items-center gap-2 text-sm transition-colors ${
            hasMarkedHelpful 
              ? 'text-green-600 cursor-default' 
              : 'text-gray-600 hover:text-green-600 cursor-pointer'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${hasMarkedHelpful ? 'fill-current' : ''}`} />
          <span>Útil ({helpful})</span>
        </button>

        <span className="text-xs text-gray-400">
          Reseña #{review.id}
        </span>
      </div>
    </div>
  );
};

// Formulario para nueva reseña
const ReviewForm = ({ productId, onSubmit, onCancel, user }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    photos: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showSuccess, showError } = useNotifications();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.comment.trim()) {
      showError('Por favor escribe un comentario');
      return;
    }

    if (formData.comment.length < 10) {
      showError('El comentario debe tener al menos 10 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        productId: parseInt(productId),
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userAvatar: user.avatar,
        rating: formData.rating,
        title: formData.title.trim(),
        comment: formData.comment.trim(),
        photos: formData.photos
      };

      await onSubmit(reviewData);
      showSuccess('¡Reseña enviada exitosamente!');
      onCancel();
    } catch (error) {
      showError('Error al enviar la reseña. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Escribir reseña
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Calificación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calificación *
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({...formData, rating})}
                  className="p-1 transition-colors"
                >
                  <Star 
                    className={`w-8 h-8 ${
                      rating <= formData.rating 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {formData.rating} de 5 estrellas
              </span>
            </div>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título de la reseña
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Ej: Excelente vehículo para viajes largos"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={100}
            />
          </div>

          {/* Comentario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu experiencia * (mínimo 10 caracteres)
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
              placeholder="Cuéntanos sobre tu experiencia con este vehículo..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={1000}
              required
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.comment.length}/1000 caracteres
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.comment.trim() || formData.comment.length < 10}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar reseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewSystem;