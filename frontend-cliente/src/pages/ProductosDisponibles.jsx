// 📂 src/pages/ProductosDisponibles.jsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Car, Filter, X } from "lucide-react";
import { FavoriteButton } from "../components";
import { ProductListSkeleton } from "../components/LoadingSkeletons";
import ProductoCaracteristicas from "../components/ProductoCaracteristicas";
import { fetchProductsByCategory } from "../redux/slices/productSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import { useAuth } from "../context/AuthContext";

export default function ProductosDisponibles() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const categoriaNombre = searchParams.get("categoria");

  const { user } = useAuth();

  const { items: productos, loading, error } = useSelector(
    (state) => state.products
  );
  const { items: categorias } = useSelector((state) => state.category);

  const [errorMsg, setErrorMsg] = useState(null);

  // Cargar categorías y productos según la categoría elegida
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (categoriaNombre && categorias.length > 0) {
      const categoria = categorias.find(
        (cat) => cat.nombre === categoriaNombre
      );
      if (categoria) {
        dispatch(fetchProductsByCategory(categoria.id));
      } else {
        setErrorMsg("Categoría no encontrada");
      }
    }
  }, [categoriaNombre, categorias, dispatch]);

  // Navegación al detalle del producto
  const handleSelectProduct = (producto) => {
    navigate(`/producto/${producto.id}?modo=exploracion`);
  };

  // Limpiar filtros
  const clearFilters = () => {
    navigate("/categorias");
  };

  // --- Render ---
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
        Vehículos Disponibles
      </h2>

      {categoriaNombre && (
        <p className="text-center text-gray-500 mb-8">
          Mostrando <span className="font-semibold text-blue-600">{productos?.length || 0}</span> vehículos de la categoría <span className="font-semibold text-blue-600">{categoriaNombre}</span>
        </p>
      )}

      {/* Estado de carga */}
      {loading && <ProductListSkeleton count={8} />}

      {/* Estado de error */}
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

      {/* Mensaje de error por categoría */}
      {errorMsg && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-center text-yellow-800">
          {errorMsg}
        </div>
      )}

      {/* Aviso para usuarios no logueados */}
      {!user && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center text-blue-700">
          Inicia sesión para guardar tus vehículos favoritos.
        </div>
      )}

      {/* Grid de productos */}
      {!loading && productos && productos.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition-shadow group relative"
            >
              {/* Botón de favoritos */}
              <div className="absolute top-3 right-3 z-10">
                <FavoriteButton product={producto} variant="solid" size="default" />
              </div>

              {/* Imagen y clic al detalle */}
              <button
                type="button"
                onClick={() => handleSelectProduct(producto)}
                className="block w-full text-left cursor-pointer"
              >
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {producto.imagenes?.[0]?.url || producto.imagen ? (
                    <img
                      src={producto.imagenes?.[0]?.url || producto.imagen}
                      alt={producto.nombre}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-100 text-gray-500 border-2 border-gray-300">
                      <div className="text-center">
                        <p className="text-2xl">📷</p>
                        <p className="text-xs">Sin imagen</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {producto.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize mb-3">
                    {producto.categoriaNombre || categoriaNombre || "Sin categoría"}
                  </p>
                  <ProductoCaracteristicas productoId={producto.id} />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xl font-bold text-blue-600">
                      ${producto.precio || producto.precioBase || 0}/día
                    </span>
                    <span className="text-sm text-blue-600 group-hover:underline">
                      {/* Eliminado texto 'Ver detalles →' */}
                    </span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      ) : (
        !loading &&
        !error &&
        !errorMsg && (
          <p className="text-center text-gray-500">
            No hay vehículos disponibles en esta categoría.
          </p>
        )
      )}

      {/* Botón volver */}
      <div className="mt-10 flex justify-center">
        <button
          onClick={clearFilters}
          className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition cursor-pointer"
        >
          Volver a categorías
        </button>
      </div>
    </section>
  );
}
