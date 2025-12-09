export default function Logo({
  className = '',
  iconSize = 'w-8 h-8',
  textSize = 'text-xl',
  subTextSize = 'text-xs',
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo/Isologotipo */}
      <img src="/vite.svg" alt="Logo" className={iconSize} />
      {/* Logotipo y lema */}
      <div className="flex flex-col">
        <span className={`font-bold ${textSize} text-white leading-tight`}>
          DriveNow
        </span>
        <span className={`${subTextSize} text-blue-300 leading-tight`}>
          Tu alquiler ideal
        </span>
      </div>
    </div>
  )
}
