// Auth Constants
export const AUTH = {
  SESSION_COOKIE_NAME: 'session',
  SESSION_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
  REFRESH_TOKEN_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 days
} as const;

// API Constants
export const API = {
  VERSION: 'v1',
  TIMEOUT: 30000, // 30 seconds
  MAX_BODY_SIZE: '2mb',
} as const;

// Pagination Constants
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
} as const;
