import type { User } from 'firebase/auth';

/**
 * User roles in the application.
 */
export type UserRole = 'editor' | 'viewer';

/**
 * User data stored in Firestore.
 */
export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Authentication context type.
 */
export interface AuthContextType {
  user: User | null;
  userRole: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
