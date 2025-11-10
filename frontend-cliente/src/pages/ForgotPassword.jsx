import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Header/Logo';
import authService from '../services/authService'; // Asegúrate de que la ruta sea correcta

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const result = await authService.forgotPassword(email);
      if (result && result.successMessage) {
        setSuccess(result.successMessage);
        setError('');
      } else {
        setSuccess('Si el correo está registrado, recibirás un email con instrucciones para restablecer tu contraseña.');
        setError('');
      }
    } catch (err) {
      setError('No se pudo enviar el correo. Intenta nuevamente.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-600 px-4">
  <div className="max-w-md w-full flex flex-col items-center mb-12 mt-8 mx-auto">
            <div className="self-start ml-31 scale-170">
          <Logo />
        </div>
      </div>
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Recuperar contraseña</h2>
        <p className="text-gray-600 mb-6 text-center">Ingresa tu email y te enviaremos instrucciones para restablecer tu contraseña.</p>
  <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="tu@email.com"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link to="/login" className="text-blue-600 hover:underline text-sm">Volver a iniciar sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
