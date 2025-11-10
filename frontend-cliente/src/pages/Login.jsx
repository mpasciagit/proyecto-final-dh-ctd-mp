import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';
import Logo from '../components/Header/Logo';
import { useAuth } from '../context/AuthContext';
import { useAuthNotifications } from '../hooks/useAuthNotifications';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const { notifyLogin, notifyError } = useAuthNotifications();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  // Obtener la página de donde vino el usuario
  const from = location.state?.from || '/';

  const validateForm = () => {
    const newErrors = {};

    // Validación email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    // Validación password
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Limpiar error general de login
    if (loginError) {
      setLoginError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      notifyLogin(result.user);
      navigate(from, { replace: true });
    } else {
      notifyError(result.error);
      setLoginError(result.error);
    }
  };

  return (
  <div className="min-h-screen bg-blue-600 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header sin botón de volver externo */}
        <div className="mb-4">
          <div className="text-center flex flex-col items-center gap-2">
            <div className="self-start ml-29 mb-3 scale-170">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold text-white mb-0">
              Iniciar Sesión
            </h1>
            <p className="text-white mb-0">
              Accede a tu cuenta para continuar
            </p>
          </div>
        </div>

        {/* Formulario de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error general */}
          {loginError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {loginError}
            </div>
          )}



          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <div className="mt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none cursor-pointer"
                >
                  &larr; Volver
                </button>
                <Link to="/recuperar-contraseña" className="text-sm text-blue-600 hover:underline focus:outline-none">
                  ¿Has olvidado tu contraseña?
                </Link>
              </div>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Enlaces adicionales */}
          <div className="mt-6 text-center space-y-2">
            <Link
              to="/registro"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ¿No tienes cuenta? Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;