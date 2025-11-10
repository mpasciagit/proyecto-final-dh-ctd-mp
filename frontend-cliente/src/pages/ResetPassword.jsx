import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
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
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 hover:underline text-sm">Volver a iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
