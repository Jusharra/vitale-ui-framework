
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
  status: string; // Changed from optional to required to match the expected type
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

export interface Transport {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  service_area?: string;
  services?: string;
  available_24_7?: boolean;
  wheelchair_accessible?: boolean;
  status: string;
  insurance_accepted?: string;
  profile_image?: string;
  rating?: number;
}

export const useCareTeamsData = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
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
      
      // Ensure all partners have a status property
      const partnersWithStatus = partnersData?.map(partner => ({
        ...partner,
        status: partner.status || 'inactive' // Set a default status if it's missing
      })) || [];
      
      setPartners(partnersWithStatus);
      
      // Fetch pharmacies
      const { data: pharmaciesData, error: pharmaciesError } = await supabase
        .from('pharmacies')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (pharmaciesError) throw pharmaciesError;
      setPharmacies(pharmaciesData || []);

      // Fetch transports
      const { data: transportsData, error: transportsError } = await supabase
        .from('transports')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (transportsError) throw transportsError;
      setTransports(transportsData || []);

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
    transports,
    isLoading,
    refetchData: fetchData
  };
};
