import { api } from '@/lib/api';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  nome: string;
  email: string;
  matricula: string;
  role: 'ESTUDANTE' | 'PROFESSOR' | 'COORDENADOR' | 'DIRETOR';
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // O useNavigate foi removido daqui

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/profile');
      setUser(response.data);
    } catch (error) {
      console.error("Falha ao buscar perfil, limpando token.", error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    localStorage.setItem('authToken', token);
    setIsLoading(true);
    await fetchUserProfile();
    // A linha navigate('/dashboard') foi removida daqui
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    // A linha navigate('/login') foi removida daqui
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};