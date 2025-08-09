import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess: React.FC = () => {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const { toast } = useToast();

  useEffect(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get('session_id');

    const verify = async () => {
      if (!sessionId) {
        setStatus('error');
        return;
      }
      try {
        const { data, error } = await supabase.functions.invoke('verify-marketplace-payment', {
          body: { session_id: sessionId },
        });
        if (error) throw error;
        if (data?.verified) {
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (e: any) {
        console.error('Verification failed:', e);
        toast({ title: 'Verification failed', description: e?.message || 'Please contact support.', variant: 'destructive' });
        setStatus('error');
      }
    };

    verify();
  }, [toast]);

  return (
    <MainLayout>
      <main className="max-w-3xl mx-auto py-16 px-4">
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            <h1 className="text-2xl font-semibold">Verifying your payment…</h1>
            <p className="text-muted-foreground">This will only take a second.</p>
          </div>
        )}
        {status === 'success' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
            <h1 className="text-2xl font-semibold">Payment confirmed!</h1>
            <p className="text-muted-foreground">Thank you. Weve received your request and will assign it shortly.</p>
            <Button className="mt-4" onClick={() => (window.location.href = '/marketplace')}>Back to Marketplace</Button>
          </div>
        )}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-2xl font-semibold">We couldnt verify your payment</h1>
            <p className="text-muted-foreground">Please try again or contact support.</p>
            <Button variant="outline" className="mt-4" onClick={() => (window.location.href = '/marketplace')}>Back to Marketplace</Button>
          </div>
        )}
      </main>
    </MainLayout>
  );
};

export default PaymentSuccess;
