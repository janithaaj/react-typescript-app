/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import type { AuthContextType } from '../types/auth';
import {
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  resetPassword,
  onAuthStateChange,
} from '../services/auth';

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that provides authentication context.
 * @param {AuthProviderProps} props - Component props.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Signs in a user with email and password.
   * @param {string} email - User email.
   * @param {string} password - User password.
   */
  const signIn = useCallback(async (email: string, password: string) => {
    await signInWithEmail(email, password);
    // User state will be updated by onAuthStateChange listener
  }, []);

  /**
   * Creates a new user account with email and password.
   * @param {string} email - User email.
   * @param {string} password - User password.
   */
  const signUp = useCallback(async (email: string, password: string) => {
    await signUpWithEmail(email, password);
    // User state will be updated by onAuthStateChange listener
  }, []);

  /**
   * Signs out the current user.
   */
  const handleSignOut = useCallback(async () => {
    await signOutUser();
    // User state will be updated by onAuthStateChange listener
  }, []);

  /**
   * Sends a password reset email.
   * @param {string} email - User email.
   */
  const handleResetPassword = useCallback(async (email: string) => {
    await resetPassword(email);
  }, []);

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
