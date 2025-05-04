
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Partner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  practice_name?: string;
  specialties?: string[];
  bio?: string;
  accepting_new_patients?: boolean;
  telehealth_enabled?: boolean;
  status?: string;
  profile_image?: string;
  rating?: number;
}

export interface Pharmacy {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  services?: string;
  hours?: string;
  delivery_available?: boolean;
  insurance_accepted?: string;
  status?: string;
}

export const useCareTeamsData = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch partners
      const { data: partnersData, error: partnersError } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (partnersError) throw partnersError;
      setPartners(partnersData || []);
      
      // Fetch pharmacies
      const { data: pharmaciesData, error: pharmaciesError } = await supabase
        .from('pharmacies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (pharmaciesError) throw pharmaciesError;
      setPharmacies(pharmaciesData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load team data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [toast]);

  return {
    partners,
    pharmacies,
    isLoading,
    refetchData: fetchData
  };
};
