import { useState } from "react";
import ProductoCaracteristicas from "./ProductoCaracteristicas";

export default function ShareProductModal({ open, onClose, product }) {
  const [message, setMessage] = useState("¡Mirá este producto!");

  if (!open) return null;

  const url = window.location.href;
  const { nombre, descripcion, imagenes } = product || {};
  const imageUrl = imagenes?.[0]?.url || "https://via.placeholder.com/300x200?text=Producto";

  // Funciones para compartir
  const handleShare = (network) => {
    let shareUrl = "";
    const encodedMsg = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(url);
    switch (network) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedMsg}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedMsg}`;
        break;
      case "instagram":
        // Instagram no permite compartir enlaces directamente
        shareUrl = "https://www.instagram.com/";
        break;
      default:
        return;
    }
    window.open(shareUrl, "_blank");
    if (window.toast) window.toast.success("¡Listo para compartir!", { duration: 2000 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Compartir producto</h2>
        <img src={imageUrl} alt={nombre} className="w-full h-40 object-cover rounded mb-3" />
        <p className="text-lg font-semibold mb-2">{nombre}</p>
        <p className="text-gray-600 mb-2">{descripcion}</p>
        {/* Características del producto */}
        <ProductoCaracteristicas productoId={product?.id} layout="grid" showTitle={true} maxItems={12} />
        <input
          type="text"
          className="w-full border rounded px-2 py-1 mb-3"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Agrega un mensaje personalizado..."
        />
        <div className="flex gap-3 mb-2">
          <button
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
            onClick={() => handleShare("facebook")}
          >Facebook</button>
          <button
            className="bg-sky-400 text-white px-3 py-2 rounded hover:bg-sky-500"
            onClick={() => handleShare("twitter")}
          >Twitter</button>
          <button
            className="bg-pink-500 text-white px-3 py-2 rounded hover:bg-pink-600"
            onClick={() => handleShare("instagram")}
          >Instagram</button>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline text-sm"
        >Ver producto</a>
      </div>
    </div>
  );
}
