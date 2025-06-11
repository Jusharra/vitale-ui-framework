import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PartnerFormValues } from './schema';

export const usePartnerSubmission = (onSuccess: () => void, onClose: () => void) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: PartnerFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('partners')
        .insert({
          name: values.name,
          first_name: values.first_name,
          credentials: values.credentials,
          email: values.email,
          phone: values.phone,
          practice_name: values.practice_name,
          specialties: values.specialties, // This will now be an array after the transform
          languages: values.languages,
          specializations: values.specializations,
          service_area: values.service_area,
          hourly_rate: values.hourly_rate,
          bio: values.bio,
          accepting_new_patients: values.accepting_new_patients,
          telehealth_enabled: values.telehealth_enabled,
          verified: values.verified,
          status: 'active',
          slug: values.slug,
        });

      if (error) throw error;

      toast({
        title: 'Partner created',
        description: 'New healthcare partner has been added successfully',
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating partner:', error);
      toast({
        title: 'Error',
        description: 'Failed to create healthcare partner',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};