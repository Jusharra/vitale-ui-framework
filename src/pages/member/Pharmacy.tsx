
import React, { useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PharmacyPrescriptionsTab from '@/components/member/pharmacy/PharmacyPrescriptionsTab';
import PharmacyDeliveryTab from '@/components/member/pharmacy/PharmacyDeliveryTab';
import PharmacyFinderTab from '@/components/member/pharmacy/PharmacyFinderTab';

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
        <TabsContent value="prescriptions">
          <PharmacyPrescriptionsTab />
        </TabsContent>
        
        {/* Delivery Tab */}
        <TabsContent value="delivery">
          <PharmacyDeliveryTab />
        </TabsContent>
        
        {/* Find Pharmacy Tab */}
        <TabsContent value="pharmacies">
          <PharmacyFinderTab />
        </TabsContent>
      </Tabs>
    </MemberPageLayout>
  );
};

export default Pharmacy;
