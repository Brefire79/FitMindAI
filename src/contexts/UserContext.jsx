import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getUser, saveUser, updateUser } from '../utils/database';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const createUser = useCallback(async (userData) => {
    try {
      const newUser = await saveUser(userData);
      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }, []);

  const updateUserData = useCallback(async (updates) => {
    try {
      const updatedUser = await updateUser({ ...user, ...updates });
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }, [user]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    loading,
    createUser,
    updateUserData,
    refreshUser: loadUser
  }), [user, loading, createUser, updateUserData, loadUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};
