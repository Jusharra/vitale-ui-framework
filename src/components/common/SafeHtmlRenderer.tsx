import React from 'react';
import { sanitizeHtml } from '@/utils/htmlSanitizer';

interface SafeHtmlRendererProps {
  /** The HTML content to render safely */
  htmlContent: string;
  /** Additional CSS classes to apply */
  className?: string;
  /** Whether to show a fallback when content is empty */
  showFallback?: boolean;
  /** Fallback text when content is empty */
  fallbackText?: string;
}

/**
 * A component that safely renders HTML content by sanitizing it to prevent XSS attacks
 */
export const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({
  htmlContent,
  className = '',
  showFallback = false,
  fallbackText = 'No content available'
}) => {
  const sanitizedHtml = sanitizeHtml(htmlContent);

  if (!sanitizedHtml && showFallback) {
    return (
      <div className={`text-muted-foreground ${className}`}>
        {fallbackText}
      </div>
    );
  }

  if (!sanitizedHtml) {
    return null;
  }

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};