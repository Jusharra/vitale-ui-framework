
import React, { useState, useEffect } from 'react';
import { LanguageContext, SupportedLanguage, defaultLanguage } from '@/utils/i18n';

// Import translations
import en from '@/utils/i18n/translations/en';
import es from '@/utils/i18n/translations/es';
import fr from '@/utils/i18n/translations/fr';
import sw from '@/utils/i18n/translations/sw';

interface LanguageProviderProps {
  children: React.ReactNode;
}

const translations = {
  en,
  es,
  fr,
  sw
};

const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  // Try to get stored language or use default
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    try {
      const storedLanguage = localStorage.getItem('language') as SupportedLanguage;
      return storedLanguage && Object.keys(translations).includes(storedLanguage) 
        ? storedLanguage 
        : defaultLanguage;
    } catch (e) {
      return defaultLanguage;
    }
  });

  const changeLanguage = (lang: SupportedLanguage) => {
    setCurrentLanguage(lang);
    try {
      localStorage.setItem('language', lang);
    } catch (e) {
      console.error('Failed to save language preference:', e);
    }
  };

  // Nested key access (e.g. 'user.profile.name')
  const t = (key: string): string => {
    try {
      const keys = key.split('.');
      let value = translations[currentLanguage];
      
      for (const k of keys) {
        if (value && value[k]) {
          value = value[k];
        } else {
          // Fallback to English if key not found
          value = en;
          for (const fallbackKey of keys) {
            if (value && value[fallbackKey]) {
              value = value[fallbackKey];
            } else {
              return key; // Return the key if not found in fallback
            }
          }
          break;
        }
      }
      
      return typeof value === 'string' ? value : key;
    } catch (e) {
      return key; // Return key as fallback
    }
  };
  
  // Set html lang attribute
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      changeLanguage,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
