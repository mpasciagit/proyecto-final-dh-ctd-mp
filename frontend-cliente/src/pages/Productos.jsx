// 📂 src/pages/Productos.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, MapPin, Car, Users, Filter, X } from "lucide-react";

import StepProgressBar from "../components/StepProgressBar";
import { reservationSteps } from "../config/steps";
import { FavoriteButton } from "../components";
import { ProductListSkeleton } from "../components/LoadingSkeletons";
import ProductoCaracteristicas from "../components/ProductoCaracteristicas";

import {
  setProduct,
  setCategory,
  setDates,
  setPickupLocation,
  setDropoffLocation,
} from "../redux/slices/reservationSlice";
import {
  fetchProducts,
  fetchProductsByCategory,
} from "../redux/slices/productSlice";
import { fetchCategories } from "../redux/slices/categorySlice";

// === Componente principal ===
export default function Productos() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState(null);

  // --- Redux state ---
  const { items: productos, loading: productsLoading, error: productsError } = useSelector(
    (state) => state.products
  );
  const { items: categorias } = useSelector((state) => state.category);
  const reservation = useSelector((state) => state.reservation);

  // --- Restaurar filtros de búsqueda previos ---
  const location = searchParams.get("location") || reservation.pickupLocation || "";
  const vehicleType =
    searchParams.get("vehicleType") || reservation.selectedCategory || "";
  const passengers = parseInt(searchParams.get("passengers")) || 0;
  const startDate =
    searchParams.get("startDate") ||
    (reservation.selectedDates?.start
      ? new Date(reservation.selectedDates.start).toISOString().split("T")[0]
      : null);
  const endDate =
    searchParams.get("endDate") ||
    (reservation.selectedDates?.end
      ? new Date(reservation.selectedDates.end).toISOString().split("T")[0]
      : null);
  const categoria = searchParams.get("categoria") || reservation.selectedCategory || "";

  // --- Fetch inicial ---
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categoria) {
      const categoriaObj = categorias.find((cat) => cat.nombre === categoria);
      if (categoriaObj) {
        dispatch(fetchProductsByCategory(categoriaObj.id));
      }
    } else {
      dispatch(fetchProducts());
    }
  }, [categoria, categorias, dispatch]);

  // --- Control de error global ---
  useEffect(() => {
    if (productsError) setError(productsError);
  }, [productsError]);

  // --- Filtro dinámico ---
  let productosFiltrados = productos || [];

  //if (location) {
  //  productosFiltrados = productosFiltrados.filter(
  //    (p) =>
  //      p.ciudad?.toLowerCase().includes(location.toLowerCase()) ||
  //      p.ubicacion?.toLowerCase().includes(location.toLowerCase())
  //  );
  //}

  if (vehicleType) {
    const categoriaObj = categorias.find((cat) => cat.nombre === vehicleType);
    if (categoriaObj) {
      productosFiltrados = productosFiltrados.filter(
        (p) =>
          p.categoriaId === categoriaObj.id ||
          p.categoria === categoriaObj.nombre
      );
    } else if (vehicleType !== "") {
      productosFiltrados = [];
    }
  }

  if (passengers > 0) {
    productosFiltrados = productosFiltrados.filter(
      (p) => (p.pasajeros || p.capacidadPasajeros) >= passengers
    );
  }

  const clearFilters = () => {
    setSearchParams({});
  };

  const handleImageError = (e) => {
    e.target.style.display = "none";
  };

  // --- Seleccionar producto ---
  const handleSelectProduct = (producto) => {
    // Guardar producto seleccionado en Redux
    dispatch(setProduct(producto));
    // Mantener categoría y fechas en Redux si existen
    if (vehicleType) dispatch(setCategory(vehicleType));
    if (startDate && endDate)
      dispatch(setDates({ start: startDate, end: endDate }));
    if (location) dispatch(setPickupLocation(location));
    navigate(`/producto/${producto.id}`);
  };

  const hasActiveFilters =
    location || vehicleType || categoria || passengers > 0 || startDate || endDate;

  // --- Render ---
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      {/* Paso 2 del flujo */}
      <StepProgressBar
  steps={reservationSteps}
        activeStep={1}
        onStepClick={(idx) => {
          if (idx === 0) navigate("/");
        }}
      />

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
          Selecciona un Vehículo
        </h2>


        {!productsLoading && (
          <p className="text-center text-gray-600 mb-6">
            {productosFiltrados.length === 0
              ? "No se encontraron vehículos que coincidan con tu búsqueda"
              : categoria
                ? `Mostrando ${productosFiltrados.length} ${
                    productosFiltrados.length === 1 ? "vehículo" : "vehículos"
                  } de la categoría ${categoria}`
                : `Mostrando ${productosFiltrados.length} ${
                    productosFiltrados.length === 1 ? "vehículo" : "vehículos"
                  }`}
          </p>
        )}
      </div>

      {/* Error global */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-center">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Grid de productos */}
      {productsLoading ? (
        <ProductListSkeleton count={8} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow group relative"
            >
              {/* Favorito */}
              <div className="absolute top-3 right-3 z-10">
                <FavoriteButton product={producto} variant="solid" size="default" />
              </div>

              {/* Click en producto */}
              <button
                type="button"
                className="block w-full text-left cursor-pointer"
                onClick={() => handleSelectProduct(producto)}
              >
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {producto.imagenes?.[0]?.url || producto.imagen ? (
                    <img
                      src={producto.imagenes?.[0]?.url || producto.imagen}
                      alt={producto.nombre}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={handleImageError}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-500 border-2 border-gray-300">
                      <div className="text-center">
                        <p className="text-2xl">📷</p>
                        <p className="text-xs">Sin imagen</p>
                        <p className="text-xs">en backend</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {producto.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize mb-3">
                    {producto.categoriaNombre ||
                      producto.categoria ||
                      "Sin categoría"}
                  </p>
                  <ProductoCaracteristicas productoId={producto.id} />
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">
                      ${producto.precio || producto.precioBase || 0}/día
                    </span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
