import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .toLowerCase();

/**
 * Password validation schema
 * Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain uppercase, lowercase, number and special character'
  );

/**
 * Weak password (min 6 chars only)
 */
export const weakPasswordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters');

/**
 * Phone number validation (international format)
 */
export const phoneSchema = z
  .string()
  .regex(
    /^\+?[1-9]\d{1,14}$/,
    'Invalid phone number (use international format: +1234567890)'
  );

/**
 * URL validation schema
 */
export const urlSchema = z
  .string()
  .url('Invalid URL')
  .refine((url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, 'Invalid URL format');

/**
 * Slug validation (lowercase, numbers, hyphens only)
 */
export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug must contain only lowercase letters, numbers, and hyphens'
  )
  .toLowerCase();

/**
 * Username validation (alphanumeric, underscores, hyphens)
 */
export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must not exceed 20 characters')
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    'Username can only contain letters, numbers, underscores, and hyphens'
  );

/**
 * File size validation helper
 */
export const fileSizeSchema = (maxSizeInMB: number) =>
  z
    .number()
    .max(
      maxSizeInMB * 1024 * 1024,
      `File size must not exceed ${maxSizeInMB}MB`
    );

/**
 * File type validation helper
 */
export const fileTypeSchema = (allowedTypes: string[]) =>
  z
    .string()
    .refine(
      (type) => allowedTypes.includes(type),
      `File type must be one of: ${allowedTypes.join(', ')}`
    );

/**
 * Image file validation
 */
export const imageFileSchema = z.object({
  name: z.string(),
  type: fileTypeSchema(['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  size: fileSizeSchema(5), // 5MB max
});

/**
 * Document file validation
 */
export const documentFileSchema = z.object({
  name: z.string(),
  type: fileTypeSchema([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]),
  size: fileSizeSchema(10), // 10MB max
});

/**
 * Date range validation
 */
export const dateRangeSchema = z
  .object({
    startDate: z.date(),
    endDate: z.date(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: 'End date must be after or equal to start date',
    path: ['endDate'],
  });

/**
 * Confirm password validation
 */
export const confirmPasswordSchema = (passwordField: string = 'password') =>
  z
    .object({
      [passwordField]: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine(
      (data) =>
        data[passwordField as keyof typeof data] === data.confirmPassword,
      {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      }
    );

/**
 * Name validation (min 2 chars, only letters and spaces)
 */
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters')
  .regex(
    /^[a-zA-ZäöüÄÖÜß\s'-]+$/,
    'Name can only contain letters, spaces, hyphens, and apostrophes'
  );

/**
 * Positive number validation
 */
export const positiveNumberSchema = z
  .number()
  .positive('Must be a positive number');

/**
 * Positive integer validation
 */
export const positiveIntegerSchema = z
  .number()
  .int('Must be an integer')
  .positive('Must be a positive number');

/**
 * Color hex code validation
 */
export const hexColorSchema = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color code');

/**
 * Credit card validation (basic Luhn algorithm)
 */
export const creditCardSchema = z
  .string()
  .regex(/^\d{13,19}$/, 'Invalid credit card number')
  .refine((cardNumber) => {
    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }, 'Invalid credit card number');

/**
 * Postal code validation (flexible for different countries)
 */
export const postalCodeSchema = z
  .string()
  .regex(/^[A-Z0-9\s-]{3,10}$/i, 'Invalid postal code');

/**
 * IP address validation
 */
export const ipAddressSchema = z
  .string()
  .regex(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    'Invalid IP address'
  );

/**
 * JSON string validation
 */
export const jsonStringSchema = z.string().refine((str) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}, 'Invalid JSON string');
