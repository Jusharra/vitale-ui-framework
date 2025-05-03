
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  User,
  UserPlus,
  MapPin,
} from "lucide-react";

// Mock data
const providers = {
  physicians: [
    { id: 'p1', name: 'Dr. Sarah Johnson', specialty: 'Family Medicine', availableSlots: 3, image: '/placeholder.svg' },
    { id: 'p2', name: 'Dr. Michael Chen', specialty: 'Internal Medicine', availableSlots: 2, image: '/placeholder.svg' },
    { id: 'p3', name: 'Dr. Emily Rodriguez', specialty: 'Family Medicine', availableSlots: 1, image: '/placeholder.svg' },
    { id: 'p4', name: 'Dr. James Wilson', specialty: 'Internal Medicine', availableSlots: 4, image: '/placeholder.svg' },
  ],
  physicianAssistants: [
    { id: 'pa1', name: 'Alex Turner, PA-C', specialty: 'Primary Care', availableSlots: 5, image: '/placeholder.svg' },
    { id: 'pa2', name: 'Jessica Martinez, PA-C', specialty: 'Family Medicine', availableSlots: 3, image: '/placeholder.svg' },
  ],
  nursesPractitioners: [
    { id: 'np1', name: 'Robert Davis, NP', specialty: 'Primary Care', availableSlots: 4, image: '/placeholder.svg' },
    { id: 'np2', name: 'Linda Thompson, NP', specialty: 'Family Medicine', availableSlots: 2, image: '/placeholder.svg' },
    { id: 'np3', name: 'Karen Wilson, NP', specialty: 'Geriatric Care', availableSlots: 6, image: '/placeholder.svg' },
  ],
  psychiatrists: [
    { id: 'psy1', name: 'Dr. Rachel Green', specialty: 'General Psychiatry', availableSlots: 2, image: '/placeholder.svg' },
    { id: 'psy2', name: 'Dr. Benjamin Hoffman', specialty: 'Child & Adolescent Psychiatry', availableSlots: 1, image: '/placeholder.svg' },
    { id: 'psy3', name: 'Dr. Michelle Lee', specialty: 'Geriatric Psychiatry', availableSlots: 3, image: '/placeholder.svg' },
  ]
};

const pharmacies = [
  { id: 'ph1', name: 'Wellness Pharmacy', address: '123 Health St, Cityville', hours: '8am-9pm', distance: '0.8 miles' },
  { id: 'ph2', name: 'MedExpress Pharmacy', address: '456 Care Ave, Townsburg', hours: '24 hours', distance: '1.2 miles' },
  { id: 'ph3', name: 'Community Health Pharmacy', address: '789 Wellness Blvd, Healthton', hours: '9am-7pm', distance: '1.5 miles' },
  { id: 'ph4', name: 'QuickScript Pharmacy', address: '101 Medicine Dr, Careville', hours: '8am-10pm', distance: '2.3 miles' },
];

// Mock currently selected providers/pharmacy
const currentTeam = {
  physician: 'p1',
  physicianAssistant: 'pa1',
  nursePractitioner: 'np1',
  psychiatrist: 'psy1',
  pharmacy: 'ph1'
};

