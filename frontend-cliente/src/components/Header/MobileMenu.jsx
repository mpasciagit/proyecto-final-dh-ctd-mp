import NavButtons from './NavButtons'

export default function MobileMenu({ onClose }) {
  return (
    <div className="md:hidden fixed top-16 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex flex-col items-center gap-4 py-4">
        <NavButtons />
        <button
          onClick={onClose}
          className="text-gray-500 text-sm mt-2 hover:underline"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}
