/*
 * IMPORTS
 */
import { z } from 'zod';

/*
 * VALIDATION SCHEMAS
 */
export const emailSchema = z
  .string()
  .email('Please provide a valid email address')
  .min(5, 'Email must be at least 5 characters long')
  .max(100, 'Email must not exceed 100 characters');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must not exceed 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  );

export const messageSchema = z
  .string()
  .min(1, 'Message cannot be empty')
  .max(4000, 'Message must not exceed 4000 characters')
  .trim();

export const conversationTitleSchema = z
  .string()
  .min(1, 'Title cannot be empty')
  .max(100, 'Title must not exceed 100 characters')
  .trim();

export const uuidSchema = z.string().uuid('Please provide a valid UUID');

/*
 * VALIDATION HELPERS
 */
export const validateEmail = (email) => {
  try {
    emailSchema.parse(email);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, message: error.errors[0].message };
  }
};

export const validatePassword = (password) => {
  try {
    passwordSchema.parse(password);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, message: error.errors[0].message };
  }
};

export const validateMessage = (message) => {
  try {
    messageSchema.parse(message);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, message: error.errors[0].message };
  }
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;

  return input
    .trim()
    .replace(/[<>'"&]/g, '') // Remove potential XSS characters
    .slice(0, 5000); // Prevent extremely long inputs
};

/*
 * RATE LIMITING VALIDATION
 */
export const validateRateLimit = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  const ip = req.ip || req.connection.remoteAddress;

  // Basic bot detection
  const suspiciousBots = ['bot', 'crawler', 'spider', 'scraper'];
  const isSuspicious = suspiciousBots.some((bot) => userAgent.toLowerCase().includes(bot));

  return {
    ip,
    userAgent,
    isSuspicious,
    timestamp: new Date(),
  };
};

/*
 * EXPORTS
 */
export default {
  emailSchema,
  passwordSchema,
  messageSchema,
  conversationTitleSchema,
  uuidSchema,
  validateEmail,
  validatePassword,
  validateMessage,
  sanitizeInput,
  validateRateLimit,
};
