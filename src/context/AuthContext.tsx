'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface AuthUser {
  name: string;
  email: string;
}

interface AuthContextValue {
  signedIn: boolean;
  user: AuthUser | null;
  signInOpen: boolean;
  openSignIn: () => void;
  closeSignIn: () => void;
  signIn: (user: AuthUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Mock signed-in user (swap for a real session/API later).
const MOCK_USER: AuthUser = { name: 'Ramesh Kumar', email: 'ramesh.kumar@example.com' };

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(MOCK_USER);
  const [signInOpen, setSignInOpen] = useState(false);

  const openSignIn  = useCallback(() => setSignInOpen(true), []);
  const closeSignIn = useCallback(() => setSignInOpen(false), []);
  const signIn      = useCallback((u: AuthUser) => { setUser(u); setSignInOpen(false); }, []);
  const signOut     = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ signedIn: !!user, user, signInOpen, openSignIn, closeSignIn, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
