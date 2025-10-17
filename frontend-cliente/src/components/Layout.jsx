import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      {/* Agregamos pt-20 para compensar el header fixed */}
      <main className="flex-grow px-6 py-8 pt-20">
        <Outlet /> {/* Aquí se renderizan las páginas (Home, Categorias, etc.) */}
      </main>
      <Footer />
    </div>
  );
}
