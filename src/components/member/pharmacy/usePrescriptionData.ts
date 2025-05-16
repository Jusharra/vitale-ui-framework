import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Medication, RefillRequest } from './types';
import { useAuth } from '@/context/AuthContext';

export const usePrescriptionData = () => {
  const { toast } = useToast();
  const { user } = useAuth(); // Add this to get the current user
  const [medications, setMedications] = useState<Medication[]>([]);
  const [refillRequests, setRefillRequests] = useState<RefillRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMedications = async () => {
      setIsLoading(true);
      try {
        const { data: medsData, error: medsError } = await supabase
          .from('medications')
          .select('*')
          .order('name');
          
        if (medsError) throw medsError;
        
        const { data: reqData, error: reqError } = await supabase
          .from('refill_requests')
          .select('*')
          .order('request_date', { ascending: false });
          
        if (reqError) throw reqError;
        
        setMedications(medsData || []);
        setRefillRequests(reqData as RefillRequest[] || []);
      } catch (error) {
        console.error('Error fetching prescriptions data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load prescription information',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMedications();
  }, [toast]);

  const submitRefillRequest = async (values: { medication_id: string; delivery_type: string; notes?: string }) => {
    try {
      const { medication_id, delivery_type, notes } = values;
      
      // Make sure we have a user ID
      if (!user || !user.id) {
        toast({
          title: 'Error',
          description: 'You must be logged in to request a refill',
          variant: 'destructive',
        });
        return false;
      }
      
      const { data, error } = await supabase
        .from('refill_requests')
        .insert({
          medication_id,
          delivery_type,
          notes,
          status: 'pending',
          patient_id: user.id // Add the patient_id field with the current user's ID
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setRefillRequests(prev => [data as RefillRequest, ...prev]);
      
      toast({
        title: 'Refill Requested',
        description: 'Your prescription refill has been requested.',
      });

      return true;
    } catch (error) {
      console.error('Error submitting refill request:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit refill request',
        variant: 'destructive',
      });
      return false;
    }
  };
  
  const getMedicationById = (id: string): Medication | undefined => {
    return medications.find(med => med.id === id);
  };

  return {
    medications,
    refillRequests,
    isLoading,
    submitRefillRequest,
    getMedicationById
  };
};