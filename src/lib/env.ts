import { z } from 'zod';

// Environment Schema
const envSchema = z.object({
  // MongoDB
  MONGODB_URI: z.string().min(1, 'MongoDB URI is required'),

  // App
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),

  // Logging
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'])
    .default('info'),

  // API
  API_RATE_LIMIT: z.string().transform(Number).default('100'),
  API_RATE_LIMIT_WINDOW: z.string().transform(Number).default('60000'),
});

// Validate environment variables
const envValidation = envSchema.safeParse(process.env);

if (!envValidation.success) {
  console.error('❌ Invalid environment variables:');
  console.error(envValidation.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = envValidation.data;
