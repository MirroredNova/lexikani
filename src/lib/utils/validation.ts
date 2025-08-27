/**
 * Validation utilities for form inputs and data
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

/**
 * Validate that a string is not empty after trimming
 */
export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validate that a number is within a given range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}
