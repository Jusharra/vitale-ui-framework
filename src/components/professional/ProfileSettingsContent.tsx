
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, Award, Clock, MapPin, Plus, X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

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
  availableHours: "Monday to Friday, 9:00 AM - 5:00 PM"
};

const ProfileSettingsContent: React.FC = () => {
  const [professionalData, setProfessionalData] = useState(mockProfessionalData);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [activeTab, setActiveTab] = useState<'general' | 'specialties' | 'education'>('general');
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your professional information and specialties</p>
      </div>

      <div className="flex space-x-2 border-b">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2 px-4 ${activeTab === 'general' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
        >
          General Information
        </button>
        <button
          onClick={() => setActiveTab('specialties')}
          className={`pb-2 px-4 ${activeTab === 'specialties' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
        >
          Specialties
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`pb-2 px-4 ${activeTab === 'education' ? 'border-b-2 border-primary font-medium' : 'text-muted-foreground'}`}
        >
          Education & Certifications
        </button>
      </div>

      {activeTab === 'general' && (
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
      )}

      {activeTab === 'specialties' && (
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
      )}

      {activeTab === 'education' && (
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
      )}
    </div>
  );
};

export default ProfileSettingsContent;
