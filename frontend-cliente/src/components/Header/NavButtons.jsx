import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, User, LogOut, Heart } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import { useAuthNotifications } from '../../hooks/useAuthNotifications';

// mobileAvatarOnly: true para mostrar solo el avatar (sin nombre) en móvil/tablet fuera del menú
export default function NavButtons({ mobileAvatarOnly = false }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { notifyLogout } = useAuthNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  // Si NO está autenticado
  if (!isAuthenticated) {
    // En desktop, mostrar botones Login / Registro
    if (!mobileAvatarOnly) {
      return (
        <div className="flex items-center gap-3 md:gap-2 lg:gap-4">
          <Link
            to="/registro"
            className="px-4 md:px-3 lg:px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition"
          >
            Crear cuenta
          </Link>
          <Link
            to="/login"
            className="px-4 md:px-3 lg:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
          >
            Iniciar sesión
          </Link>
        </div>
      );
    }
    // En móvil, no mostrar nada fuera del menú
    return null;
  }

  // Si está autenticado, calcular iniciales
  const initials = user?.nombre && user?.apellido
    ? `${user.nombre[0]}${user.apellido[0]}`.toUpperCase()
    : user?.nombre
      ? user.nombre[0].toUpperCase()
      : '';

  const handleLogout = () => {
    setShowDropdown(false);
    notifyLogout();
    setTimeout(() => {
      logout();
    }, 2000);
  };

  // SOLO AVATAR (móvil/tablet, fuera del menú)
  if (mobileAvatarOnly) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
        </button>
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            ></div>
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
              <div className="py-2">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-bold text-gray-900">
                    {user?.nombre} {user?.apellido}
                  </p>
                  <p className="text-xs font-bold text-gray-900">{user?.email}</p>
                  {user?.role === "admin" && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Administrador
                    </span>
                  )}
                </div>
                <Link
                  to="/reservas"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  <User className="w-4 h-4" />
                  Mis Reservas
                </Link>
                <Link
                  to="/mis-favoritos"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowDropdown(false)}
                >
                  <Heart className="w-4 h-4" />
                  Mis Favoritos
                </Link>
                <div className="border-t border-gray-200 my-2" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // AVATAR + NOMBRE (desktop, menú completo)
  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {initials}
        </div>
        <span className="hidden sm:block text-sm font-medium">
          {user?.nombre}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`}
        />
      </button>
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="py-2">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-bold text-gray-900">
                  {user?.nombre} {user?.apellido}
                </p>
                <p className="text-xs font-bold text-gray-900">{user?.email}</p>
                {user?.role === "admin" && (
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Administrador
                  </span>
                )}
              </div>
              <Link
                to="/reservas"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                <User className="w-4 h-4" />
                Mis Reservas
              </Link>
              <Link
                to="/mis-favoritos"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                <Heart className="w-4 h-4" />
                Mis Favoritos
              </Link>
              <div className="border-t border-gray-200 my-2" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
