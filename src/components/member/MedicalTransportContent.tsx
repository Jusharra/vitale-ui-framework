
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useAccessCheck } from '@/hooks/useToolAccess';
import { Transport } from '@/components/admin/care-teams/useCareTeamsData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AccessDeniedCard from './transport/AccessDeniedCard';
import TransportBookingForm, { TransportFormValues } from './transport/TransportBookingForm';
import TransportPaymentSummary from './transport/TransportPaymentSummary';
import VipTransportConcierge from './transport/VipTransportConcierge';

const MedicalTransportContent: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [transportProviders, setTransportProviders] = useState<Transport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Transport | null>(null);
  const { user, membershipTier } = useAuth();
  const { hasAccess } = useAccessCheck(user?.id || null, 'medical_transport');
  const { hasAccess: hasVipTransport } = useAccessCheck(user?.id || null, 'vip_transport');
  
  const [formValues, setFormValues] = useState<TransportFormValues | null>(null);

  // Fetch transport providers from Supabase
  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('transports')
          .select('*')
          .eq('status', 'active')
          .order('name');
        
        if (error) throw error;
        setTransportProviders(data || []);
      } catch (error) {
        console.error('Error fetching transport providers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load transport providers',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, [toast]);

  // Handle form submission to proceed to payment
  const onSubmit = (values: TransportFormValues) => {
    console.log("Form values:", values);
    setFormValues(values);
    
    // Find the selected provider
    const provider = transportProviders.find(p => p.id === values.transportProvider);
    if (provider) {
      setSelectedProvider(provider);
    }
    
    // Move to the next step (payment)
    setStep(2);
  };

  // Handle payment process (would integrate with Stripe)
  const handlePayment = async () => {
    toast({
      title: "Payment Processing",
      description: "This would connect to Stripe for real payment processing.",
    });
    
    // In a real implementation, you would:
    // 1. Call a Supabase Edge Function to create a Stripe Checkout Session
    // 2. Redirect to the Stripe Checkout page
    // 3. Handle the return from Stripe (success or cancel)
    
    // For now, just show a success message
    setTimeout(() => {
      toast({
        title: "Booking Successful",
        description: "Your transport has been booked successfully!",
        variant: "default",
      });
      // Reset the form and go back to step 1
      setStep(1);
    }, 2000);
  };

  if (!hasAccess) {
    return <AccessDeniedCard />;
  }

  return (
    <div className="space-y-6">
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Book Medical Transport</CardTitle>
            <CardDescription>
              Fill in the details to book medical transport services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransportBookingForm 
              transportProviders={transportProviders}
              isLoading={isLoading}
              onSubmit={onSubmit}
            />
          </CardContent>
        </Card>
      )}

      {step === 2 && selectedProvider && formValues && (
        <TransportPaymentSummary
          selectedProvider={selectedProvider}
          formValues={formValues}
          membershipTier={membershipTier || 'smart'}
          onBack={() => setStep(1)}
          onPayment={handlePayment}
        />
      )}

      {hasVipTransport && <VipTransportConcierge />}
    </div>
  );
};

export default MedicalTransportContent;
