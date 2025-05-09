
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@ayush.com',
    role: 'admin',
    favoriteHerbs: ['1', '2']
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@ayush.com',
    role: 'user',
    favoriteHerbs: ['3']
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if there's a stored user in localStorage
    const storedUser = localStorage.getItem('ayushUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock authentication
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = MOCK_USERS.find(u => u.email === email);
    if (user && password === 'password') { // For demo, all users have password 'password'
      setCurrentUser(user);
      localStorage.setItem('ayushUser', JSON.stringify(user));
      toast.success(`Welcome, ${user.name}!`);
    } else {
      toast.error('Invalid email or password');
      throw new Error('Invalid email or password');
    }
    
    setLoading(false);
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration
    setLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (MOCK_USERS.some(u => u.email === email)) {
      toast.error('Email already in use');
      throw new Error('Email already in use');
    }
    
    const newUser: User = {
      id: `${MOCK_USERS.length + 1}`,
      name,
      email,
      role: 'user', // New registrations are always regular users
      favoriteHerbs: []
    };
    
    MOCK_USERS.push(newUser);
    setCurrentUser(newUser);
    localStorage.setItem('ayushUser', JSON.stringify(newUser));
    
    toast.success('Registration successful!');
    setLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ayushUser');
    toast.info('Logged out successfully');
  };

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';

  const value = {
    currentUser,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
