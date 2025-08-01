/**
 * Input validation utilities for secure data handling
 */

interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: any;
}

/**
 * Email validation with domain restrictions
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required and must be a string' };
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  // Check for potential security issues
  if (email.length > 254) {
    return { isValid: false, error: 'Email address too long' };
  }

  // Restrict suspicious domains (basic list)
  const suspiciousDomains = [
    'tempmail.org',
    '10minutemail.com',
    'guerrillamail.com',
    'mailinator.com'
  ];

  const domain = email.split('@')[1].toLowerCase();
  if (suspiciousDomains.includes(domain)) {
    return { isValid: false, error: 'Temporary email addresses not allowed' };
  }

  return { 
    isValid: true, 
    sanitizedValue: email.toLowerCase().trim() 
  };
};

/**
 * Validates subscription tier
 */
export const validateTier = (tier: string): ValidationResult => {
  const allowedTiers = ['premium'];
  
  if (!tier || typeof tier !== 'string') {
    return { isValid: false, error: 'Tier is required and must be a string' };
  }

  if (!allowedTiers.includes(tier)) {
    return { isValid: false, error: 'Invalid subscription tier' };
  }

  return { isValid: true, sanitizedValue: tier };
};

/**
 * Validates subscription interval
 */
export const validateInterval = (interval: string): ValidationResult => {
  const allowedIntervals = ['month', 'year'];
  
  if (!interval || typeof interval !== 'string') {
    return { isValid: false, error: 'Interval is required and must be a string' };
  }

  if (!allowedIntervals.includes(interval)) {
    return { isValid: false, error: 'Invalid billing interval' };
  }

  return { isValid: true, sanitizedValue: interval };
};

/**
 * Validates additional members count
 */
export const validateAdditionalMembers = (count: any): ValidationResult => {
  if (count === undefined || count === null) {
    return { isValid: true, sanitizedValue: 0 };
  }

  const numCount = Number(count);
  
  if (isNaN(numCount) || !Number.isInteger(numCount)) {
    return { isValid: false, error: 'Additional members must be a valid integer' };
  }

  if (numCount < 0 || numCount > 10) {
    return { isValid: false, error: 'Additional members must be between 0 and 10' };
  }

  return { isValid: true, sanitizedValue: numCount };
};

/**
 * Validates trial flag
 */
export const validateTrial = (trial: any): ValidationResult => {
  if (trial === undefined || trial === null) {
    return { isValid: true, sanitizedValue: false };
  }

  if (typeof trial === 'boolean') {
    return { isValid: true, sanitizedValue: trial };
  }

  if (typeof trial === 'string') {
    const lowerTrial = trial.toLowerCase();
    if (lowerTrial === 'true') {
      return { isValid: true, sanitizedValue: true };
    }
    if (lowerTrial === 'false') {
      return { isValid: true, sanitizedValue: false };
    }
  }

  return { isValid: false, error: 'Trial must be a boolean value' };
};

/**
 * Validates guest checkout flag
 */
export const validateGuestCheckout = (isGuest: any): ValidationResult => {
  if (isGuest === undefined || isGuest === null) {
    return { isValid: true, sanitizedValue: false };
  }

  if (typeof isGuest === 'boolean') {
    return { isValid: true, sanitizedValue: isGuest };
  }

  if (typeof isGuest === 'string') {
    const lowerGuest = isGuest.toLowerCase();
    if (lowerGuest === 'true') {
      return { isValid: true, sanitizedValue: true };
    }
    if (lowerGuest === 'false') {
      return { isValid: true, sanitizedValue: false };
    }
  }

  return { isValid: false, error: 'Guest checkout flag must be a boolean value' };
};

/**
 * Rate limiting storage (in-memory for serverless functions)
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Simple rate limiting implementation
 */
export const checkRateLimit = (
  identifier: string, 
  maxRequests: number = 5, 
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): ValidationResult => {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // Clean up expired entries periodically
  if (Math.random() < 0.1) { // 10% chance
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
  }

  if (!entry || entry.resetTime < now) {
    // First request or expired window
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return { isValid: true };
  }

  if (entry.count >= maxRequests) {
    return { 
      isValid: false, 
      error: `Rate limit exceeded. Try again in ${Math.ceil((entry.resetTime - now) / 1000)} seconds.` 
    };
  }

  // Increment counter
  entry.count++;
  rateLimitStore.set(identifier, entry);
  
  return { isValid: true };
};

/**
 * Validates and sanitizes a request body for checkout
 */
export const validateCheckoutRequest = (body: any): ValidationResult => {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body is required and must be an object' };
  }

  const validations = [
    validateTier(body.tier),
    validateInterval(body.interval),
    validateAdditionalMembers(body.additionalMembers),
    validateTrial(body.trial),
    validateGuestCheckout(body.isGuestCheckout)
  ];

  // Check for any validation errors
  for (const validation of validations) {
    if (!validation.isValid) {
      return validation;
    }
  }

  // If guest checkout, validate email
  if (body.isGuestCheckout && body.guestEmail) {
    const emailValidation = validateEmail(body.guestEmail);
    if (!emailValidation.isValid) {
      return emailValidation;
    }
  }

  return {
    isValid: true,
    sanitizedValue: {
      tier: validations[0].sanitizedValue,
      interval: validations[1].sanitizedValue,
      additionalMembers: validations[2].sanitizedValue,
      trial: validations[3].sanitizedValue,
      isGuestCheckout: validations[4].sanitizedValue,
      guestEmail: body.guestEmail ? validateEmail(body.guestEmail).sanitizedValue : undefined
    }
  };
};