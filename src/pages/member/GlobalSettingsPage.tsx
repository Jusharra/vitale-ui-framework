
import React from 'react';
import Layout from '@/components/layout/Layout';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import GlobalSettings from '@/components/member/GlobalSettings';
import { useTranslation } from '@/utils/i18n';

const GlobalSettingsPage = () => {
  const { t } = useTranslation();
  
  return (
    <MemberPageLayout 
      title={t('settings.global')}
      description={t('settings.globalDescription')}
    >
      <GlobalSettings />
    </MemberPageLayout>
  );
};

export default GlobalSettingsPage;
