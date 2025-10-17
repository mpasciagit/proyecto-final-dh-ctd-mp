import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";
import { ReservationProvider } from "../context/ReservationContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { NotificationProvider } from "../context/NotificationContext";
import Layout from "./Layout";
import ProtectedRoute from "./ProtectedRoute";
import NotificationContainer from "./NotificationContainer";
import { ProductListSkeleton, ProductDetailSkeleton } from "./LoadingSkeletons";
import { routeComponents, initializeOptimizations } from "../utils/lazyLoading";

// Componentes de fallback para lazy loading
const RouteLoadingFallback = ({ type = "page" }) => {
  const skeletonMap = {
    page: <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>,
    products: <ProductListSkeleton count={8} />,
    detail: <ProductDetailSkeleton />
  };

  return skeletonMap[type] || skeletonMap.page;
};

export default function Router() {
  // Inicializar optimizaciones al cargar la app
  useEffect(() => {
    initializeOptimizations();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ReservationProvider>
          <FavoritesProvider>
            <NotificationProvider>
          <Routes>
            {/* Rutas públicas con lazy loading */}
            <Route path="/login" element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <routeComponents.Login />
              </Suspense>
            } />
            <Route path="/registro" element={
              <Suspense fallback={<RouteLoadingFallback />}>
                <routeComponents.Registro />
              </Suspense>
            } />
            
            {/* Rutas con layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <routeComponents.Home />
                </Suspense>
              } />
              
              <Route path="categorias" element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <routeComponents.Categorias />
                </Suspense>
              } />
              
              <Route path="productos" element={
                <Suspense fallback={<RouteLoadingFallback type="products" />}>
                  <routeComponents.Productos />
                </Suspense>
              } />
              
              <Route path="producto/:id" element={
                <Suspense fallback={<RouteLoadingFallback type="detail" />}>
                  <routeComponents.ProductDetail />
                </Suspense>
              } />
              
              <Route path="contacto" element={
                <Suspense fallback={<RouteLoadingFallback />}>
                  <routeComponents.Contacto />
                </Suspense>
              } />
              
              {/* Rutas protegidas */}
              <Route 
                path="reservas" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<RouteLoadingFallback />}>
                      <routeComponents.Reservas />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="reservar/:vehicleId" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<RouteLoadingFallback />}>
                      <routeComponents.CreateReservation />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="mis-favoritos" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<RouteLoadingFallback />}>
                      <routeComponents.MisFavoritos />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="reserva-confirmada/:reservationId" 
                element={
                  <ProtectedRoute>
                    <Suspense fallback={<RouteLoadingFallback />}>
                      <routeComponents.ReservationConfirmation />
                    </Suspense>
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
          
          {/* Contenedor de notificaciones */}
          <NotificationContainer />
          
        </NotificationProvider>
      </FavoritesProvider>
        </ReservationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
