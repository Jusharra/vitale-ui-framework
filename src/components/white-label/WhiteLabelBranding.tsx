
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useWhiteLabel } from '@/hooks/useWhiteLabel';
import { Loader2 } from 'lucide-react';
import { StripeCheckout } from '@/components/payments';

interface WhiteLabelBrandingProps {
  partnerId: string;
}

const WhiteLabelBranding: React.FC<WhiteLabelBrandingProps> = ({ partnerId }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { branding, isWhiteLabeled } = useWhiteLabel();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: branding.companyName,
    primaryColor: branding.primaryColor,
    secondaryColor: branding.secondaryColor,
    contactEmail: branding.contactEmail || '',
    contactPhone: branding.contactPhone || '',
    subdomain: branding.subdomain || '',
    customDomain: branding.customDomain || '',
    logo: branding.logo || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('partners')
        .update({
          practice_name: formData.companyName,
          email: formData.contactEmail || null,
          phone: formData.contactPhone || null,
          subdomain: formData.subdomain || null,
          custom_domain: formData.customDomain || null,
          branding: {
            logo: formData.logo,
            primaryColor: formData.primaryColor,
            secondaryColor: formData.secondaryColor
          }
        })
        .eq('id', partnerId);
      
      if (error) throw error;
      
      toast({
        title: 'Branding updated',
        description: 'Your white-label branding has been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving white-label branding:', error);
      toast({
        title: 'Update failed',
        description: 'There was a problem updating your branding settings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>White-Label Branding</CardTitle>
        <CardDescription>
          Customize your branded portal experience for your clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={isWhiteLabeled ? "branding" : "setup"}>
          <TabsList className="mb-4">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="branding" disabled={!isWhiteLabeled}>Branding</TabsTrigger>
            <TabsTrigger value="domain" disabled={!isWhiteLabeled}>Domain</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup">
            {isWhiteLabeled ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-800">
                  <h4 className="font-medium">White-Label Active</h4>
                  <p>Your white-label portal is active and can be customized.</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">White-Label Status</h4>
                    <p className="text-sm text-muted-foreground">Your subscription is active</p>
                  </div>
                  <Button variant="outline">Manage Subscription</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800">
                  <h4 className="font-medium">Get Started with White-Labeling</h4>
                  <p>Create your own branded platform for your patients or clients.</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">White-Label Setup Fee</h4>
                  <p className="text-sm text-muted-foreground">A one-time setup fee is required to enable white-labeling for your practice.</p>
                  
                  <div className="mt-4">
                    <Button>Purchase White-Label Setup ($3,000)</Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="branding" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input 
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="Your Company Name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="logo">Logo URL</Label>
                <Input 
                  id="logo"
                  name="logo"
                  value={formData.logo || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="primaryColor"
                    name="primaryColor"
                    value={formData.primaryColor}
                    onChange={handleInputChange}
                    placeholder="#0369a1"
                  />
                  <input 
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-10 h-10 p-1 rounded border"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <div className="flex gap-2">
                  <Input 
                    id="secondaryColor"
                    name="secondaryColor"
                    value={formData.secondaryColor}
                    onChange={handleInputChange}
                    placeholder="#06b6d4"
                  />
                  <input 
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-10 h-10 p-1 rounded border"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input 
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  placeholder="support@yourcompany.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input 
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleSaveChanges} 
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Branding Changes
            </Button>
          </TabsContent>
          
          <TabsContent value="domain" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <div className="flex items-center">
                  <Input 
                    id="subdomain"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleInputChange}
                    placeholder="yourcompany"
                    className="rounded-r-none"
                  />
                  <span className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-muted-foreground">
                    .vitaleplatform.com
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  A free subdomain for your white-label portal.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain (Premium)</Label>
                <Input 
                  id="customDomain"
                  name="customDomain"
                  value={formData.customDomain}
                  onChange={handleInputChange}
                  placeholder="health.yourcompany.com"
                />
                <p className="text-xs text-muted-foreground">
                  Use your own domain. Additional setup required.
                </p>
              </div>
            </div>
            
            <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
              <p className="font-medium">Domain Configuration</p>
              <p>After saving, you'll need to update DNS settings with your domain provider.</p>
            </div>
            
            <Button 
              onClick={handleSaveChanges} 
              disabled={isLoading}
              className="mt-4"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Domain Settings
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WhiteLabelBranding;
