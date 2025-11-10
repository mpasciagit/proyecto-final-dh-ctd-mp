import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer";
import WhatsappButton from "./WhatsappButton";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header fijo */}
      <Header />

      {/* Main con padding-top igual a la altura del header para que no lo tape */}
      <main className="flex-grow pt-20 bg-slate-50">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Botón flotante de WhatsApp */}
      <WhatsappButton phone="5491123456789" message="Hola, tengo una consulta sobre el producto." />
    </div>
  );
}
