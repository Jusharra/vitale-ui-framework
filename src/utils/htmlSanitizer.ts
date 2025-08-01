import DOMPurify from 'dompurify';

/**
 * Configuration for DOMPurify to safely sanitize HTML content
 */
const sanitizerConfig = {
  // Allow only safe HTML tags
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li',
    'blockquote',
    'a'
  ],
  // Allow only safe attributes
  ALLOWED_ATTR: [
    'href', 'title', 'class', 'id'
  ],
  // Allow only safe protocols for links
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  // Forbid tags
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
  // Forbid attributes
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
  // Remove unsafe elements completely
  SANITIZE_DOM: true,
  SANITIZE_NAMED_PROPS: true,
  KEEP_CONTENT: true,
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param htmlContent - The HTML content to sanitize
 * @returns Sanitized HTML string safe for dangerouslySetInnerHTML
 */
export const sanitizeHtml = (htmlContent: string): string => {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(htmlContent, sanitizerConfig);
};

/**
 * Strips all HTML tags and returns plain text
 * @param htmlContent - The HTML content to strip
 * @returns Plain text without HTML tags
 */
export const stripHtml = (htmlContent: string): string => {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(htmlContent, { ALLOWED_TAGS: [], KEEP_CONTENT: true });
};

/**
 * Creates a safe excerpt from HTML content
 * @param htmlContent - The HTML content to create excerpt from
 * @param maxLength - Maximum length of the excerpt (default: 150)
 * @returns Safe plain text excerpt
 */
export const createSafeExcerpt = (htmlContent: string, maxLength: number = 150): string => {
  const plainText = stripHtml(htmlContent);
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength).trim() + '...'
    : plainText;
};