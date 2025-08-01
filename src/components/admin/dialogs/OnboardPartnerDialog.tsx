import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CreditCard } from 'lucide-react';

interface OnboardPartnerDialogProps {
  partner: {
    id: string;
    name: string;
    email: string;
    stripe_connect_account_id?: string;
    connect_onboarding_complete?: boolean;
  };
  onSuccess?: () => void;
}

export function OnboardPartnerDialog({ partner, onSuccess }: OnboardPartnerDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleOnboarding = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('onboard-partner', {
        body: { partnerId: partner.id },
      });

      if (error) {
        throw error;
      }

      if (data?.onboarding_url) {
        // Open Stripe Connect onboarding in new tab
        window.open(data.onboarding_url, '_blank');
        setOpen(false);
        
        toast({
          title: 'Onboarding initiated',
          description: `Stripe Connect onboarding opened for ${partner.name}`,
        });

        onSuccess?.();
      } else {
        throw new Error('No onboarding URL returned');
      }
    } catch (error) {
      console.error('Partner onboarding error:', error);
      toast({
        title: 'Onboarding failed',
        description: error.message || 'Failed to initiate partner onboarding',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAlreadyOnboarded = partner.stripe_connect_account_id && partner.connect_onboarding_complete;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={isAlreadyOnboarded ? "outline" : "default"}
          size="sm"
          disabled={isAlreadyOnboarded}
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {isAlreadyOnboarded ? 'Connected' : 'Setup Payments'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Setup Stripe Connect</DialogTitle>
          <DialogDescription>
            Initialize Stripe Connect onboarding for {partner.name} to enable revenue sharing 
            for their referred members.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">What happens next:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Partner will complete Stripe Connect onboarding</li>
              <li>• Revenue sharing will be automatically activated</li>
              <li>• Partner receives 70% of member subscription revenue</li>
              <li>• Platform retains 30% as service fee</li>
            </ul>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Partner must complete the full onboarding process 
              including identity verification to receive payments.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleOnboarding} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initiating...
              </>
            ) : (
              'Start Onboarding'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}