import { User } from '@/contexts/AuthContext';

/**
 * Permission types
 */
export type Permission =
  | 'read'
  | 'write'
  | 'delete'
  | 'admin'
  | 'user:read'
  | 'user:write'
  | 'user:delete'
  | 'post:read'
  | 'post:write'
  | 'post:delete';

/**
 * Role definitions with permissions
 */
export const rolePermissions: Record<string, Permission[]> = {
  admin: [
    'read',
    'write',
    'delete',
    'admin',
    'user:read',
    'user:write',
    'user:delete',
    'post:read',
    'post:write',
    'post:delete',
  ],
  editor: [
    'read',
    'write',
    'user:read',
    'post:read',
    'post:write',
    'post:delete',
  ],
  user: ['read', 'user:read', 'post:read'],
  guest: ['read', 'post:read'],
};

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  user: User | null,
  permission: Permission
): boolean {
  if (!user) return false;

  const permissions = rolePermissions[user.role] || [];
  return permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  user: User | null,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(user, permission));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  user: User | null,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(user, permission));
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: string): boolean {
  if (!user) return false;
  return user.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roles: string[]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, 'admin');
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(user: User | null): boolean {
  return user !== null;
}
