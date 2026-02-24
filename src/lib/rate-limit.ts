import { env } from './env';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */
export function rateLimit(identifier: string): {
  success: boolean;
  remaining: number;
  reset: number;
} {
  const now = Date.now();
  const limit = env.API_RATE_LIMIT;
  const window = env.API_RATE_LIMIT_WINDOW;

  const record = store.get(identifier);

  if (!record || now > record.resetTime) {
    // Create or reset record
    store.set(identifier, {
      count: 1,
      resetTime: now + window,
    });

    return {
      success: true,
      remaining: limit - 1,
      reset: now + window,
    };
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      reset: record.resetTime,
    };
  }

  record.count++;

  return {
    success: true,
    remaining: limit - record.count,
    reset: record.resetTime,
  };
}

/**
 * Clean up old entries periodically
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}

// Auto-cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
