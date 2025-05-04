
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThermometerSun } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import useToolAccess from '@/hooks/useToolAccess';

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
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useAuth();
  const { hasAccess: hasDeliveryAccess } = useToolAccess('prescription_delivery');

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setIsLoading(true);
        if (!profile) return;
        
        // This would be replaced with actual data from the prescription_deliveries table
        // For now, using mock data based on refill_requests table
        const { data: refillRequests, error } = await supabase
          .from('refill_requests')
          .select(`
            id, status, delivery_type, notes,
            medication:medication_id (name)
          `)
          .eq('patient_id', profile.id)
          .eq('delivery_type', 'standard')
          .or('delivery_type.eq.express,delivery_type.eq.drone');
        
        if (error) throw error;
        
        // Transform data into delivery format (in real implementation, would be from prescription_deliveries table)
        const mockDeliveries: Delivery[] = (refillRequests || []).map(request => ({
          id: request.id,
          trackingId: `VTL-${Math.floor(10000000 + Math.random() * 90000000)}`,
          medications: [request.medication?.name || 'Unknown Medication'],
          status: request.status === 'approved' ? 'in transit' : 
                 request.status === 'completed' ? 'delivered' : 'processing',
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          progress: request.status === 'approved' ? 60 : 
                   request.status === 'completed' ? 100 : 20,
          deliveryMethod: request.delivery_type
        }));
        
        setDeliveries(mockDeliveries);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your prescription deliveries',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeliveries();
  }, [profile]);

  if (!hasDeliveryAccess) {
    return (
      <Card className="bg-muted/50 border-dashed">
        <CardHeader>
          <CardTitle>Premium Feature: Prescription Delivery</CardTitle>
          <CardDescription>
            Prescription delivery service is available to members with Smart Access or higher.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-6 text-center">
            <ThermometerSun className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upgrade Your Membership</h3>
            <p className="text-muted-foreground mb-4">
              Get your prescriptions delivered right to your door with Smart Access or higher membership.
            </p>
            <Button>Upgrade Membership</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
        <Button>Schedule a Delivery</Button>
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
