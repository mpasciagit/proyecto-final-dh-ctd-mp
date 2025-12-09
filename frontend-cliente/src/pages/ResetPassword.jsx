import { useState, useEffect } from 'react';
import Logo from '../components/Header/Logo';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Autocompletar token si viene en la URL
  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) setToken(urlToken);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const result = await authService.resetPassword(token, newPassword);
      if (result && result.successMessage) {
        setSuccess(result.successMessage);
        setError('');
      } else {
        setSuccess('Tu contraseña ha sido restablecida correctamente. Ahora puedes iniciar sesión.');
        setError('');
      }
    } catch (err) {
      setError('No se pudo restablecer la contraseña. Verifica el token e intenta nuevamente.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-md w-full mb-8">
        <div className="flex items-center" style={{ paddingLeft: '5.5rem' }}>
          <Logo iconSize="w-16 h-16" textSize="text-3xl" subTextSize="text-base" />
        </div>
      </div>
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Restablecer contraseña</h2>
        <p className="text-gray-600 mb-6 text-center">Ingresa el token recibido por email y tu nueva contraseña.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">Token</label>
            <input
              type="text"
              id="token"
              name="token"
              value={token}
              onChange={e => setToken(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Token de recuperación"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">Nueva contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
          </button>
        </form>
        <div className="mt-2 text-center">
          <Link to="/login" className="text-blue-600 hover:underline text-sm">Volver a iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
