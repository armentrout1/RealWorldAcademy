import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';

export interface User {
  id: number;
  username?: string;
  fullName?: string;
  firstName: string;
  lastName: string;
  email: string;
  ageGroup: 'under-9' | '9-12' | '13-15' | '16-18' | '18+';
  interests: string[];
  avatar?: string;
  // Gamification fields
  xp: number;
  level: number;
  levelTitle: string;
  streakCount: number;
  gamificationEnabled: boolean;
  progress: {
    selfDiscovery: number;
    financialLiteracy: number;
    projectsCompleted: number;
    learningPathsStarted: number;
  };
}

// Define type for signup data
export type SignupData = Pick<User, 'firstName' | 'lastName' | 'email' | 'ageGroup' | 'interests'> & {
  password: string;
};

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    apiRequest<User>('/api/auth/me')
      .then((currentUser) => {
        if (mounted) setUser(normalizeUser(currentUser));
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loggedInUser = await apiRequest<User>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setUser(normalizeUser(loggedInUser));
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    setIsLoading(true);
    try {
      const newUser = await apiRequest<User>('/api/auth/signup', {
        method: 'POST',
        body: userData,
      });
      setUser(normalizeUser(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await apiRequest('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      if (user) {
        setUser({ ...user, ...data });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;

function normalizeUser(user: User): User {
  return {
    ...user,
    firstName: user.firstName || user.fullName?.split(' ')[0] || '',
    lastName: user.lastName || user.fullName?.split(' ').slice(1).join(' ') || '',
    interests: user.interests || [],
    xp: user.xp || 0,
    level: user.level || 1,
    levelTitle: user.levelTitle || 'Beginner',
    streakCount: user.streakCount || 0,
    gamificationEnabled: user.gamificationEnabled ?? true,
    progress: user.progress || {
      selfDiscovery: 0,
      financialLiteracy: 0,
      projectsCompleted: 0,
      learningPathsStarted: 0,
    },
  };
}
