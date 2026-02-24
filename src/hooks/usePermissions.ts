'use client';

import { useAuth } from '@/contexts/AuthContext';
import {
  Permission,
  hasPermission as checkPermission,
} from '@/lib/permissions';

/**
 * Hook to check permissions
 */
export function usePermissions() {
  const { user } = useAuth();

  return {
    hasPermission: (permission: Permission) =>
      checkPermission(user, permission),
    can: (permission: Permission) => checkPermission(user, permission),
  };
}
