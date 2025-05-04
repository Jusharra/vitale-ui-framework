
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RegionalSettings from '@/components/common/RegionalSettings';
import LanguageSelector from '@/components/i18n/LanguageSelector';
import { useTranslation } from '@/utils/i18n';

const GlobalSettings: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t('settings.global')}</h1>
      <p className="text-muted-foreground">
        {t('settings.globalDescription')}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.language')}</CardTitle>
            <CardDescription>
              {t('settings.languageDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LanguageSelector />
          </CardContent>
        </Card>
        
        <RegionalSettings />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.accessibility')}</CardTitle>
          <CardDescription>
            {t('settings.accessibilityDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Accessibility settings would go here */}
          <p className="text-muted-foreground text-sm">
            {t('settings.comingSoon')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalSettings;
