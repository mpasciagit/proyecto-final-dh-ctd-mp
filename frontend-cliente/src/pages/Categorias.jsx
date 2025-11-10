// src/pages/Categorias.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/slices/categorySlice";
import { LoadingSpinner, ErrorMessage } from "../components/LoadingComponents";

export default function Categorias() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: categorias, loading, error } = useSelector((state) => state.category);

  // Cargar categorías desde Redux
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleClick = (nombre) => {
    navigate(`/productos-disponibles?categoria=${encodeURIComponent(nombre)}`);
  };

  // Estado de carga
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Tipos de Vehículo
        </h2>
        <LoadingSpinner size="large" text="Cargando categorías..." />
      </section>
    );
  }

  // Estado de error
  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
          Tipos de Vehículo
        </h2>
        <ErrorMessage 
          message={error} 
          onRetry={() => dispatch(fetchCategories())} 
        />
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
        Tipos de Vehículo
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No hay categorías disponibles.
          </p>
        ) : (
          categorias.map((categoria) => (
            <div
              key={categoria.id}
              onClick={() => handleClick(categoria.nombre)}
              className="bg-white shadow-md rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
            >
              <img
                src={categoria.urlImagen}
                alt={categoria.nombre}
                className="h-48 w-full object-cover"
                onLoad={() => console.log(`Imagen OK para ${categoria.nombre}`)}
                onError={(e) => {
                  console.error(`Fallo imagen ${categoria.nombre}`);
                  e.target.style.backgroundColor = '#fee2e2';
                  e.target.style.border = '2px solid #dc2626';
                  e.target.alt = `Error: ${categoria.nombre}`;
                }}
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {categoria.nombre}
                </h3>
                <p className="text-slate-600 text-sm">{categoria.descripcion}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
