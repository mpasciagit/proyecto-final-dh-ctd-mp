import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Header/Logo';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    // Validación nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validación apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'El apellido debe tener al menos 2 caracteres';
    }

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

    // Validación confirmación password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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

    // Limpiar error general de registro
    if (registerError) {
      setRegisterError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { confirmPassword, ...userData } = formData;
    const result = await register(userData);

    if (result.success) {
      navigate('/');
    } else {
      setRegisterError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-4">
          <div className="flex flex-row w-full items-center justify-between">
            {/* Bloque izquierdo: logo */}
            <div className="self-start ml-10 mt-2 scale-160">
              <Logo />
            </div>
            {/* Bloque derecho: título y subtítulo */}
            <div className="flex flex-col items-start text-left ml-auto">
              <h1 className="text-2xl font-bold text-white mb-2">
                Crear Cuenta
              </h1>
              <p className="text-white leading-tight">
                Regístrate para acceder<br />a todas las funciones
              </p>
            </div>
          </div>
        </div>

        {/* Formulario de Registro */}
        <div className="bg-white rounded-2xl shadow-xl p-4">
          {/* Error general */}
          {registerError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {registerError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nombre y Apellido en una fila */}
            <div className="grid grid-cols-2 gap-4">
              {/* Nombre */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="Juan"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                )}
              </div>

              {/* Apellido */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Pérez"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

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
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer mb-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Enlaces adicionales */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </button>
            <Link
              to="/login"
              className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer font-normal whitespace-nowrap text-base"
            >
              ¿Ya tienes una cuenta? Inicia sesión aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;