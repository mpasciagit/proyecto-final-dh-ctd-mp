import { useState, useRef, useEffect } from 'react';
import { Skeleton } from './LoadingSkeletons';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = '',
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = (e) => {
    setIsLoading(false);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(e);
  };

  const defaultFallback = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=400';

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Loading skeleton */}
      {isLoading && (
        <Skeleton className={`absolute inset-0 ${placeholderClassName || className}`} />
      )}

      {/* Error state */}
      {hasError && (
        <div className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${className}`}>
          <div className="text-center text-gray-400">
            <div className="text-2xl mb-2">🚗</div>
            <p className="text-xs">Error al cargar imagen</p>
          </div>
        </div>
      )}

      {/* Imagen principal */}
      {isInView && (
        <img
          src={hasError ? defaultFallback : src}
          alt={alt}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
          {...props}
        />
      )}
    </div>
  );
};

// Componente específico para imágenes de productos
export const ProductImage = ({ 
  product, 
  className = '', 
  showBadge = true,
  ...props 
}) => {
  return (
    <div className="relative">
      <LazyImage
        src={product.imagen}
        alt={product.nombre}
        className={`w-full h-full object-cover ${className}`}
        {...props}
      />
      
      {/* Badge de disponibilidad */}
      {showBadge && (
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            product.disponible 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              product.disponible ? 'bg-green-400' : 'bg-red-400'
            }`} />
            {product.disponible ? 'Disponible' : 'No disponible'}
          </span>
        </div>
      )}
    </div>
  );
};

// Galería de imágenes con lazy loading
export const ImageGallery = ({ images, alt, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-2">🚗</div>
          <p>Sin imágenes disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative">
        <LazyImage
          src={images[currentIndex]}
          alt={`${alt} - Vista ${currentIndex + 1}`}
          className={`w-full object-cover rounded-xl ${className}`}
        />
        
        {/* Navegación */}
        {images.length > 1 && (
          <div className="absolute inset-x-4 bottom-4">
            <div className="flex items-center justify-center gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex 
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <LazyImage
                src={image}
                alt={`${alt} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LazyImage;