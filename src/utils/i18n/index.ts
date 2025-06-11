
import { createContext, useContext } from 'react';

export type SupportedLanguage = 'en' | 'es' | 'pt' | 'en-uk' | 'en-ca' | 'en-za' | 'fr' | 'sw';

interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

export const supportedLanguages = [
  { code: 'en', name: 'English (US)' },
  { code: 'es', name: 'Español (Latinoamérica)' },
  { code: 'pt', name: 'Português' },
  { code: 'en-uk', name: 'English (UK)' },
  { code: 'en-ca', name: 'English (Canada)' },
  { code: 'en-za', name: 'English (South Africa)' },
  { code: 'fr', name: 'Français' },
  { code: 'sw', name: 'Kiswahili' }
];

export const defaultLanguage: SupportedLanguage = 'en';

// Default empty context
export const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: defaultLanguage,
  changeLanguage: () => {},
  t: (key) => key,
});

// Hook to use translations throughout the app
export const useTranslation = () => useContext(LanguageContext);
