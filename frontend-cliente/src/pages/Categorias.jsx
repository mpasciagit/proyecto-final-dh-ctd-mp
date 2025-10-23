import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { categoryService } from "../services/categoryService";
import { LoadingSpinner, ErrorMessage } from "../components/LoadingComponents";

export default function Categorias() {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🚀 Cargar categorías desde el backend
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Iniciando carga de categorías...');
        console.log('📡 Backend URL:', 'http://localhost:8080/api/categorias');
        
        const categoriasData = await categoryService.getAllCategories();
        setCategorias(categoriasData);
        console.log('✅ Categorías cargadas desde backend:', categoriasData);
      } catch (err) {
        console.error('❌ Error al cargar categorías:', err);
        console.error('❌ Error details:', err.message);
        
        // 🔄 Fallback con categorías mockadas (distintas del backend)
        console.log('� USANDO FALLBACK - DATOS MOCKADOS (NO BACKEND)');
        setCategorias([
          { id: 1, nombre: 'Económico [MOCK]', descripcion: 'Vehículos económicos para uso urbano y familiar - DATOS DE FALLBACK', urlImagen: 'https://picsum.photos/600/400?random=1' },
          { id: 2, nombre: 'SUV [MOCK]', descripcion: 'Vehículos utilitarios deportivos para toda la familia - DATOS DE FALLBACK', urlImagen: 'https://picsum.photos/600/400?random=2' },
          { id: 3, nombre: 'Lujo [MOCK]', descripcion: 'Vehículos de alta gama y lujo premium - DATOS DE FALLBACK', urlImagen: 'https://picsum.photos/600/400?random=3' },
          { id: 4, nombre: 'Pickup [MOCK]', descripcion: 'Camionetas para trabajo y aventura - DATOS DE FALLBACK', urlImagen: 'https://picsum.photos/600/400?random=4' }
        ]);
        setError(null); // Limpiar error ya que usamos fallback
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const handleClick = (nombre) => {
    navigate(`/productos?categoria=${encodeURIComponent(nombre)}`);
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
          onRetry={() => window.location.reload()} 
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
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            onClick={() => handleClick(categoria.nombre)}
            className="bg-white shadow-md rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
          >
            <img
              src={categoria.urlImagen}
              alt={categoria.nombre}
              className="h-48 w-full object-cover"
              onLoad={() => {
                console.log(`✅ Backend imagen OK para ${categoria.nombre}: ${categoria.urlImagen}`);
              }}
              onError={(e) => {
                console.error(`❌ BACKEND FALLO - No se pudo cargar imagen para ${categoria.nombre}: ${categoria.urlImagen}`);
                // SIN FALLBACK - Que se vea que falló
                e.target.style.backgroundColor = '#fee2e2';
                e.target.style.border = '2px solid #dc2626';
                e.target.alt = `❌ Error: ${categoria.nombre}`;
              }}
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {categoria.nombre}
              </h3>
              <p className="text-slate-600 text-sm">{categoria.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
