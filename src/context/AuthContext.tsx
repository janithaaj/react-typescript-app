/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import type { User } from 'firebase/auth';
import type { AuthContextType, UserRole } from '../types/auth';
import {
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  resetPassword,
  onAuthStateChange,
} from '../services/auth';
import {
  getUserRole,
  createUserDocument,
  DEFAULT_USER_ROLE,
} from '../services/firestore';

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
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchingRoleRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);

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

  /**
   * Fetches user role from Firestore.
   * @param {string} uid - User ID.
   * @param {string} email - User email.
   */
  const fetchUserRole = useCallback(async (uid: string, email: string) => {
    // Prevent concurrent calls for the same user
    if (fetchingRoleRef.current || currentUserIdRef.current === uid) {
      return;
    }

    fetchingRoleRef.current = true;
    currentUserIdRef.current = uid;

    try {
      // Add timeout to prevent hanging (reduced to 5 seconds)
      const timeoutPromise = new Promise<UserRole | null>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000); // 5 second timeout
      });

      const rolePromise = getUserRole(uid);
      let role: UserRole | null = null;
      try {
        role = await Promise.race([rolePromise, timeoutPromise]);
      } catch (timeoutError) {
        console.warn(
          'Role fetch timed out or failed, using default role',
          timeoutError
        );
        role = null;
      }

      // If user document doesn't exist, try to create it (but don't wait if it fails)
      if (!role) {
        // Don't await - fire and forget to prevent blocking
        createUserDocument(uid, email, DEFAULT_USER_ROLE).catch(
          (createError) => {
            console.warn(
              'Could not create user document (non-blocking):',
              createError
            );
          }
        );
        role = DEFAULT_USER_ROLE;
      }

      setUserRole(role);
    } catch (error: unknown) {
      console.error('Error fetching user role:', error);
      // Always set default role on error to prevent infinite loading
      setUserRole(DEFAULT_USER_ROLE);
    } finally {
      fetchingRoleRef.current = false;
    }
  }, []);

  // Listen to authentication state changes
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChange(async (currentUser) => {
      if (!isMounted) return;

      setUser(currentUser);

      if (currentUser) {
        // Only fetch role if user changed (different user or first time)
        if (currentUserIdRef.current !== currentUser.uid) {
          try {
            await fetchUserRole(currentUser.uid, currentUser.email || '');
          } catch (error) {
            console.error('Failed to fetch user role:', error);
            // Set default role even if fetch fails
            setUserRole(DEFAULT_USER_ROLE);
          }
        }
      } else {
        // Clear user role when user signs out
        setUserRole(null);
        currentUserIdRef.current = null;
        fetchingRoleRef.current = false;
      }

      // Always set loading to false, even if there was an error
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - we only want to set up the listener once

  const value: AuthContextType = {
    user,
    userRole,
    loading,
    signIn,
    signUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
