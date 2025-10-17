export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">DriveNow</span>
          <span className="text-sm text-slate-400">&copy; {year} Todos los derechos reservados</span>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-blue-400 transition">Facebook</a>
          <a href="#" className="hover:text-blue-400 transition">Instagram</a>
          <a href="#" className="hover:text-blue-400 transition">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
