import { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsappButton({ phone = "5491123456789", message = "Hola, tengo una consulta sobre el producto." }) {
  const [error, setError] = useState(null);

  const handleClick = () => {
    setError(null);
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    try {
      window.open(url, "_blank");
      // Notificación de éxito
      if (window.toast) {
        window.toast.success("Redirigiendo a WhatsApp…", { duration: 2500 });
      }
    } catch (e) {
      setError("No se pudo abrir WhatsApp. Verifica tu conexión o el número.");
      if (window.toast) {
        window.toast.error("Error al abrir WhatsApp", { duration: 2500 });
      }
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Contactar por WhatsApp"
        onClick={handleClick}
  className="fixed right-4 bottom-4 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-colors cursor-pointer"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
      >
        <MessageCircle className="w-7 h-7" />
      </button>
      {error && (
        <div className="fixed right-4 bottom-20 bg-red-100 text-red-700 px-4 py-2 rounded shadow z-50">
          {error}
        </div>
      )}
    </>
  );
}
