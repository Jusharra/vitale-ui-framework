
import React, { useState } from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';
import PrescriptionManagement from '@/components/member/PrescriptionManagement';
import PharmacyDelivery from '@/components/member/PharmacyDelivery';
import PharmacyFinder from '@/components/member/PharmacyFinder';

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
          </div>
          
          <PrescriptionManagement />
        </TabsContent>
        
        {/* Delivery Tab */}
        <TabsContent value="delivery" className="space-y-4 mt-4">
          <PharmacyDelivery />
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
          </div>
          
          <PharmacyFinder />
        </TabsContent>
      </Tabs>
    </MemberPageLayout>
  );
};

export default Pharmacy;