const ConciergeContent = () => {
  const [activeTab, setActiveTab] = useState<string>("providers");
  const [selectedPhysician, setSelectedPhysician] = useState<string>(currentTeam.physician);
  const [selectedPA, setSelectedPA] = useState<string>(currentTeam.physicianAssistant);
  const [selectedNP, setSelectedNP] = useState<string>(currentTeam.nursePractitioner);
  const [selectedPsychiatrist, setSelectedPsychiatrist] = useState<string>(currentTeam.psychiatrist);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>(currentTeam.pharmacy);
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");

  // Filter providers by specialty
  const filterProvidersBySpecialty = (providerList: any[]) => {
    if (specialtyFilter === "all") return providerList;
    return providerList.filter(provider => 
      provider.specialty.toLowerCase().includes(specialtyFilter.toLowerCase())
    );
  };

  // Get filtered lists
  const filteredPhysicians = filterProvidersBySpecialty(providers.physicians);
  const filteredPAs = filterProvidersBySpecialty(providers.physicianAssistants);
  const filteredNPs = filterProvidersBySpecialty(providers.nursesPractitioners);
  const filteredPsychiatrists = filterProvidersBySpecialty(providers.psychiatrists);

  const handleSaveTeam = () => {
    // In a real app, this would save to backend
    toast.success("Your concierge team has been updated!");
  };

  const handleSavePharmacy = () => {
    // In a real app, this would save to backend
    toast.success("Your preferred pharmacy has been updated!");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="providers" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="providers">My Healthcare Team</TabsTrigger>
          <TabsTrigger value="pharmacy">My Pharmacy</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-6">
          <div className="flex justify-end">
            <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="family">Family Medicine</SelectItem>
                <SelectItem value="internal">Internal Medicine</SelectItem>
                <SelectItem value="primary">Primary Care</SelectItem>
                <SelectItem value="geriatric">Geriatric Care</SelectItem>
                <SelectItem value="psychiatry">Psychiatry</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Primary Care Physician</CardTitle>
              <CardDescription>Select your primary doctor</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPhysician} onValueChange={setSelectedPhysician}>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredPhysicians.map(physician => (
                    <div key={physician.id} className="flex items-start space-x-4">
                      <RadioGroupItem value={physician.id} id={`physician-${physician.id}`} className="mt-1" />
                      <div className="flex flex-1 items-start space-x-4 rounded-md border p-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor={`physician-${physician.id}`} className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {physician.name}
                          </label>
                          <p className="text-sm text-muted-foreground">{physician.specialty}</p>
                          <div className="flex items-center pt-1">
                            {physician.availableSlots > 0 ? (
                              <Badge className="bg-green-500 hover:bg-green-600">
                                {physician.availableSlots} slots available
                              </Badge>
                            ) : (
                              <Badge variant="outline">No availability</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Physician Assistant</CardTitle>
              <CardDescription>Select your physician assistant</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPA} onValueChange={setSelectedPA}>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredPAs.map(pa => (
                    <div key={pa.id} className="flex items-start space-x-4">
                      <RadioGroupItem value={pa.id} id={`pa-${pa.id}`} className="mt-1" />
                      <div className="flex flex-1 items-start space-x-4 rounded-md border p-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor={`pa-${pa.id}`} className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {pa.name}
                          </label>
                          <p className="text-sm text-muted-foreground">{pa.specialty}</p>
                          <div className="flex items-center pt-1">
                            {pa.availableSlots > 0 ? (
                              <Badge className="bg-green-500 hover:bg-green-600">
                                {pa.availableSlots} slots available
                              </Badge>
                            ) : (
                              <Badge variant="outline">No availability</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nurse Practitioner</CardTitle>
              <CardDescription>Select your nurse practitioner</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedNP} onValueChange={setSelectedNP}>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredNPs.map(np => (
                    <div key={np.id} className="flex items-start space-x-4">
                      <RadioGroupItem value={np.id} id={`np-${np.id}`} className="mt-1" />
                      <div className="flex flex-1 items-start space-x-4 rounded-md border p-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor={`np-${np.id}`} className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {np.name}
                          </label>
                          <p className="text-sm text-muted-foreground">{np.specialty}</p>
                          <div className="flex items-center pt-1">
                            {np.availableSlots > 0 ? (
                              <Badge className="bg-green-500 hover:bg-green-600">
                                {np.availableSlots} slots available
                              </Badge>
                            ) : (
                              <Badge variant="outline">No availability</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Psychiatrist</CardTitle>
              <CardDescription>Select your psychiatrist</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPsychiatrist} onValueChange={setSelectedPsychiatrist}>
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredPsychiatrists.map(psychiatrist => (
                    <div key={psychiatrist.id} className="flex items-start space-x-4">
                      <RadioGroupItem value={psychiatrist.id} id={`psychiatrist-${psychiatrist.id}`} className="mt-1" />
                      <div className="flex flex-1 items-start space-x-4 rounded-md border p-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor={`psychiatrist-${psychiatrist.id}`} className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {psychiatrist.name}
                          </label>
                          <p className="text-sm text-muted-foreground">{psychiatrist.specialty}</p>
                          <div className="flex items-center pt-1">
                            {psychiatrist.availableSlots > 0 ? (
                              <Badge className="bg-green-500 hover:bg-green-600">
                                {psychiatrist.availableSlots} slots available
                              </Badge>
                            ) : (
                              <Badge variant="outline">No availability</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveTeam}>Save Healthcare Team</Button>
          </div>
        </TabsContent>

        <TabsContent value="pharmacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferred Pharmacy</CardTitle>
              <CardDescription>Select your preferred pharmacy for prescription refills</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedPharmacy} onValueChange={setSelectedPharmacy}>
                <div className="grid gap-4 md:grid-cols-2">
                  {pharmacies.map(pharmacy => (
                    <div key={pharmacy.id} className="flex items-start space-x-4">
                      <RadioGroupItem value={pharmacy.id} id={`pharmacy-${pharmacy.id}`} className="mt-1" />
                      <div className="flex flex-1 items-start space-x-4 rounded-md border p-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor={`pharmacy-${pharmacy.id}`} className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {pharmacy.name}
                          </label>
                          <p className="text-sm text-muted-foreground">{pharmacy.address}</p>
                          <div className="flex flex-col pt-1">
                            <span className="text-sm">{pharmacy.hours}</span>
                            <span className="text-sm text-muted-foreground">{pharmacy.distance}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSavePharmacy}>Save Preferred Pharmacy</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConciergeContent;
