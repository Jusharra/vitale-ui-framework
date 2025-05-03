
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { User, Phone, Mail, Award, Clock, MapPin, Plus, X, Bell } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Mock specialties data
const availableSpecialties = [
  "Cardiology", "Dermatology", "Endocrinology", "Family Medicine", "Gastroenterology",
  "Hematology", "Infectious Disease", "Internal Medicine", "Nephrology", "Neurology",
  "Obstetrics & Gynecology", "Oncology", "Ophthalmology", "Orthopedics", "Otolaryngology",
  "Pediatrics", "Psychiatry", "Pulmonology", "Radiology", "Rheumatology", "Urology"
];

// Mock professional data
const mockProfessionalData = {
  name: "Dr. James Wilson",
  title: "Cardiologist",
  email: "james.wilson@example.com",
  phone: "(555) 123-4567",
  location: "San Francisco, CA",
  bio: "Board-certified cardiologist with over 15 years of experience in treating heart diseases. Specialized in interventional cardiology and heart failure management.",
  education: [
    { id: 1, institution: "Stanford University School of Medicine", degree: "MD", year: "2005" },
    { id: 2, institution: "University of California, Berkeley", degree: "BS Biology", year: "2001" }
  ],
  certifications: [
    { id: 1, name: "American Board of Internal Medicine - Cardiovascular Disease", year: "2008" },
    { id: 2, name: "Advanced Cardiac Life Support (ACLS)", year: "2023" }
  ],
  specialties: ["Cardiology", "Interventional Cardiology", "Heart Failure"],
  availableHours: "Monday to Friday, 9:00 AM - 5:00 PM",
  notificationPreferences: {
    emailNotifications: true,
    appNotifications: true,
    appointmentReminders: true,
    messageAlerts: true,
    systemUpdates: false,
    marketingEmails: false,
    weeklyDigest: true,
    urgentAlerts: true
  }
};

