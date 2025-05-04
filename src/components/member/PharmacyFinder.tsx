
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Pharmacy {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  hours?: string;
  distance: string;
  partnerStatus?: 'preferred' | 'network';
  delivery_available?: boolean;
}

const PharmacyFinder = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        setIsLoading(true);
        
        // Fetch pharmacies from Supabase
        const { data, error } = await supabase
          .from('pharmacies')
          .select('*')
          .eq('status', 'active')
          .order('name');
        
        if (error) throw error;
        
        // Transform data to include mock distances
        const pharmaciesWithDistance = (data || []).map(pharmacy => ({
          ...pharmacy,
          distance: `${(Math.random() * 5).toFixed(1)} miles`,
          partnerStatus: Math.random() > 0.5 ? 'preferred' : 'network'
        })) as Pharmacy[];
        
        setPharmacies(pharmaciesWithDistance);
      } catch (error) {
        console.error('Error fetching pharmacies:', error);
        toast({
          title: 'Error',
          description: 'Failed to load pharmacy information',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPharmacies();
  }, []);

  const handleTransferPrescription = (pharmacyId: string) => {
    toast({
      title: "Transfer Initiated",
      description: "Your prescription transfer request has been submitted.",
    });
  };

  if (isLoading) {
    return <div>Loading pharmacies...</div>;
  }

  return (
    <div className="space-y-4">
      {pharmacies.length > 0 ? (
        pharmacies.map((pharmacy) => (
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
                  <p className="text-sm text-muted-foreground">{pharmacy.address || 'Address not available'}</p>
                </div>
                <div>
                  <div className="mb-2">
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{pharmacy.phone || 'Phone not available'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Hours</p>
                    <p className="text-sm text-muted-foreground">{pharmacy.hours || 'Hours not available'}</p>
                  </div>
                </div>
              </div>
              {pharmacy.delivery_available && (
                <div className="mt-2">
                  <Badge variant="secondary">Delivery Available</Badge>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2 flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="w-full sm:w-auto">Get Directions</Button>
              <Button variant="outline" className="w-full sm:w-auto">
                {pharmacy.phone ? `Call ${pharmacy.phone}` : 'Call Pharmacy'}
              </Button>
              <Button 
                className="w-full sm:w-auto"
                onClick={() => handleTransferPrescription(pharmacy.id)}
              >
                Transfer Prescription
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-medium">No Pharmacies Found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              No pharmacies match your search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PharmacyFinder;
