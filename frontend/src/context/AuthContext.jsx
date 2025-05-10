import { createContext, useState, useEffect, useContext } from 'react';
import { isAuthenticated, getAuthUser, login, logout } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      if (isAuthenticated()) {
        try {
          const userData = await getAuthUser();
          setUser(userData);
        } catch (error) {
          console.error('Error loading user:', error);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Login function
  const loginUser = async (credentials) => {
    setLoading(true);
    const success = await login(credentials);
    
    if (success) {
      const userData = await getAuthUser();
      setUser(userData);
    }
    
    setLoading(false);
    return success;
  };

  // Logout function
  const logoutUser = () => {
    logout();
    setUser(null);
  };

  // Update user data
  const updateUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false,
        loginUser,
        logoutUser,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;