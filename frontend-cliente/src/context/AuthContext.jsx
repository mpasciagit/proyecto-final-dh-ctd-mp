import { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import authService from '../services/authService.js';
import { clearReservation } from '../redux/slices/reservationSlice.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Verificar si hay un usuario logueado al inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          const isValidToken = await authService.verifyToken();

          if (isValidToken && currentUser) {
            setUser(currentUser);
          } else {
            authService.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        authService.logout();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ✅ Login
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      return { success: true, user: currentUser };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error.message || 'Error al iniciar sesión' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Registro
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const registerData = {
        nombre: userData.firstName,
        apellido: userData.lastName,
        email: userData.email,
        password: userData.password,
        rol: 'USER'
      };
      const response = await authService.register(registerData);
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      return { success: true, user: currentUser };
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        error: error.message || 'Error al registrar usuario' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Logout completo con limpieza
  const logout = () => {
    try {
      // 1️⃣ Logout del servicio (borra token y usuario)
      authService.logout();
      setUser(null);

      // 2️⃣ Limpieza de Redux + localStorage del estado de reserva
      dispatch(clearReservation());
      localStorage.removeItem('reservationState');

      // 3️⃣ (Opcional) Redirigir al inicio
      window.location.href = '/';
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  };

  // ✅ Actualizar perfil localmente (placeholder)
  const updateProfile = async (updatedData) => {
    setIsLoading(true);
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser) throw new Error('Usuario no autenticado');
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedUser = { ...currentUser, ...updatedData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return { 
        success: false, 
        error: error.message || 'Error al actualizar perfil' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Cambiar contraseña
  const changePassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      return { success: true, message: 'Contraseña cambiada exitosamente' };
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      return { 
        success: false, 
        error: error.message || 'Error al cambiar contraseña' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Helpers
  const isAuthenticated = !!user && authService.isAuthenticated();
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    changePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
