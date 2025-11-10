// 📂 src/pages/ProductDetail.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetail,
  clearProductDetail,
} from "../redux/slices/productDetailSlice";
import ProductoCaracteristicas from "../components/ProductoCaracteristicas";
import { FavoriteButton, ReviewSystem } from "../components";
import { reservationSteps } from "../config/steps";
import reservationService from "../services/reservationService";
import reviewService from "../services/reviewService";
import { useAuth } from "../context/AuthContext";
import StepProgressBar from "../components/StepProgressBar";
import ShareProductModal from "../components/ShareProductModal";
import { Share2 } from "lucide-react";
import RangeCalendarModal from "../components/RangeCalendarModal";
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import {
  setPickupLocation,
  setDropoffLocation,
  setDates,
} from "../redux/slices/reservationSlice";
import { locations } from "../utils/locations";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useAuth();

  // ¿viene con ?modo=exploracion o volvió del login con estado?
  const [searchParams] = useSearchParams();
  const modoExploracion =
    searchParams.get("modo") === "exploracion" ||
    location.state?.modoExploracion;

  // redux
  const { product, images, reviews, stats, loading, error } = useSelector(
    (state) => state.productDetail
  );
  const reservation = useSelector((state) => state.reservation);


  // estado local SOLO para modo exploración
  const [localStartDate, setLocalStartDate] = useState(() => {
    if (modoExploracion) {
      if (reservation?.selectedDates?.start) {
        return new Date(reservation.selectedDates.start);
      }
      if (location.state?.fechas?.start) {
        return new Date(location.state.fechas.start);
      }
    }
    return null;
  });

  const [localEndDate, setLocalEndDate] = useState(() => {
    if (modoExploracion) {
      if (reservation?.selectedDates?.end) {
        return new Date(reservation.selectedDates.end);
      }
      if (location.state?.fechas?.end) {
        return new Date(location.state.fechas.end);
      }
    }
    return null;
  });

  // Estado para controlar el modal de calendario de rango
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  // Campo que abrió el modal ("retiro" o "devolucion")
  const [calendarField, setCalendarField] = useState(null);
  // Estado para el rango seleccionado (sincronizado con los locales)
  const [selectedRange, setSelectedRange] = useState({
    startDate: localStartDate,
    endDate: localEndDate,
  });

  // Sincronizar selectedRange con los estados locales si cambian
  useEffect(() => {
    setSelectedRange({
      startDate: localStartDate,
      endDate: localEndDate,
    });
  }, [localStartDate, localEndDate]);

  // Handler para abrir el modal desde un input
  const handleCalendarInputClick = (field) => {
    setCalendarField(field); // "retiro" o "devolucion" (por si se quiere lógica especial)
    setShowCalendarModal(true);
  };

  // Handler para confirmar el rango en el modal
  const handleCalendarConfirm = (range) => {
    setShowCalendarModal(false);
    setCalendarField(null);
    // Actualizar fechas locales y redux
    setLocalStartDate(range.startDate);
    setLocalEndDate(range.endDate);
    dispatch(setDates({ start: range.startDate, end: range.endDate }));
  };

  // Handler para cerrar el modal sin cambios
  const handleCalendarClose = () => {
    setShowCalendarModal(false);
    setCalendarField(null);
  };

  const [localPickupLocation, setLocalPickupLocation] = useState(() => {
    if (modoExploracion) {
      if (reservation?.pickupLocation) return reservation.pickupLocation;
      if (location.state?.ubicaciones?.pickup)
        return location.state.ubicaciones.pickup;
    }
    return "";
  });

  const [localDropoffLocation, setLocalDropoffLocation] = useState(() => {
    if (modoExploracion) {
      if (reservation?.dropoffLocation) return reservation.dropoffLocation;
      if (location.state?.ubicaciones?.dropoff)
        return location.state.ubicaciones.dropoff;
    }
    return "";
  });

  const [localReviews, setLocalReviews] = useState(reviews || []);
  const [creatingReservation, setCreatingReservation] = useState(false);
  const [reservationError, setReservationError] = useState(null);
  const [reservationSuccess, setReservationSuccess] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);

  // para mostrar el total
  const pricePerDay = product?.precio || product?.precioBase || 0;
  const startDate = modoExploracion
    ? localStartDate
    : reservation?.selectedDates?.start
      ? new Date(reservation.selectedDates.start)
      : null;
  const endDate = modoExploracion
    ? localEndDate
    : reservation?.selectedDates?.end
      ? new Date(reservation.selectedDates.end)
      : null;

  const diffDays =
    startDate && endDate
      ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
      : 0;
  const totalPrice = diffDays * pricePerDay;

  // cargar producto
  useEffect(() => {
    if (id) dispatch(fetchProductDetail(parseInt(id)));
    return () => {
      dispatch(clearProductDetail());
    };
  }, [dispatch, id]);

  useEffect(() => {
    setLocalReviews(reviews || []);
  }, [reviews]);

  // handlers para selects (tienen que estar FUERA del JSX)
  const handlePickupChange = (e) => {
    const value = e.target.value;
    setLocalPickupLocation(value);
    dispatch(setPickupLocation(value));
  };

  const handleDropoffChange = (e) => {
    const value = e.target.value;
    setLocalDropoffLocation(value);
    dispatch(setDropoffLocation(value));
  };

  // crear reserva
  const handleCreateReservation = async (e) => {
    e.preventDefault();
    setReservationError(null);
    setReservationSuccess(null);

    if (!user) return;

    try {
      setCreatingReservation(true);

      const payload = {
        userId: user.id,
        productId: product.id,
        startDate: startDate ? startDate.toISOString().split("T")[0] : null,
        endDate: endDate ? endDate.toISOString().split("T")[0] : null,
        pickupLocation: modoExploracion
          ? localPickupLocation
          : reservation.pickupLocation,
        dropoffLocation: modoExploracion
          ? localDropoffLocation
          : reservation.dropoffLocation,
        status: "PENDIENTE",
      };

      if (!payload.startDate || !payload.endDate) {
        setReservationError("Debes seleccionar fechas antes de continuar.");
        return;
      }

      const created = await reservationService.createReservation(payload);
      setReservationSuccess({
        message: "Reserva creada correctamente",
        reservation: created,
      });

      if (created?.id) {
        navigate(`/reserva-confirmada/${created.id}`);
      }
    } catch (err) {
      console.error("Error creando reserva:", err);
      setReservationError(err?.message || "No se pudo crear la reserva");
    } finally {
      setCreatingReservation(false);
    }
  };

  // estados de carga / error
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">
            Error al cargar el producto
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => navigate("/productos")}
          >
            Volver a productos
          </button>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <h2 className="text-xl font-semibold">Producto no encontrado</h2>
      </div>
    );

  const renderStars = (rating = 0) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <StepProgressBar
        steps={reservationSteps}
        activeStep={2}
        onStepClick={(idx) => {
          if (!modoExploracion) {
            if (idx === 0) navigate("/");
            if (idx === 1) navigate("/productos");
          }
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 pb-0 border-b border-gray-200">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {product.nombre}
          </h1>
        </div>
        <FavoriteButton product={product} variant="ghost" size="lg" />
      </div>

      {/* layout principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
        {/* izquierda */}
        <div>
          <div className="aspect-[6/4.5] w-full overflow-hidden rounded-xl shadow-sm border border-gray-200">
            {images?.length ? (
              <img
                src={images[0].url || images[0].imagenUrl}
                alt={product.nombre}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                <p>📷 Sin imágenes disponibles</p>
              </div>
            )}
          </div>

          <div className="mt-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Descripción
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {product.descripcion}
              </p>
              <p className="text-gray-700 leading-relaxed">
                {product.descripcionLarga}
              </p>
            </div>

            <ProductoCaracteristicas
              productoId={product.id}
              layout="grid"
              showTitle={true}
              maxItems={12}
            />

            <div className="mt-4 flex justify-start">
              <button
                type="button"
                className="flex items-center gap-2 bg-gray-100 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded shadow cursor-pointer"
                onClick={() => setShareOpen(true)}
              >
                <Share2 className="w-5 h-5" /> Compartir
              </button>
            </div>
          </div>

          <ShareProductModal
            open={shareOpen}
            onClose={() => setShareOpen(false)}
            product={product}
          />
        </div>

        {/* derecha */}
        <aside className="sticky top-24 bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Reservar este vehículo</h3>

          {/* 2x2: fecha/lugar retiro + fecha/lugar devolución */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Fecha de retiro */}
            <div>
              {modoExploracion ? (
                <>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha de retiro
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={
                      localStartDate
                        ? localStartDate.toLocaleDateString("es-AR")
                        : "No seleccionada"
                    }
                    className="w-full border rounded px-3 py-2 bg-white cursor-pointer"
                    onClick={() => handleCalendarInputClick("retiro")}
                  />
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha de retiro
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={
                      startDate
                        ? startDate.toLocaleDateString("es-AR")
                        : "No seleccionada"
                    }
                    className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </>
              )}
            </div>

            {/* Lugar de retiro */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lugar de retiro
              </label>
              {modoExploracion ? (
                <select
                  value={localPickupLocation}
                  onChange={handlePickupChange}
                  className="w-full border rounded px-3 py-2 bg-white cursor-pointer"
                >
                  <option value="">Seleccionar ciudad</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  readOnly
                  value={reservation.pickupLocation || "No especificado"}
                  className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed opacity-80"
                  tabIndex={-1}
                />
              )}
            </div>

            {/* Fecha de devolución */}
            <div>
              {modoExploracion ? (
                <>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha de devolución
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={
                      localEndDate
                        ? localEndDate.toLocaleDateString("es-AR")
                        : "No seleccionada"
                    }
                    className="w-full border rounded px-3 py-2 bg-white cursor-pointer"
                    onClick={() => handleCalendarInputClick("devolucion")}
                  />
                </>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha de devolución
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={
                      endDate
                        ? endDate.toLocaleDateString("es-AR")
                        : "No seleccionada"
                    }
                    className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                  />
                </>
              )}
        {/* Modal de calendario de rango */}
        {modoExploracion && (
          <RangeCalendarModal
            open={showCalendarModal}
            onClose={handleCalendarClose}
            onConfirm={handleCalendarConfirm}
            initialRange={{
              startDate: localStartDate || new Date(),
              endDate: localEndDate || new Date(),
              key: "selection"
            }}
          />
        )}
            </div>

            {/* Lugar de devolución */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lugar de devolución
              </label>
              {modoExploracion ? (
                <select
                  value={localDropoffLocation}
                  onChange={handleDropoffChange}
                  className="w-full border rounded px-3 py-2 bg-white cursor-pointer"
                >
                  <option value="">Seleccionar ciudad</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  readOnly
                  value={reservation.dropoffLocation || "No especificado"}
                  className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed opacity-80"
                  tabIndex={-1}
                />
              )}
            </div>
          </div>

          {/* Precio */}
          <div className="border-t border-gray-200 pt-4 mb-4">
            <p className="text-gray-700">
              <strong>Precio por día:</strong> ${pricePerDay}
            </p>
            <p className="text-gray-700">
              <strong>Total:</strong>{" "}
              {diffDays > 0
                ? `${diffDays} días × $${pricePerDay} = $${totalPrice}`
                : "Seleccioná fechas"}
            </p>
          </div>

          {/* Política */}
          <div className="text-sm text-gray-600 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">
              Política de reservas
            </h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Cancelación gratuita hasta 24 horas antes</li>
              <li>Precio incluye seguro básico</li>
              <li>Combustible no incluido</li>
              <li>Licencia de conducir válida requerida</li>
            </ul>
          </div>

          {/* si no está logueado */}
          {!user && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-3 text-sm text-blue-800">
              Inicia sesión para continuar con la reserva
            </div>
          )}

          <div className="flex justify-between gap-3">
            {!user && (
              <button
                type="button"
                onClick={() => {
                  if (modoExploracion) {
                    navigate("/login", {
                      state: {
                        from: location.pathname + location.search,
                        modoExploracion: true,
                        fechas: {
                          start: localStartDate?.toISOString(),
                          end: localEndDate?.toISOString(),
                        },
                        ubicaciones: {
                          pickup: localPickupLocation,
                          dropoff: localDropoffLocation,
                        },
                      },
                    });
                  } else {
                    navigate("/login", { state: { from: location.pathname } });
                  }
                }}
                className="flex-1 bg-gray-100 text-gray-800 border border-gray-300 py-2 rounded-lg hover:bg-gray-200 transition cursor-pointer"
              >
                Iniciar Sesión
              </button>
            )}
            <button
              type="button"
              onClick={handleCreateReservation}
              disabled={!user || creatingReservation}
              className={`flex-1 py-2 rounded-lg text-white ${!user
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
                }`}
            >
              {creatingReservation ? "Reservando..." : "Confirmar Reserva"}
            </button>
          </div>

          {reservationError && (
            <p className="text-sm text-red-600 mt-3">{reservationError}</p>
          )}
          {reservationSuccess && (
            <p className="text-sm text-green-600 mt-3">
              {reservationSuccess.message}
            </p>
          )}
        </aside>
      </div>

      {/* Reseñas */}
      <div className="mt-16 bg-white rounded-xl border border-gray-200 p-8">
        <ReviewSystem
          productId={product.id}
          reviews={localReviews}
          stats={stats || { averageRating: 0, totalReviews: 0 }}
          onAddReview={async (reviewPayload) => {
            try {
              const created = await reviewService.createReview(reviewPayload);
              const refreshed = await reviewService.getReviewsByProduct(
                product.id
              );
              setLocalReviews(refreshed);
              return created;
            } catch (err) {
              throw err;
            }
          }}
          canUserReview={true}
        />
      </div>
    </div>
  );
}
