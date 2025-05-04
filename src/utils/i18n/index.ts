
import { createContext, useContext } from 'react';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'sw';

export interface LanguageContextType {
  currentLanguage: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
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
