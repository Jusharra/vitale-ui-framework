
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TelehealthProviders from './telehealth/TelehealthProviders';
import UpcomingTelehealthSessions from './telehealth/UpcomingTelehealthSessions';
import TelehealthHistory from './telehealth/TelehealthHistory';

const TelehealthContent = () => {
  return (
    <Tabs defaultValue="providers" className="w-full">
      <TabsList className="grid w-full md:w-[400px] grid-cols-3">
        <TabsTrigger value="providers">Providers</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="providers" className="pt-6">
        <TelehealthProviders />
      </TabsContent>
      
      <TabsContent value="upcoming" className="pt-6">
        <UpcomingTelehealthSessions />
      </TabsContent>
      
      <TabsContent value="history" className="pt-6">
        <TelehealthHistory />
      </TabsContent>
    </Tabs>
  );
};

export default TelehealthContent;
