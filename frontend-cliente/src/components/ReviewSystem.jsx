import { useState, useEffect } from 'react';
import ReviewForm from './ReviewForm';
import { Star, ThumbsUp, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useAuthNotifications';

// Ahora acepta reservaIdParaReview opcional
const ReviewSystem = ({ productId, reviews, stats, onAddReview, canUserReview, reservaIdParaReview, showReviewForm: showReviewFormProp }) => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotifications();
  const [showReviewForm, setShowReviewForm] = useState(!!showReviewFormProp);

  // Sincroniza estado si cambia la prop
  useEffect(() => {
    if (typeof showReviewFormProp !== 'undefined') {
      setShowReviewForm(!!showReviewFormProp);
    }
  }, [showReviewFormProp]);

  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  // ⭐ Render de estrellas
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

  // 📅 Formato de fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // 🔍 Filtrar y ordenar reseñas (con fallback)
  const getFilteredAndSortedReviews = () => {
    let filteredReviews = [...(reviews || [])]; // ✅ Fallback de reviews

    if (filterBy !== 'all') {
      if (['5', '4', '3', '2', '1'].includes(filterBy)) {
        filteredReviews = filteredReviews.filter(review => review.rating === parseInt(filterBy));
      }
    }

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
        default:
          return 0;
      }
    });

    return filteredReviews;
  };

  const filteredReviews = getFilteredAndSortedReviews();

  if (showReviewForm) {
    return (
      <ReviewForm
        productId={productId}
        onSubmit={onAddReview}
        onCancel={() => setShowReviewForm(false)}
        user={user}
        reservaIdParaReview={reservaIdParaReview}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Reseñas de usuarios
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {renderStars(stats?.averageRating || 0, 'w-5 h-5')}
                <span className="text-lg font-semibold text-gray-900">
                  {stats?.averageRating || 0}
                </span>
                <span className="text-gray-500">
                  ({stats?.totalReviews || 0} reseñas)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              // Soporta ambos nombres de campo: distribution y ratingDistribution
              const count = (stats?.ratingDistribution?.[rating] ?? stats?.distribution?.[rating]) || 0;
              const percentage = (stats?.totalReviews || 0) > 0 ? (count / stats.totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <span className="text-sm text-gray-500">
        Mostrando {filteredReviews.length} de {stats?.totalReviews || 0} reseñas
      </span>

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
              No hay reseñas disponibles
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

// 🧩 ReviewCard (corregido)
const ReviewCard = ({ review, renderStars, formatDate }) => {

  // Avatar con inicial del nombre de usuario y color según inicial
  const getInitial = (name = '') => {
    if (!name || typeof name !== 'string') return 'U';
    return name.trim().charAt(0).toUpperCase();
  };

  const displayName = review.usuarioNombre || review.userName || 'Usuario';
  const initials = getInitial(displayName);

  // Paleta simple de colores Tailwind (pastel)
  const avatarColors = [
    { bg: 'bg-blue-100', text: 'text-blue-700' },
    { bg: 'bg-green-100', text: 'text-green-700' },
    { bg: 'bg-yellow-100', text: 'text-yellow-700' },
    { bg: 'bg-pink-100', text: 'text-pink-700' },
    { bg: 'bg-purple-100', text: 'text-purple-700' },
    { bg: 'bg-orange-100', text: 'text-orange-700' },
    { bg: 'bg-teal-100', text: 'text-teal-700' },
    { bg: 'bg-red-100', text: 'text-red-700' },
  ];
  // Asignar color según código ASCII de la inicial
  const colorIdx = initials.charCodeAt(0) % avatarColors.length;
  const avatarBg = avatarColors[colorIdx].bg;
  const avatarText = avatarColors[colorIdx].text;

  const [showFullComment, setShowFullComment] = useState(false);
  // Soporta ambos: comentario/comment
  const commentText = review.comentario || review.comment || '';
  const shouldTruncate = commentText.length > 300;
  const displayComment = showFullComment || !shouldTruncate
    ? commentText
    : commentText.substring(0, 300) + '...';

  // Fecha en formato dd/mm/aaaa
  const formatShortDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Soporta ambos: fechaCreacion/date
  const reviewDate = review.fechaCreacion || review.date;
  // Soporta ambos: puntuacion/rating
  const ratingValue = review.puntuacion ?? review.rating;

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg select-none ${avatarBg} ${avatarText}`}>
          {initials}
        </div>
        {/* Bloque derecho */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-1">
            <span className="text-xs text-gray-500 md:mb-0 mb-1">{formatShortDate(reviewDate)}</span>
            <h4 className="font-medium text-gray-900 md:mb-0 mb-1">{displayName}</h4>
            <div className="flex items-center gap-2">
              {renderStars(ratingValue)}
              <span className="text-sm text-gray-700 font-bold">({ratingValue})</span>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed break-words whitespace-pre-line">
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
      </div>
    </div>
  );
};

export default ReviewSystem;
