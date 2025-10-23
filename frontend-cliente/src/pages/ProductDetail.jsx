import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Share2, 
  MapPin, 
  Users, 
  Calendar, 
  Fuel, 
  Settings, 
  CheckCircle,
  Star,
  Camera,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import ProductoCaracteristicas from "../components/ProductoCaracteristicas";
import { FavoriteButton, ReviewSystem } from "../components";
import { productService } from "../services/productService";
import reviewService from "../services/reviewService";
import { useProductReviews } from "../hooks/useProductReviews";
import { useUserReservasFinalizadasSinReview } from "../hooks/useUserReservasFinalizadasSinReview";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDates, setSelectedDates] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // El hook ahora determina si el usuario puede dejar review y cuál reserva usar
  const [reservaIdParaReview, setReservaIdParaReview] = useState(null);
  
  // Estados para datos del backend
  const [producto, setProducto] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hook para reviews del backend
  const { reviews, stats: reviewStats, loading: reviewsLoading, refetch: refetchReviews } = useProductReviews(producto?.id);
  
  // Debug temporal - verificar datos de reviews
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      console.log('🔍 Reviews cargadas del backend:', reviews);
      console.log('📊 Stats calculadas:', reviewStats);
    }
  }, [reviews, reviewStats]);

  // Cargar producto e imágenes del backend
  useEffect(() => {
    const fetchProductoEImagenes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar producto y sus imágenes en paralelo
        const [productData, imagenesData] = await Promise.all([
          productService.getProductById(parseInt(id)),
          productService.getProductImages(parseInt(id))
        ]);
        
        setProducto(productData);
        setImagenes(imagenesData.sort((a, b) => (a.orden || 0) - (b.orden || 0))); // Ordenar por campo 'orden'
        
        console.log('Producto cargado:', productData);
        console.log('Imágenes cargadas:', imagenesData);
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Error al cargar el producto. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductoEImagenes();
    }
  }, [id]);

  // Usar el nuevo hook para saber si el usuario puede dejar review y obtener la reservaId
  const { canReview: userCanReview, loading: loadingCanReview } = useUserReservasFinalizadasSinReview(user?.id, producto?.id);
  // Además, obtener la reserva FINALIZADA sin review para pasar su id al crear la review
  useEffect(() => {
    const fetchReservaId = async () => {
      if (!user || !producto) {
        setReservaIdParaReview(null);
        return;
      }
      try {
        const reservas = await reviewService.reservationService.getReservasByUser(user.id);
        const finalizadas = reservas.filter(r => r.productoId === producto.id && r.estado === 'FINALIZADA');
        const userReviews = await reviewService.getReviewsByUser(user.id);
        const reservaIdsConReview = userReviews.map(r => r.reservaId);
        const sinReview = finalizadas.find(res => !reservaIdsConReview.includes(res.id));
        setReservaIdParaReview(sinReview ? sinReview.id : null);
      } catch {
        setReservaIdParaReview(null);
      }
    };
    fetchReservaId();
  }, [user, producto]);

  const handleAddReview = async (reviewData) => {
    try {
      if (!reservaIdParaReview) throw new Error('No hay reserva FINALIZADA sin review disponible');
      const newReview = await reviewService.createReview({
        rating: reviewData.rating,
        comment: reviewData.comment,
        userId: user.id,
        productId: producto.id,
        reservaId: reservaIdParaReview
      });
      refetchReviews();
      setReservaIdParaReview(null);
      return newReview;
    } catch (error) {
      console.error('Error al crear review:', error);
      throw error;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: producto.nombre,
        text: `Mira este increíble vehículo: ${producto.nombre}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Aquí podrías mostrar una notificación de "enlace copiado"
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  const nextImage = () => {
    if (imagenes && imagenes.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === imagenes.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (imagenes && imagenes.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? imagenes.length - 1 : prev - 1
      );
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar el producto</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/productos')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver a productos
          </button>
        </div>
      </div>
    );
  }

  // Producto no encontrado
  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-4">El producto que buscas no existe o ha sido removido.</p>
          <button 
            onClick={() => navigate('/productos')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver todos los productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header del producto */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{producto.nombre}</h1>
          <div className="flex items-center gap-4 mb-2">
            <p className="text-lg text-gray-600">{producto.ubicacion || 'Ubicación no especificada'}</p>
            {reviewStats.totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(reviewStats.averageRating)}
                </div>
                <span className="text-sm text-gray-600">
                  {reviewStats.averageRating} ({reviewStats.totalReviews} reseñas)
                </span>
              </div>
            )}
          </div>
          <p className="text-sm text-blue-600 font-medium">{producto.categoria?.nombre || producto.categoria}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <FavoriteButton 
            product={producto}
            variant="ghost"
            size="lg"
            showText={true}
          />
          <button className="p-2 text-gray-500 hover:text-blue-500 transition">
            <Share2 size={24} />
          </button>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Volver</span>
          </button>
        </div>
      </div>

      {/* Galería de imágenes */}
      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-96 lg:h-[500px] relative">
          {/* Imagen principal */}
          <div className="lg:row-span-2 relative">
            {imagenes && imagenes.length > 0 ? (
              <img
                src={imagenes[currentImageIndex].url}
                alt={imagenes[currentImageIndex].textoAlternativo || producto.nombre}
                className="w-full h-full object-cover rounded-xl"
                onLoad={() => {
                  console.log(`✅ Imagen real del backend cargada: ${imagenes[currentImageIndex].url}`);
                }}
                onError={(e) => {
                  console.error(`❌ BACKEND FALLO - Imagen: ${e.target.src}`);
                  e.target.style.backgroundColor = '#fee2e2';
                  e.target.style.border = '2px solid #dc2626';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-300">
                <div className="text-center text-gray-500">
                  <p className="text-lg">📷</p>
                  <p className="text-sm">Sin imágenes en backend</p>
                  <p className="text-xs">{producto?.nombre}</p>
                </div>
              </div>
            )}
            
            {/* Controles de navegación de imágenes */}
            {imagenes && imagenes.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
                >
                  <ChevronRight size={20} />
                </button>
                
                {/* Indicadores de imagen */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {imagenes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Grid de imágenes secundarias - Solo en desktop */}
          {imagenes && imagenes.length > 1 && (
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {imagenes.slice(1, 5).map((imagen, index) => (
                <div key={imagen.id || index} className="relative cursor-pointer" onClick={() => setCurrentImageIndex(index + 1)}>
                  <img
                    src={imagen.url}
                    alt={imagen.textoAlternativo || `${producto.nombre} - vista ${index + 2}`}
                    className="w-full h-full object-cover rounded-lg hover:opacity-80 transition-opacity"
                  />
                  {index === 3 && imagenes.length > 5 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold">
                        +{imagenes.length - 4} más
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Descripción y características */}
        <div className="lg:col-span-2 space-y-8">
          {/* Descripción */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{producto.descripcion}</p>
            <p className="text-gray-700 leading-relaxed">{producto.descripcionLarga}</p>
          </div>

          {/* Características reales del Backend */}
          <ProductoCaracteristicas 
            productoId={producto.id} 
            layout="grid" 
            showTitle={true}
            maxItems={12}
          />
        </div>

        {/* Sidebar con calendario de disponibilidad */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <AvailabilityCalendar
              vehicleId={parseInt(id)}
              vehicleName={producto.nombre}
              onDateSelect={setSelectedDates}
            />
          </div>
        </div>
      </div>

      {/* Sistema de reseñas */}
      <div className="mt-16 bg-white rounded-xl border border-gray-200 p-8">
        <ReviewSystem
          productId={producto.id}
          reviews={reviews}
          stats={reviewStats}
          onAddReview={handleAddReview}
          canUserReview={userCanReview}
          reservaIdParaReview={reservaIdParaReview}
        />
      </div>
    </div>
  );
}