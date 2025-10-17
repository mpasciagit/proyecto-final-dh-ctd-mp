import { useNavigate } from "react-router-dom";

const categorias = [
  {
    id: 1,
    nombre: "Económico",
    descripcion: "Compactos ideales para la ciudad, bajo consumo y fáciles de estacionar.",
    imagen: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=600",
  },
  {
    id: 2,
    nombre: "Sedán",
    descripcion: "Comodidad y espacio para viajes largos o familiares.",
    imagen: "https://images.unsplash.com/photo-1616788874313-95c6de7d91d4?q=80&w=600",
  },
  {
    id: 3,
    nombre: "SUV",
    descripcion: "Versátiles y potentes, perfectas para rutas mixtas o aventuras.",
    imagen: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600",
  },
  {
    id: 4,
    nombre: "Pick-up",
    descripcion: "Robustas y resistentes, ideales para trabajo o terrenos difíciles.",
    imagen: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=600",
  },
  {
    id: 5,
    nombre: "De lujo",
    descripcion: "Experiencia premium con máximo confort y tecnología avanzada.",
    imagen: "https://images.unsplash.com/photo-1603384696015-871af6a62b49?q=80&w=600",
  },
];

export default function Categorias() {
  const navigate = useNavigate();

  const handleClick = (nombre) => {
    navigate(`/productos?categoria=${encodeURIComponent(nombre)}`);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
        Tipos de Vehículo
      </h2>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categorias.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleClick(cat.nombre)}
            className="bg-white shadow-md rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
          >
            <img
              src={cat.imagen}
              alt={cat.nombre}
              className="h-48 w-full object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                {cat.nombre}
              </h3>
              <p className="text-slate-600 text-sm">{cat.descripcion}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
