
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LanguageSelector from '@/components/i18n/LanguageSelector';
import { useTranslation } from '@/utils/i18n';

const AdminSystemSettings = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">System Settings</h1>
      <p className="text-muted-foreground">
        Configure global system settings and defaults.
      </p>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Configuration</CardTitle>
              <CardDescription>
                Manage basic site settings and configuration options.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Site settings would go here */}
              <p className="text-muted-foreground text-sm">
                Coming soon
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
              <CardDescription>
                Toggle features on and off globally.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Feature flags would go here */}
              <p className="text-muted-foreground text-sm">
                Coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security settings for the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Security settings would go here */}
              <p className="text-muted-foreground text-sm">
                Coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="regional" className="space-y-4">
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
          
          <Card>
            <CardHeader>
              <CardTitle>Default Region</CardTitle>
              <CardDescription>
                Set the default region and localization settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Regional settings would go here */}
              <p className="text-muted-foreground text-sm">
                Coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSystemSettings;
