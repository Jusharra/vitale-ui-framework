
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import AppointmentsTab from "./AppointmentsTab";
import HealthTab from "./HealthTab";
import ServicesTab from "./ServicesTab";

// Mock data
const upcomingAppointments = [
  {
    id: 1,
    type: "Wellness Check",
    provider: "Dr. Emily Johnson",
    date: "2025-05-20",
    time: "10:00 AM",
    location: "Downtown Medical Center",
  },
];

const healthMetrics = [
  { name: "Blood Pressure", value: "120/80", status: "normal" },
  { name: "Heart Rate", value: "72 bpm", status: "normal" },
  { name: "Blood Glucose", value: "110 mg/dL", status: "elevated" },
  { name: "Cholesterol", value: "190 mg/dL", status: "normal" },
  { name: "BMI", value: "24.5", status: "normal" },
];

const DashboardTabs: React.FC = () => {
  return (
    <Tabs defaultValue="appointments" className="w-full">
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="health">Health</TabsTrigger>
        <TabsTrigger value="services">Services</TabsTrigger>
      </TabsList>
      <TabsContent value="appointments" className="mt-4 space-y-4">
        <AppointmentsTab appointments={upcomingAppointments} />
      </TabsContent>
      <TabsContent value="health" className="mt-4">
        <HealthTab healthMetrics={healthMetrics} />
      </TabsContent>
      <TabsContent value="services" className="mt-4">
        <ServicesTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
