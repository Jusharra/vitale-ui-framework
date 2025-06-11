import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { defaultPartnerFormValues } from './partners/schema';
import PartnerForm from './partners/PartnerForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PartnerFormValues } from './partners/schema';
import { Loader2 } from 'lucide-react';

interface EditPartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  partnerId: string | null;
}

const EditPartnerDialog = ({ open, onOpenChange, onSuccess, partnerId }: EditPartnerDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [partnerData, setPartnerData] = useState<PartnerFormValues | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPartnerData = async () => {
      if (!partnerId || !open) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('partners')
          .select('*')
          .eq('id', partnerId)
          .single();
          
        if (error) throw error;
        
        // Transform the data to match the form schema
        const formattedData: PartnerFormValues = {
          name: data.name || '',
          first_name: data.first_name || '',
          credentials: data.credentials || '',
          email: data.email || '',
          phone: data.phone || '',
          practice_name: data.practice_name || '',
          slug: data.slug || '',
          specialties: data.specialties || [],
          languages: data.languages || [],
          specializations: data.specializations || [],
          service_area: data.service_area || '',
          hourly_rate: data.hourly_rate || '',
          bio: data.bio || '',
          accepting_new_patients: data.accepting_new_patients !== false, // Default to true if undefined
          telehealth_enabled: data.telehealth_enabled || false,
          verified: data.verified || false,
        };
        
        setPartnerData(formattedData);
      } catch (error) {
        console.error('Error fetching partner data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load partner data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPartnerData();
  }, [partnerId, open, toast]);

  const handleSubmit = async (values: PartnerFormValues) => {
    if (!partnerId) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('partners')
        .update({
          name: values.name,
          first_name: values.first_name,
          credentials: values.credentials,
          email: values.email,
          phone: values.phone,
          practice_name: values.practice_name,
          slug: values.slug,
          specialties: values.specialties,
          languages: values.languages,
          specializations: values.specializations,
          service_area: values.service_area,
          hourly_rate: values.hourly_rate,
          bio: values.bio,
          accepting_new_patients: values.accepting_new_patients,
          telehealth_enabled: values.telehealth_enabled,
          verified: values.verified,
        })
        .eq('id', partnerId);
      
      if (error) throw error;
      
      toast({
        title: 'Partner updated',
        description: 'Healthcare professional has been updated successfully',
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating partner:', error);
      toast({
        title: 'Error',
        description: 'Failed to update healthcare professional',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Healthcare Professional</DialogTitle>
          <DialogDescription>
            Update the healthcare professional's information
          </DialogDescription>
        </DialogHeader>
        
        {isLoading && !partnerData ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading partner data...</span>
          </div>
        ) : partnerData ? (
          <PartnerForm 
            defaultValues={partnerData}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            isEditing={true}
          />
        ) : (
          <div className="py-4 text-center text-muted-foreground">
            No partner data found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditPartnerDialog;