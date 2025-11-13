import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type Firestore,
  type DocumentData,
} from 'firebase/firestore';
import { app } from './firebase';
import type { UserData, UserRole } from '../types/auth';

let dbInstance: Firestore | null = null;

const DISABLE_FIRESTORE = import.meta.env.VITE_DISABLE_FIRESTORE === 'true';

export const getDb = (): Firestore => {
  if (!dbInstance && !DISABLE_FIRESTORE) {
    dbInstance = getFirestore(app);
  }
  if (!dbInstance) {
    throw new Error('Firestore is disabled');
  }
  return dbInstance;
};

export const db = new Proxy({} as Firestore, {
  get(_target, prop) {
    if (DISABLE_FIRESTORE) {
      throw new Error(
        'Firestore is disabled. Use localStorage fallback functions instead.'
      );
    }
    return getDb()[prop as keyof Firestore];
  },
});

const USERS_COLLECTION = 'users';

export const DEFAULT_USER_ROLE: UserRole = 'viewer';

export const createUserDocument = async (
  uid: string,
  email: string,
  role: UserRole = DEFAULT_USER_ROLE
): Promise<void> => {
  if (DISABLE_FIRESTORE) {
    setUserRoleInLocalStorage(uid, role);
    return;
  }

  try {
    const db = getDb();
    const userRef = doc(db, USERS_COLLECTION, uid);
    const now = new Date();

    const userData: UserData = {
      uid,
      email,
      role,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(userRef, userData);
    setUserRoleInLocalStorage(uid, role);
  } catch (error) {
    console.error('Error creating user document:', error);
    setUserRoleInLocalStorage(uid, role);
    throw error;
  }
};

const getUserRoleFromLocalStorage = (uid: string): UserRole | null => {
  try {
    const stored = localStorage.getItem(`user_role_${uid}`);
    if (stored === 'editor' || stored === 'viewer') {
      return stored as UserRole;
    }
    return null;
  } catch {
    return null;
  }
};

const setUserRoleInLocalStorage = (uid: string, role: UserRole): void => {
  try {
    localStorage.setItem(`user_role_${uid}`, role);
  } catch {
    // Ignore localStorage errors
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  if (DISABLE_FIRESTORE) {
    const role = getUserRoleFromLocalStorage(uid);
    if (role) {
      return {
        uid,
        email: '',
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return null;
  }

  try {
    const db = getDb();
    const userRef = doc(db, USERS_COLLECTION, uid);
    // Use getDoc which is a one-time read, not a listener
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data() as DocumentData;
      return {
        uid: data.uid,
        email: data.email,
        role: data.role as UserRole,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }

    return null;
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    console.error('Error getting user data:', error);
    console.error('Error code:', err?.code);
    console.error('Error message:', err?.message);

    if (err?.code === 'permission-denied' || err?.code === 'unavailable') {
      console.warn(
        'Firestore permission denied or unavailable, returning null'
      );
      return null;
    }

    throw error;
  }
};

export const updateUserRole = async (
  uid: string,
  role: UserRole
): Promise<void> => {
  try {
    const db = getDb();
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      role,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const getUserRole = async (uid: string): Promise<UserRole | null> => {
  try {
    const userData = await getUserData(uid);
    return userData?.role || null;
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};
