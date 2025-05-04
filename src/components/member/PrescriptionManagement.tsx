
import React, { useState } from 'react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePrescriptionData } from './pharmacy/usePrescriptionData';
import ActivePrescriptions from './pharmacy/ActivePrescriptions';
import RefillRequests from './pharmacy/RefillRequests';
import RefillRequestForm from './pharmacy/RefillRequestForm';
import { RefillRequestFormValues } from './pharmacy/types';

const PrescriptionManagement = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { 
    medications, 
    refillRequests, 
    isLoading, 
    submitRefillRequest, 
    getMedicationById 
  } = usePrescriptionData();

  const handleRefillRequest = async (values: RefillRequestFormValues) => {
    const success = await submitRefillRequest(values);
    return success;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Prescriptions</TabsTrigger>
          <TabsTrigger value="refills">Refill Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">My Prescriptions</h3>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button>Request Refill</Button>
              </DialogTrigger>
              <RefillRequestForm 
                medications={medications} 
                onSubmit={handleRefillRequest}
                onSuccess={() => setOpenDialog(false)} 
              />
            </Dialog>
          </div>
          
          <ActivePrescriptions 
            medications={medications} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="refills" className="space-y-4 pt-4">
          <h3 className="text-lg font-medium">Refill Requests</h3>
          
          <RefillRequests 
            refillRequests={refillRequests}
            getMedicationById={getMedicationById}
            isLoading={isLoading}
            onRequestRefill={() => setOpenDialog(true)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PrescriptionManagement;
