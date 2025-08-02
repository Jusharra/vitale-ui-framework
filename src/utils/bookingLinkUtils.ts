import { generateSlug } from './stringUtils';

/**
 * Generates a booking link for a vacation package
 * @param destinationName The destination name to create a slug from
 * @param baseUrl Optional base URL, defaults to VITE_APP_URL
 * @returns Complete booking link URL
 */
export const generateBookingLink = (destinationName: string, baseUrl?: string): string => {
  const appUrl = baseUrl || import.meta.env.VITE_APP_URL || 'https://vitalehealthconcierge.doctor';
  
  // Remove trailing slash from base URL
  const cleanBaseUrl = appUrl.replace(/\/$/, '');
  
  // Generate URL-friendly slug from destination name
  const slug = generateSlug(destinationName);
  
  // Return the complete booking link
  return `${cleanBaseUrl}/book/${slug}`;
};

/**
 * Validates if a booking link follows the correct format
 * @param link The booking link to validate
 * @returns boolean indicating if the link is valid
 */
export const validateBookingLink = (link: string): boolean => {
  if (!link) return false;
  
  try {
    const url = new URL(link);
    const expectedDomain = import.meta.env.VITE_APP_URL || 'https://vitalehealthconcierge.doctor';
    const expectedDomainObj = new URL(expectedDomain);
    
    // Check if domain matches and path starts with /book/
    return url.hostname === expectedDomainObj.hostname && url.pathname.startsWith('/book/');
  } catch {
    return false;
  }
};

/**
 * Fixes an existing booking link to use the correct domain and format
 * @param existingLink The current booking link
 * @param destinationName The destination name for fallback slug generation
 * @returns Fixed booking link
 */
export const fixBookingLink = (existingLink: string, destinationName: string): string => {
  if (!existingLink || existingLink.includes('example.com')) {
    // Generate new link if missing or using example.com
    return generateBookingLink(destinationName);
  }
  
  try {
    const url = new URL(existingLink);
    const correctDomain = import.meta.env.VITE_APP_URL || 'https://vitalehealthconcierge.doctor';
    const correctDomainObj = new URL(correctDomain);
    
    // If domain is wrong, fix it
    if (url.hostname !== correctDomainObj.hostname) {
      return `${correctDomain}${url.pathname}`;
    }
    
    // If path doesn't start with /book/, fix it
    if (!url.pathname.startsWith('/book/')) {
      const slug = generateSlug(destinationName);
      return `${correctDomain}/book/${slug}`;
    }
    
    // Link is already correct
    return existingLink;
  } catch {
    // Invalid URL, generate new one
    return generateBookingLink(destinationName);
  }
};