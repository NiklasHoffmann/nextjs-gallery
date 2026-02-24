'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

/**
 * AuthProvider - Ready for implementation
 *
 * To implement:
 * 1. Install NextAuth.js: npm install next-auth
 * 2. Create auth configuration in /app/api/auth/[...nextauth]/route.ts
 * 3. Implement login/logout logic
 * 4. Add session management
 *
 * Example implementation with NextAuth:
 *
 * import { SessionProvider } from 'next-auth/react';
 * import { useSession, signIn, signOut } from 'next-auth/react';
 *
 * export function AuthProvider({ children }: { children: ReactNode }) {
 *   return <SessionProvider>{children}</SessionProvider>;
 * }
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO: Implement actual auth logic
  // This is a placeholder structure
  const value: AuthContextType = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    login: async () => {
      throw new Error('Auth not implemented yet');
    },
    logout: async () => {
      throw new Error('Auth not implemented yet');
    },
    updateUser: () => {
      throw new Error('Auth not implemented yet');
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
