import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay un usuario logueado al inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      try {
        // Verificar si hay token guardado
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          
          // Verificar si el token es válido
          const isValidToken = await authService.verifyToken();
          
          if (isValidToken && currentUser) {
            setUser(currentUser);
          } else {
            // Token inválido, limpiar datos
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

  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(email, password);
      
      // El authService ya guarda el token y usuario en localStorage
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

  const register = async (userData) => {
    setIsLoading(true);
    
    try {
      // Formatear datos para el backend
      const registerData = {
        nombre: userData.firstName,
        apellido: userData.lastName,
        email: userData.email,
        password: userData.password,
        rol: 'USER' // Rol por defecto para clientes
      };
      
      const response = await authService.register(registerData);
      
      // El authService ya guarda el token y usuario en localStorage
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

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (updatedData) => {
    setIsLoading(true);
    
    try {
      // Por ahora mantener funcionalidad local hasta que tengamos endpoint de perfil
      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Actualizar datos localmente
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

  // Función para cambiar contraseña usando el backend
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

  // 🔐 Verificar autenticación combinando user y token
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