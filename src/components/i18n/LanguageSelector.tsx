
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useTranslation } from '@/utils/i18n';
import { supportedLanguages } from '@/utils/i18n';

interface LanguageSelectorProps {
  variant?: 'default' | 'minimal';
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ 
  variant = 'default',
  className = ''
}) => {
  const { currentLanguage, changeLanguage } = useTranslation();
  
  // Get the current language name for display
  const currentLanguageName = supportedLanguages.find(
    lang => lang.code === currentLanguage
  )?.name || 'English';
  
  const handleLanguageChange = (value: string) => {
    changeLanguage(value as any);
  };
  
  if (variant === 'minimal') {
    return (
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className={`w-[100px] ${className}`}>
          <SelectValue placeholder={currentLanguageName} />
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map(lang => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium">Language / Idioma / Langue / Lugha</label>
      <Select value={currentLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={currentLanguageName} />
        </SelectTrigger>
        <SelectContent>
          {supportedLanguages.map(lang => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
