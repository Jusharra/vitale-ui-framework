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

export interface Facility {
  id: string;
  name: string;
  description?: string;
  location: string;
  care_type: string;
  price_range: string;
  spots_available: number;
  amenities?: string[];
  image_url?: string;
  images?: string[];
  videos?: string[];
  status: string;
  featured?: boolean;
  phone?: string;
  email?: string;
  hours?: string;
}

export const useCareTeamsData = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
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

      // Fetch care facilities
      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from('care_facilities')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (facilitiesError) {
        // If the table doesn't exist yet, we'll use mock data
        console.log("Care facilities table may not exist yet, using mock data");
        setFacilities([
          {
            id: '1',
            name: 'Sunset Gardens Memory Care',
            description: 'Specialized memory care facility with 24/7 support, secure environment, and personalized care plans.',
            location: 'San Mateo County, CA',
            care_type: 'Memory Care',
            price_range: '$6,500/month',
            spots_available: 3,
            amenities: ['24/7 Care', 'Secure Environment', 'Memory Programs'],
            image_url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
            status: 'active',
            featured: true
          },
          {
            id: '2',
            name: 'Oakridge Senior Living',
            description: 'Luxury senior living community with independent and assisted living options, fine dining, and resort-style amenities.',
            location: 'Orange County, CA',
            care_type: 'Long-Term Care',
            price_range: '$4,800/month',
            spots_available: 7,
            amenities: ['Fine Dining', 'Resort Amenities', 'Independent Living'],
            image_url: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
            status: 'active',
            featured: false
          },
          {
            id: '3',
            name: 'Serenity Hospice House',
            description: 'Compassionate end-of-life care in a peaceful setting with private rooms, family accommodations, and 24/7 medical support.',
            location: 'Travis County, TX',
            care_type: 'Hospice Support',
            price_range: 'Insurance accepted',
            spots_available: 1,
            amenities: ['Private Rooms', 'Family Accommodations', '24/7 Medical Support'],
            image_url: 'https://images.pexels.com/photos/3768131/pexels-photo-3768131.jpeg',
            status: 'active',
            featured: false
          },
          {
            id: '4',
            name: 'Golden Years Assisted Living',
            description: 'Upscale assisted living community with personalized care plans, luxury amenities, and a vibrant social calendar.',
            location: 'Los Angeles County, CA',
            care_type: 'Assisted Living',
            price_range: '$5,200/month',
            spots_available: 5,
            amenities: ['Personalized Care', 'Luxury Amenities', 'Social Activities'],
            image_url: 'https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg',
            status: 'active',
            featured: true
          },
          {
            id: '5',
            name: 'Lakeside Retirement Village',
            description: 'Active adult community with lakefront views, independent living cottages, and comprehensive wellness programs.',
            location: 'Collin County, TX',
            care_type: 'Independent Living',
            price_range: '$3,800/month',
            spots_available: 12,
            amenities: ['Lakefront Views', 'Private Cottages', 'Wellness Programs'],
            image_url: 'https://images.pexels.com/photos/2736388/pexels-photo-2736388.jpeg',
            status: 'active',
            featured: false
          }
        ]);
      } else {
        setFacilities(facilitiesData || []);
      }

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
    facilities,
    isLoading,
    refetchData: fetchData
  };
};