import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  loginDemoUser: () => Promise<void>;
  logout: () => void;
  updateUserPreferences: (prefs: { style_preferences: string[]; favorite_colors: string[]; fashion_goals: string[] }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('stylesense_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const profile = await api.getProfile();
        setUser(profile);
      } catch (err) {
        setUser({
          id: 'demo-user-uuid-1',
          full_name: 'Tanshul Sharma',
          email: 'demo@stylesense.ai',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
          style_preferences: ['Elegant', 'Minimalist', 'Formal'],
          favorite_colors: ['Black', 'Ivory', 'Emerald', 'Beige'],
          fashion_goals: ['Elevate daily style', 'Curate capsule wardrobe']
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    localStorage.setItem('stylesense_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
  };

  const signup = async (fullName: string, email: string, password: string) => {
    const data = await api.signup(fullName, email, password);
    localStorage.setItem('stylesense_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
  };

  const loginDemoUser = async () => {
    await login('demo@stylesense.ai', 'StyleSense2026!');
  };

  const logout = () => {
    localStorage.removeItem('stylesense_token');
    setToken(null);
    setUser(null);
  };

  const updateUserPreferences = async (prefs: { style_preferences: string[]; favorite_colors: string[]; fashion_goals: string[] }) => {
    const updated = await api.updatePreferences(prefs);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      loginDemoUser,
      logout,
      updateUserPreferences
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