const ProfileSettingsContent: React.FC = () => {
  const [professionalData, setProfessionalData] = useState(mockProfessionalData);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [activeTab, setActiveTab] = useState<'general' | 'specialties' | 'education' | 'notifications'>('general');
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Profile updated",
      description: "Your professional profile has been successfully updated.",
    });
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() !== "" && !professionalData.specialties.includes(newSpecialty)) {
      setProfessionalData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty]
      }));
      setNewSpecialty("");
    }
  };

  const handleRemoveSpecialty = (specialtyToRemove: string) => {
    setProfessionalData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(specialty => specialty !== specialtyToRemove)
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfessionalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (settingName: string, checked: boolean) => {
    setProfessionalData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [settingName]: checked
      }
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your professional information and specialties</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="general" onClick={() => setActiveTab('general')}>General Information</TabsTrigger>
          <TabsTrigger value="specialties" onClick={() => setActiveTab('specialties')}>Specialties</TabsTrigger>
          <TabsTrigger value="education" onClick={() => setActiveTab('education')}>Education & Certifications</TabsTrigger>
          <TabsTrigger value="notifications" onClick={() => setActiveTab('notifications')}>Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your basic professional information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium" htmlFor="name">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="name"
                      name="name"
                      className="pl-8" 
                      value={professionalData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium" htmlFor="title">Professional Title</label>
                  <Input 
                    id="title"
                    name="title"
                    value={professionalData.title}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      className="pl-8" 
                      value={professionalData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium" htmlFor="phone">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="phone"
                      name="phone"
                      className="pl-8" 
                      value={professionalData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="location">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="location"
                    name="location"
                    className="pl-8" 
                    value={professionalData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="availableHours">Available Hours</label>
                <div className="relative">
                  <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="availableHours"
                    name="availableHours"
                    className="pl-8" 
                    value={professionalData.availableHours}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="bio">Professional Bio</label>
                <Textarea 
                  id="bio"
                  name="bio"
                  rows={5}
                  value={professionalData.bio}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="specialties">
          <Card>
            <CardHeader>
              <CardTitle>Specialties and Expertise</CardTitle>
              <CardDescription>
                Select your medical specialties and areas of expertise
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {professionalData.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" className="py-1.5 flex items-center gap-1">
                        <span>{specialty}</span>
                        <button 
                          className="ml-1 hover:bg-muted rounded-full"
                          onClick={() => handleRemoveSpecialty(specialty)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2 items-end">
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium" htmlFor="newSpecialty">Add Specialty</label>
                    <Input 
                      id="newSpecialty"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      list="specialties"
                      placeholder="Enter or select a specialty"
                    />
                    <datalist id="specialties">
                      {availableSpecialties.map((specialty) => (
                        <option key={specialty} value={specialty} />
                      ))}
                    </datalist>
                  </div>
                  <Button onClick={handleAddSpecialty}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="education">
          <Card>
            <CardHeader>
              <CardTitle>Education & Certifications</CardTitle>
              <CardDescription>
                Update your educational background and professional certifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Education
                </h3>
                {professionalData.education.map((item, index) => (
                  <div key={item.id} className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.institution}</p>
                        <p className="text-sm text-muted-foreground">{item.degree}, {item.year}</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Education
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Certifications
                </h3>
                {professionalData.certifications.map((item) => (
                  <div key={item.id} className="border rounded-md p-4 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Issued: {item.year}</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Certification
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Customize how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium" htmlFor="email-notifications">Email Notifications</label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={professionalData.notificationPreferences.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium" htmlFor="app-notifications">App Notifications</label>
                      <p className="text-sm text-muted-foreground">Receive notifications in the app</p>
                    </div>
                    <Switch 
                      id="app-notifications" 
                      checked={professionalData.notificationPreferences.appNotifications}
                      onCheckedChange={(checked) => handleNotificationChange('appNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium" htmlFor="appointment-reminders">Appointment Reminders</label>
                      <p className="text-sm text-muted-foreground">Receive reminders about upcoming appointments</p>
                    </div>
                    <Switch 
                      id="appointment-reminders" 
                      checked={professionalData.notificationPreferences.appointmentReminders}
                      onCheckedChange={(checked) => handleNotificationChange('appointmentReminders', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium" htmlFor="message-alerts">Message Alerts</label>
                      <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                    </div>
                    <Switch 
                      id="message-alerts" 
                      checked={professionalData.notificationPreferences.messageAlerts}
                      onCheckedChange={(checked) => handleNotificationChange('messageAlerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium" htmlFor="system-updates">System Updates</label>
                      <p className="text-sm text-muted-foreground">Receive updates about system changes</p>
                    </div>
                    <Switch 
                      id="system-updates" 
                      checked={professionalData.notificationPreferences.systemUpdates}
                      onCheckedChange={(checked) => handleNotificationChange('systemUpdates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium" htmlFor="marketing-emails">Marketing Emails</label>
                      <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
                    </div>
                    <Switch 
                      id="marketing-emails" 
                      checked={professionalData.notificationPreferences.marketingEmails}
                      onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium" htmlFor="weekly-digest">Weekly Digest</label>
                      <p className="text-sm text-muted-foreground">Receive a weekly summary of activities</p>
                    </div>
                    <Switch 
                      id="weekly-digest" 
                      checked={professionalData.notificationPreferences.weeklyDigest}
                      onCheckedChange={(checked) => handleNotificationChange('weeklyDigest', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium" htmlFor="urgent-alerts">Urgent Alerts</label>
                      <p className="text-sm text-muted-foreground">Receive notifications for urgent matters</p>
                    </div>
                    <Switch 
                      id="urgent-alerts" 
                      checked={professionalData.notificationPreferences.urgentAlerts}
                      onCheckedChange={(checked) => handleNotificationChange('urgentAlerts', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Notification Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileSettingsContent;
