
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

import Logo from "./Logo";
import NavButtons from "./NavButtons";
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="bg-slate-900 text-white shadow-lg fixed top-0 left-0 right-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo clickeable - redirije a home */}
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={e => {
            localStorage.removeItem("reservationState");
            window.location.href = "/";
            e.preventDefault();
          }}
        >
          <Logo />
        </Link>


        {/* Menú Desktop */}
        <nav className="hidden md:flex items-center md:gap-4 lg:gap-8">
          <Link to="/" className="hover:text-blue-400 transition-colors">Reservar</Link>
          <Link to="/categorias" className="hover:text-blue-400 transition-colors">Elige tu Vehículo</Link>
          <Link to="/contacto" className="hover:text-blue-400 transition-colors">Contacto</Link>
          <NavButtons />
        </nav>

        {/* Avatar fuera del menú sandwich en móvil/tablet + único botón menú */}
        <div className="flex items-center md:hidden gap-2">
          {isAuthenticated && user && (
            <NavButtons mobileAvatarOnly />
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-blue-400 transition p-2"
            aria-label="Abrir menú"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Menú Mobile */}
      {isOpen && (
        <nav className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="flex flex-col items-center gap-4 py-4">
            <Link to="/" className="hover:text-blue-400 py-2" onClick={() => setIsOpen(false)}>Reservar</Link>
            <Link to="/categorias" className="hover:text-blue-400 py-2" onClick={() => setIsOpen(false)}>Elige tu Vehículo</Link>
            <Link to="/contacto" className="hover:text-blue-400 py-2" onClick={() => setIsOpen(false)}>Contacto</Link>
            {!isAuthenticated && (
              <>
                <Link to="/registro" className="hover:text-blue-400 py-2" onClick={() => setIsOpen(false)}>Crear cuenta</Link>
                <Link to="/login" className="hover:text-blue-400 py-2" onClick={() => setIsOpen(false)}>Iniciar sesión</Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
