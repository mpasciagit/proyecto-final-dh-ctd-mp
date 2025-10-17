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
  Camera
} from "lucide-react";
import AvailabilityCalendar from "../components/AvailabilityCalendar";
import { FavoriteButton, ReviewSystem } from "../components";
import { productos } from "../utils/productData";
import { 
  getReviewsByProduct, 
  getReviewStats, 
  canUserReview, 
  addReview 
} from "../utils/reviewsData";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDates, setSelectedDates] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({});
  const [userCanReview, setUserCanReview] = useState(false);

  // Buscar el producto por ID
  const producto = productos.find(p => p.id === parseInt(id));

  // Cargar reseñas y estadísticas
  useEffect(() => {
    if (producto) {
      const productReviews = getReviewsByProduct(producto.id);
      const stats = getReviewStats(producto.id);
      
      setReviews(productReviews);
      setReviewStats(stats);
      
      if (user) {
        setUserCanReview(canUserReview(user.id, producto.id));
      }
    }
  }, [producto, user]);

  const handleAddReview = async (reviewData) => {
    const newReview = addReview(reviewData);
    
    // Actualizar estado local
    setReviews(prev => [newReview, ...prev]);
    setReviewStats(getReviewStats(producto.id));
    setUserCanReview(false);
    
    return newReview;
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

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <button 
            onClick={() => navigate('/productos')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Volver a productos
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
            <p className="text-lg text-gray-600">{producto.ubicacion}</p>
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
          <p className="text-sm text-blue-600 font-medium">{producto.categoria}</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-96 lg:h-[500px]">
          {/* Imagen principal */}
          <div className="lg:row-span-2">
            <img
              src={producto.imagenes[0]}
              alt={producto.nombre}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          
          {/* Grid de imágenes secundarias - Solo en desktop */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {producto.imagenes.slice(1, 5).map((imagen, index) => (
              <div key={index} className="relative">
                <img
                  src={imagen}
                  alt={`${producto.nombre} - vista ${index + 2}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                {index === 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <button className="text-white font-semibold hover:underline">
                      Ver más fotos
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
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

          {/* Características */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Características</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {producto.caracteristicas.map((caracteristica, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{caracteristica.icono}</span>
                  <span className="text-gray-700 font-medium">{caracteristica.texto}</span>
                </div>
              ))}
            </div>
          </div>
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
        />
      </div>
    </div>
  );
}