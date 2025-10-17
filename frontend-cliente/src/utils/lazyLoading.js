// Lazy loading de componentes grandes
import { lazy } from 'react';

// Componentes que se cargan bajo demanda
export const LazyProductDetail = lazy(() => import('../pages/ProductDetail'));
export const LazyReservationConfirmation = lazy(() => import('../pages/ReservationConfirmation'));
export const LazyAdvancedFilters = lazy(() => import('../components/AdvancedFilters'));
export const LazyReviewSystem = lazy(() => import('../components/ReviewSystem'));
export const LazyAvailabilityCalendar = lazy(() => import('../components/AvailabilityCalendar'));

// Code splitting por rutas
export const routeComponents = {
  Home: lazy(() => import('../pages/Home')),
  Productos: lazy(() => import('../pages/Productos')),
  ProductDetail: lazy(() => import('../pages/ProductDetail')),
  Categorias: lazy(() => import('../pages/Categorias')),
  Login: lazy(() => import('../pages/Login')),
  Registro: lazy(() => import('../pages/Registro')),
  Reservas: lazy(() => import('../pages/Reservas')),
  CreateReservation: lazy(() => import('../pages/CreateReservation')),
  ReservationConfirmation: lazy(() => import('../pages/ReservationConfirmation')),
  MisFavoritos: lazy(() => import('../pages/MisFavoritos')),
  Contacto: lazy(() => import('../pages/Contacto'))
};

// Preload de componentes críticos
export const preloadComponents = () => {
  // Precargar componentes que probablemente se usarán
  const componentsToPreload = [
    () => import('../pages/ProductDetail'),
    () => import('../components/ReviewSystem'),
    () => import('../components/AvailabilityCalendar')
  ];

  componentsToPreload.forEach(loadComponent => {
    // Precargar en el próximo tick
    setTimeout(loadComponent, 100);
  });
};

// Optimización de imágenes
export const imageOptimization = {
  // Generar URLs de imágenes optimizadas
  getOptimizedImageUrl: (url, width = 400, quality = 80) => {
    if (url.includes('unsplash.com')) {
      return `${url}&w=${width}&q=${quality}&auto=format`;
    }
    return url;
  },

  // Precargar imágenes críticas
  preloadImages: (urls) => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
    });
  }
};

// Inicializar optimizaciones
export const initializeOptimizations = () => {
  // Precargar componentes críticos
  preloadComponents();
  
  console.log('✅ Optimizaciones inicializadas');
};

export default {
  LazyProductDetail,
  LazyReservationConfirmation,
  LazyAdvancedFilters,
  LazyReviewSystem,
  LazyAvailabilityCalendar,
  routeComponents,
  imageOptimization,
  initializeOptimizations
};