import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import NavButtons from "./NavButtons";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-slate-900 text-white shadow-lg fixed top-0 left-0 right-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        {/* Logo clickeable - redirije a home */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Logo />
        </Link>

        {/* Menú Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="hover:text-blue-400 transition-colors">Reservar</Link>
          <Link to="/categorias" className="hover:text-blue-400 transition-colors">Elige tu Vehículo</Link>
          <Link to="/contacto" className="hover:text-blue-400 transition-colors">Contacto</Link>
          <NavButtons />
        </nav>

        {/* Botón Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white hover:text-blue-400 transition p-2"
          aria-label="Abrir menú"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menú Mobile */}
      {isOpen && (
        <nav className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="flex flex-col items-center gap-4 py-4">
            <Link to="/" className="hover:text-blue-400 py-2" onClick={() => setIsOpen(false)}>Reservar</Link>
            <Link to="/categorias" className="hover:text-blue-400 py-2" onClick={() => setIsOpen(false)}>Elige tu Vehículo</Link>
            <Link to="/contacto" className="hover:text-blue-400 py-2" onClick={() => setIsOpen(false)}>Contacto</Link>
            <div className="mt-2">
              <NavButtons />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
