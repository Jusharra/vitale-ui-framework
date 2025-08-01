
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ThermometerSun } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { usePrescriptionData } from './pharmacy/usePrescriptionData';
import RefillRequestForm from './pharmacy/RefillRequestForm';
import { RefillRequestFormValues } from './pharmacy/types';

interface Delivery {
  id: string;
  trackingId: string;
  medications: string[];
  status: 'in transit' | 'delivered' | 'processing';
  estimatedDelivery: string;
  progress: number;
  deliveryMethod?: string;
}

const PharmacyDelivery = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { profile } = useAuth();
  const { medications, refillRequests, isLoading, submitRefillRequest } = usePrescriptionData();

  useEffect(() => {
    // Transform refill requests into delivery format for delivery tracking
    const deliveryRequests = refillRequests.filter(request => 
      request.delivery_type !== 'pickup' && request.delivery_type !== ''
    );
    
    const mockDeliveries: Delivery[] = deliveryRequests.map(request => ({
      id: request.id,
      trackingId: `VTL-${Math.floor(10000000 + Math.random() * 90000000)}`,
      medications: [medications.find(med => med.id === request.medication_id)?.name || 'Unknown Medication'],
      status: request.status === 'approved' ? 'in transit' : 
             request.status === 'completed' ? 'delivered' : 'processing',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      progress: request.status === 'approved' ? 60 : 
               request.status === 'completed' ? 100 : 20,
      deliveryMethod: request.delivery_type
    }));
    
    setDeliveries(mockDeliveries);
  }, [refillRequests, medications]);

  const handleRefillRequest = async (values: RefillRequestFormValues): Promise<boolean> => {
    const success = await submitRefillRequest(values);
    if (success) {
      setIsDialogOpen(false);
    }
    return success;
  };

  if (isLoading) {
    return <div>Loading deliveries...</div>;
  }

  if (deliveries.length === 0) {
    return (
      <div className="text-center p-10">
        <div className="mx-auto bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <ThermometerSun className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">No Active Deliveries</h3>
        <p className="text-muted-foreground mb-4">
          You don't have any prescription deliveries in progress
        </p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Schedule a Delivery</Button>
          </DialogTrigger>
          <RefillRequestForm 
            medications={medications}
            onSubmit={handleRefillRequest}
            onSuccess={() => setIsDialogOpen(false)}
          />
        </Dialog>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {deliveries.map((delivery) => (
        <Card key={delivery.id} className="overflow-hidden">
          <div className={`h-2 ${delivery.status === 'in transit' ? 'bg-primary' : delivery.status === 'delivered' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle>Prescription Delivery</CardTitle>
              <Badge variant={delivery.status === "delivered" ? "outline" : "default"}>
                {delivery.status === "in transit" ? "In Transit" : 
                 delivery.status === "delivered" ? "Delivered" : "Processing"}
              </Badge>
            </div>
            <CardDescription>Tracking ID: {delivery.trackingId}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Medications</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {delivery.medications.map((med, index) => (
                  <li key={index}>{med}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">Delivery Progress</p>
                <p className="text-sm text-muted-foreground">
                  Estimated: {new Date(delivery.estimatedDelivery).toLocaleDateString()}
                </p>
              </div>
              <Progress value={delivery.progress} className="h-2" />
              
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Processed</span>
                <span>In Transit</span>
                <span>Delivered</span>
              </div>
            </div>
            
            {delivery.deliveryMethod && (
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">Delivery Method</p>
                <p className="text-sm text-muted-foreground">
                  {delivery.deliveryMethod === 'standard' ? 'Standard Delivery (2-3 days)' :
                   delivery.deliveryMethod === 'express' ? 'Express Delivery (Next day)' :
                   delivery.deliveryMethod === 'drone' ? 'Drone Delivery (Same day)' :
                   delivery.deliveryMethod}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Track Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PharmacyDelivery;
