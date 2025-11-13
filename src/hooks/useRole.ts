import { useAuth } from './useAuth';
import type { UserRole } from '../types/auth';

export const useRole = (roles: UserRole | UserRole[]): boolean => {
  const { userRole } = useAuth();

  if (!userRole) {
    return false;
  }

  if (Array.isArray(roles)) {
    return roles.includes(userRole);
  }

  return userRole === roles;
};

export const useIsEditor = (): boolean => {
  return useRole('editor');
};

export const useIsViewer = (): boolean => {
  return useRole('viewer');
};
