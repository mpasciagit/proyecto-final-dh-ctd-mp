import { createContext, useContext, useState, useEffect } from 'react';

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

  // Simular usuarios mock en localStorage
  const MOCK_USERS_KEY = 'mock_users';
  const CURRENT_USER_KEY = 'current_user';

  // Inicializar usuarios mock si no existen
  useEffect(() => {
    const existingUsers = localStorage.getItem(MOCK_USERS_KEY);
    if (!existingUsers) {
      const mockUsers = [
        {
          id: 1,
          email: 'admin@carrent.com',
          password: 'admin123',
          firstName: 'Admin',
          lastName: 'User',
          phone: '+1234567890',
          role: 'admin'
        },
        {
          id: 2,
          email: 'user@example.com',
          password: 'user123',
          firstName: 'Juan',
          lastName: 'Pérez',
          phone: '+0987654321',
          role: 'user'
        }
      ];
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(mockUsers));
    }

    // Verificar si hay un usuario logueado
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Remover password del objeto usuario
      const { password: _, ...userWithoutPassword } = user;
      
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
      
      // Verificar si el email ya existe
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }
      
      // Crear nuevo usuario
      const newUser = {
        id: Date.now(),
        ...userData,
        role: 'user'
      };
      
      users.push(newUser);
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
      
      // Auto login después del registro
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = async (updatedData) => {
    setIsLoading(true);
    
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const users = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex === -1) {
        throw new Error('Usuario no encontrado');
      }
      
      // Actualizar usuario
      const updatedUser = { ...users[userIndex], ...updatedData };
      users[userIndex] = updatedUser;
      
      localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = updatedUser;
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      return { success: true, user: userWithoutPassword };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    register,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};