
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/utils/i18n';
import LanguageSelector from '@/components/i18n/LanguageSelector';

const AuthHeader: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-md flex justify-between items-center mb-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')} 
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('navigation.backToHome')}
      </Button>
      <LanguageSelector variant="compact" />
    </div>
  );
};

export default AuthHeader;
