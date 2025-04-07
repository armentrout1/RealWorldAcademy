import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock user data type
export interface User {
  id: number;
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

// Mock user data
export const mockUser: User = {
  id: 1,
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex@example.com',
  ageGroup: '13-15',
  interests: ['Money', 'Creativity', 'Technology'],
  avatar: '/default-avatar.png',
  // Gamification fields
  xp: 570,
  level: 2,
  levelTitle: 'Explorer',
  streakCount: 3,
  gamificationEnabled: true,
  progress: {
    selfDiscovery: 0.8,
    financialLiteracy: 0.6,
    projectsCompleted: 2,
    learningPathsStarted: 3
  }
};

// Define type for signup data
export type SignupData = Pick<User, 'firstName' | 'lastName' | 'email' | 'ageGroup' | 'interests'>;

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  updateProfile: async () => {},
});

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user in local storage on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Save user to local storage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Mock login function
  const login = async (email: string, password: string) => {
    // Simulate network request
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo, any non-empty email/password is valid
    if (email && password) {
      // TODO: Connect to user auth backend
      setUser(mockUser);
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  // Mock signup function
  const signup = async (userData: SignupData) => {
    // Simulate network request
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Connect to user registration API
    const newUser: User = {
      ...userData,
      id: 1,
      avatar: '/default-avatar.png',
      // Initialize gamification fields
      xp: 0,
      level: 1,
      levelTitle: 'Beginner',
      streakCount: 0,
      gamificationEnabled: true,
      progress: {
        selfDiscovery: 0,
        financialLiteracy: 0,
        projectsCompleted: 0,
        learningPathsStarted: 0
      }
    };
    
    setUser(newUser);
    setIsLoading(false);
  };

  // Mock logout function
  const logout = () => {
    // TODO: Connect to logout API
    setUser(null);
  };

  // Mock profile update function
  const updateProfile = async (data: Partial<User>) => {
    // Simulate network request
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // TODO: Connect to profile update API
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
    }
    
    setIsLoading(false);
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