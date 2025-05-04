
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Settings, Users, User, Bell, Shield, Clock } from 'lucide-react';

const AdminSystemSettings: React.FC = () => {
  // Member settings state
  const [defaultMembershipTier, setDefaultMembershipTier] = useState('smart');
  const [autoApproveMembers, setAutoApproveMembers] = useState(true);
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [maxFailedLogins, setMaxFailedLogins] = useState(5);
  
  // Partner settings state
  const [partnerApprovalRequired, setPartnerApprovalRequired] = useState(true);
  const [partnerCommissionRate, setPartnerCommissionRate] = useState(15);
  const [minPartnerRating, setMinPartnerRating] = useState(4.0);
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  
  // Security settings state
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Save settings handler
  const saveMemberSettings = () => {
    // Here you would save to Supabase or your backend
    toast({
      title: "Settings Saved",
      description: "Member settings have been updated successfully.",
    });
  };

  const savePartnerSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Partner settings have been updated successfully.",
    });
  };

  const saveNotificationSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Notification settings have been updated successfully.",
    });
  };

  const saveSecuritySettings = () => {
    toast({
      title: "Settings Saved",
      description: "Security settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
          <p className="text-muted-foreground">Manage platform-wide settings and configurations</p>
        </div>
      </div>

      <Tabs defaultValue="member">
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="member">Member</TabsTrigger>
          <TabsTrigger value="partner">Partner</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Member Settings */}
        <TabsContent value="member">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle>Member Settings</CardTitle>
              </div>
              <CardDescription>Configure default settings for new and existing members.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="defaultMembershipTier">Default Membership Tier</Label>
                  <Select value={defaultMembershipTier} onValueChange={setDefaultMembershipTier}>
                    <SelectTrigger id="defaultMembershipTier">
                      <SelectValue placeholder="Select membership tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="smart">Smart</SelectItem>
                      <SelectItem value="core">Core</SelectItem>
                      <SelectItem value="vip">VIP</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    The default membership tier assigned to new members.
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoApproveMembers">Auto-approve Members</Label>
                    <Switch 
                      id="autoApproveMembers" 
                      checked={autoApproveMembers}
                      onCheckedChange={setAutoApproveMembers}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve new member registrations.
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="requireEmailVerification">Require Email Verification</Label>
                    <Switch 
                      id="requireEmailVerification" 
                      checked={requireEmailVerification}
                      onCheckedChange={setRequireEmailVerification}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Require users to verify their email before accessing member features.
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="maxFailedLogins">Maximum Failed Login Attempts</Label>
                  <Input 
                    id="maxFailedLogins" 
                    type="number" 
                    value={maxFailedLogins} 
                    onChange={(e) => setMaxFailedLogins(parseInt(e.target.value))} 
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of consecutive failed login attempts before account lockout.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={saveMemberSettings}>
                  Save Member Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partner Settings */}
        <TabsContent value="partner">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Partner Settings</CardTitle>
              </div>
              <CardDescription>Configure settings for healthcare professionals and partners.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="partnerApprovalRequired">Require Partner Approval</Label>
                    <Switch 
                      id="partnerApprovalRequired" 
                      checked={partnerApprovalRequired}
                      onCheckedChange={setPartnerApprovalRequired}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Require manual approval before partners can offer services.
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="partnerCommissionRate">Default Commission Rate (%)</Label>
                  <Input 
                    id="partnerCommissionRate" 
                    type="number" 
                    value={partnerCommissionRate} 
                    onChange={(e) => setPartnerCommissionRate(parseInt(e.target.value))} 
                  />
                  <p className="text-sm text-muted-foreground">
                    Default commission percentage for partner services.
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="minPartnerRating">Minimum Partner Rating</Label>
                  <Input 
                    id="minPartnerRating" 
                    type="number" 
                    step="0.1"
                    min="1"
                    max="5"
                    value={minPartnerRating} 
                    onChange={(e) => setMinPartnerRating(parseFloat(e.target.value))} 
                  />
                  <p className="text-sm text-muted-foreground">
                    Minimum rating required for partners to remain active.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={savePartnerSettings}>
                  Save Partner Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Notification Settings</CardTitle>
              </div>
              <CardDescription>Configure system-wide notification preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <Switch 
                      id="emailNotifications" 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow system to send email notifications.
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <Switch 
                      id="smsNotifications" 
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow system to send SMS notifications.
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <Switch 
                      id="pushNotifications" 
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Allow system to send push notifications.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={saveNotificationSettings}>
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Security Settings</CardTitle>
              </div>
              <CardDescription>Configure system-wide security settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input 
                    id="passwordMinLength" 
                    type="number" 
                    value={passwordMinLength} 
                    onChange={(e) => setPasswordMinLength(parseInt(e.target.value))} 
                  />
                  <p className="text-sm text-muted-foreground">
                    Minimum number of characters for user passwords.
                  </p>
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twoFactorAuth">Require Two-Factor Authentication</Label>
                    <Switch 
                      id="twoFactorAuth" 
                      checked={twoFactorAuth}
                      onCheckedChange={setTwoFactorAuth}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Require two-factor authentication for all users.
                  </p>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input 
                    id="sessionTimeout" 
                    type="number" 
                    value={sessionTimeout} 
                    onChange={(e) => setSessionTimeout(parseInt(e.target.value))} 
                  />
                  <p className="text-sm text-muted-foreground">
                    Duration in minutes before user sessions expire.
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={saveSecuritySettings}>
                  Save Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSystemSettings;
