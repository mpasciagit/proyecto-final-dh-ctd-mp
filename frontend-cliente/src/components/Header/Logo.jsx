export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo/Isologotipo */}
      <img src="/vite.svg" alt="Logo" className="w-8 h-8" />
      {/* Logotipo y lema */}
      <div className="flex flex-col">
        <span className="font-bold text-xl text-white leading-tight">
          DriveNow
        </span>
        <span className="text-xs text-blue-300 leading-tight">
          Tu alquiler ideal
        </span>
      </div>
    </div>
  )
}
