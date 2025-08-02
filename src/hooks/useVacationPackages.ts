import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface VacationPackage {
  id: string;
  destination_name: string;
  region: string;
  description_short: string;
  description_full: string;
  price: number;
  duration: string;
  package_type: string;
  image_url: string;
  status: string;
  amenities: string[];
  available_dates: {
    start_date: string;
    end_date: string;
  };
  featured: boolean;
  booking_link?: string;
  created_at?: string;
  updated_at?: string;
}

export const useVacationPackages = () => {
  const [packages, setPackages] = useState<VacationPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vacation_packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPackages: VacationPackage[] = data?.map(pkg => ({
        ...pkg,
        amenities: Array.isArray(pkg.amenities) ? pkg.amenities : [],
        available_dates: typeof pkg.available_dates === 'object' && pkg.available_dates !== null 
          ? pkg.available_dates as { start_date: string; end_date: string }
          : { start_date: '', end_date: '' },
        booking_link: pkg.booking_link || undefined,
        created_at: pkg.created_at || undefined,
        updated_at: pkg.updated_at || undefined
      })) || [];

      setPackages(formattedPackages);
    } catch (error) {
      console.error('Error fetching vacation packages:', error);
      toast({
        title: "Error",
        description: "Failed to load vacation packages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPackage = async (packageData: Omit<VacationPackage, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('vacation_packages')
        .insert([packageData])
        .select()
        .single();

      if (error) throw error;

      const formattedData: VacationPackage = {
        ...data,
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        available_dates: typeof data.available_dates === 'object' && data.available_dates !== null 
          ? data.available_dates as { start_date: string; end_date: string }
          : { start_date: '', end_date: '' }
      };
      setPackages(prev => [formattedData, ...prev]);
      toast({
        title: "Success",
        description: "Vacation package created successfully",
      });
      return data;
    } catch (error) {
      console.error('Error creating vacation package:', error);
      toast({
        title: "Error",
        description: "Failed to create vacation package",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updatePackage = async (id: string, updates: Partial<VacationPackage>) => {
    try {
      const { data, error } = await supabase
        .from('vacation_packages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const formattedData: VacationPackage = {
        ...data,
        amenities: Array.isArray(data.amenities) ? data.amenities : [],
        available_dates: typeof data.available_dates === 'object' && data.available_dates !== null 
          ? data.available_dates as { start_date: string; end_date: string }
          : { start_date: '', end_date: '' }
      };
      setPackages(prev => prev.map(pkg => pkg.id === id ? formattedData : pkg));
      toast({
        title: "Success",
        description: "Vacation package updated successfully",
      });
      return data;
    } catch (error) {
      console.error('Error updating vacation package:', error);
      toast({
        title: "Error",
        description: "Failed to update vacation package",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deletePackage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vacation_packages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPackages(prev => prev.filter(pkg => pkg.id !== id));
      toast({
        title: "Success",
        description: "Vacation package deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting vacation package:', error);
      toast({
        title: "Error",
        description: "Failed to delete vacation package",
        variant: "destructive",
      });
      throw error;
    }
  };

  const toggleFeatured = async (id: string) => {
    const pkg = packages.find(p => p.id === id);
    if (pkg) {
      await updatePackage(id, { featured: !pkg.featured });
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return {
    packages,
    loading,
    createPackage,
    updatePackage,
    deletePackage,
    toggleFeatured,
    refetch: fetchPackages
  };
};