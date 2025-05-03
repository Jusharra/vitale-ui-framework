
import React, { useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, CircleCheck, Clock, Search, CircleChevronRight, ThermometerSun } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Mock data
const prescriptions = [
  {
    id: 1,
    name: "Lisinopril 10mg",
    doctor: "Dr. Sarah Johnson",
    status: "active",
    refillsLeft: 3,
    nextRefill: "May 15, 2025",
    instructions: "Take 1 tablet by mouth once daily",
    lastFilled: "April 15, 2025",
  },
  {
    id: 2,
    name: "Atorvastatin 20mg",
    doctor: "Dr. Sarah Johnson",
    status: "active",
    refillsLeft: 2,
    nextRefill: "May 20, 2025",
    instructions: "Take 1 tablet by mouth once daily at bedtime",
    lastFilled: "April 20, 2025",
  },
  {
    id: 3,
    name: "Metformin 500mg",
    doctor: "Dr. Michael Chen",
    status: "active",
    refillsLeft: 0,
    nextRefill: "Refill needed",
    instructions: "Take 1 tablet by mouth twice daily with meals",
    lastFilled: "April 5, 2025",
  },
];

const deliveries = [
  {
    id: 1,
    trackingId: "VTL-78945623",
    prescriptions: ["Lisinopril 10mg", "Atorvastatin 20mg"],
    status: "in transit",
    estimatedDelivery: "May 12, 2025",
    progress: 60,
  }
];

const nearbyPharmacies = [
  {
    id: 1,
    name: "Vitale Health Pharmacy",
    address: "123 Health Blvd, San Francisco, CA 94103",
    phone: "(415) 555-1234",
    hours: "8:00 AM - 8:00 PM",
    distance: "0.8 miles",
    partnerStatus: "preferred",
  },
  {
    id: 2,
    name: "Community Pharmacy",
    address: "456 Wellness Ave, San Francisco, CA 94103",
    phone: "(415) 555-5678",
    hours: "9:00 AM - 7:00 PM",
    distance: "1.2 miles",
    partnerStatus: "network",
  },
  {
    id: 3,
    name: "Downtown Drugstore",
    address: "789 Market St, San Francisco, CA 94103",
    phone: "(415) 555-9012",
    hours: "24 hours",
    distance: "1.7 miles",
    partnerStatus: "network",
  },
];

const Pharmacy = () => {
  const [activeTab, setActiveTab] = useState("prescriptions");

  return (
    <MemberPageLayout 
      title="Pharmacy" 
      description="Manage your prescriptions and pharmacy services"
    >
      <Tabs defaultValue="prescriptions" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="delivery">Delivery</TabsTrigger>
          <TabsTrigger value="pharmacies">Find Pharmacy</TabsTrigger>
        </TabsList>
        
        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search medications..." 
                className="pl-8 w-full sm:w-[300px]"
              />
            </div>
            <Button>Request Refill</Button>
          </div>
          
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <Card key={prescription.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <Pill className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{prescription.name}</CardTitle>
                        <CardDescription>{prescription.doctor}</CardDescription>
                      </div>
                    </div>
                    <Badge 
                      variant={prescription.refillsLeft === 0 ? "outline" : "default"}
                      className={prescription.refillsLeft === 0 ? "border-destructive text-destructive" : ""}
                    >
                      {prescription.refillsLeft === 0 ? "Refill Needed" : `${prescription.refillsLeft} Refills Left`}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Instructions</p>
                      <p className="text-sm text-muted-foreground">{prescription.instructions}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Filled</p>
                      <p className="text-sm text-muted-foreground">{prescription.lastFilled}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <div className="w-full sm:w-auto flex flex-row gap-2 flex-1">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      disabled={prescription.refillsLeft === 0}
                    >
                      Schedule Delivery
                    </Button>
                    <Button 
                      variant={prescription.refillsLeft === 0 ? "default" : "outline"}
                      className="flex-1"
                    >
                      Request Refill
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    Details
                    <CircleChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Delivery Tab */}
        <TabsContent value="delivery" className="space-y-4 mt-4">
          {deliveries.length > 0 ? (
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <Card key={delivery.id} className="overflow-hidden">
                  <div className={`h-2 ${delivery.status === 'in transit' ? 'bg-primary' : 'bg-green-500'}`}></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle>Prescription Delivery</CardTitle>
                      <Badge variant={delivery.status === "delivered" ? "outline" : "default"}>
                        {delivery.status === "in transit" ? "In Transit" : "Delivered"}
                      </Badge>
                    </div>
                    <CardDescription>Tracking ID: {delivery.trackingId}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-1">Medications</p>
                      <ul className="list-disc list-inside text-sm text-muted-foreground">
                        {delivery.prescriptions.map((med, index) => (
                          <li key={index}>{med}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium">Delivery Progress</p>
                        <p className="text-sm text-muted-foreground">
                          Estimated: {delivery.estimatedDelivery}
                        </p>
                      </div>
                      <Progress value={delivery.progress} className="h-2" />
                      
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Processed</span>
                        <span>In Transit</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Track Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-10">
              <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <ThermometerSun className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Active Deliveries</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any prescription deliveries in progress
              </p>
              <Button>Schedule a Delivery</Button>
            </div>
          )}
        </TabsContent>
        
        {/* Find Pharmacy Tab */}
        <TabsContent value="pharmacies" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input 
                placeholder="Search by location..." 
                className="pl-8 w-full sm:w-[300px]"
              />
            </div>
            <Button variant="outline">Filter Options</Button>
          </div>
          
          <div className="space-y-4">
            {nearbyPharmacies.map((pharmacy) => (
              <Card key={pharmacy.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{pharmacy.name}</CardTitle>
                    {pharmacy.partnerStatus === "preferred" ? (
                      <Badge>Preferred Partner</Badge>
                    ) : (
                      <Badge variant="outline">In Network</Badge>
                    )}
                  </div>
                  <CardDescription>{pharmacy.distance} away</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{pharmacy.address}</p>
                    </div>
                    <div>
                      <div className="mb-2">
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{pharmacy.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Hours</p>
                        <p className="text-sm text-muted-foreground">{pharmacy.hours}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="w-full sm:w-auto">Get Directions</Button>
                  <Button variant="outline" className="w-full sm:w-auto">Call</Button>
                  <Button className="w-full sm:w-auto">Transfer Prescription</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </MemberPageLayout>
  );
};

export default Pharmacy;
