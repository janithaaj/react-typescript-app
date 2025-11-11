import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  type User,
  type AuthError,
} from 'firebase/auth';
import { app } from './firebase';

/**
 * Firebase Auth instance.
 */
export const auth = getAuth(app);

/**
 * Firebase Auth error codes mapping to user-friendly messages.
 */
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Invalid email address.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/invalid-credential':
    'Invalid email or password. If you created this user in Firebase Console, please use the Sign Up option instead.',
  'auth/invalid-login-credentials':
    'Invalid email or password. If you created this user in Firebase Console, please use the Sign Up option instead.',
};

/**
 * Gets a user-friendly error message from Firebase Auth error.
 * @param {AuthError} error - Firebase Auth error.
 * @returns {string} User-friendly error message.
 */
export const getAuthErrorMessage = (error: AuthError): string => {
  const errorCode = error.code || '';
  return (
    AUTH_ERROR_MESSAGES[errorCode] ||
    error.message ||
    'An error occurred. Please try again.'
  );
};

/**
 * Signs in a user with email and password.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @returns {Promise<User>} Signed-in user.
 * @throws {Error} If sign-in fails.
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error as AuthError;
  }
};

/**
 * Creates a new user account with email and password.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @returns {Promise<User>} Created user.
 * @throws {Error} If account creation fails.
 */
export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw error as AuthError;
  }
};

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 * @throws {Error} If sign-out fails.
 */
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error as AuthError;
  }
};

/**
 * Sends a password reset email.
 * @param {string} email - User email.
 * @returns {Promise<void>}
 * @throws {Error} If sending email fails.
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error as AuthError;
  }
};

/**
 * Subscribes to authentication state changes.
 * @param {(user: User | null) => void} callback - Callback function.
 * @returns {() => void} Unsubscribe function.
 */
export const onAuthStateChange = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};
