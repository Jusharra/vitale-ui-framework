
import React, { useState } from 'react';
import { useTranslation } from '@/utils/i18n';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { supportedLanguages } from '@/utils/i18n';
import { Globe } from 'lucide-react';

const FloatingLanguageSelector: React.FC = () => {
  const { changeLanguage, currentLanguage, t } = useTranslation();
  const [open, setOpen] = useState(false);

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode as any);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed bottom-4 right-4 rounded-full shadow-lg z-50 bg-white"
        >
          <Globe className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>{t('settings.language')}</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          {supportedLanguages.map((lang) => (
            <Button
              key={lang.code}
              variant={currentLanguage === lang.code ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => handleLanguageChange(lang.code)}
            >
              {lang.name}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FloatingLanguageSelector;
