import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QuickIntakeFormData {
  fullName: string;
  email: string;
  phone: string;
  zipCode: string;
  serviceNeeded: string;
  urgency: string;
}

const initialFormData: QuickIntakeFormData = {
  fullName: '',
  email: '',
  phone: '',
  zipCode: '',
  serviceNeeded: '',
  urgency: ''
};

export const useQuickIntakeForm = () => {
  const [formData, setFormData] = useState<QuickIntakeFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateField = (field: keyof QuickIntakeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your full name",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: "Validation Error", 
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your phone number",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.zipCode.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your zip code",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.serviceNeeded) {
      toast({
        title: "Validation Error",
        description: "Please select a service needed",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.urgency) {
      toast({
        title: "Validation Error",
        description: "Please select urgency level",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const splitFullName = (fullName: string) => {
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    return { firstName, lastName };
  };

  const submitForm = async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setIsSubmitting(true);

    try {
      const { firstName, lastName } = splitFullName(formData.fullName);

      const leadData = {
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        phone: formData.phone,
        zip_code: formData.zipCode,
        service_needed: formData.serviceNeeded,
        urgency: formData.urgency,
        source: 'website_intake_form',
        status: 'new',
        lead_score: 50 // Default score for website submissions
      };

      const { error } = await supabase
        .from('leads')
        .insert([leadData]);

      if (error) {
        throw error;
      }

      toast({
        title: "Request Submitted!",
        description: "Thank you! We'll contact you within 24 hours to discuss your healthcare needs.",
        variant: "default"
      });

      // Reset form
      setFormData(initialFormData);
      return true;

    } catch (error) {
      console.error('Error submitting lead:', error);
      toast({
        title: "Submission Failed",
        description: "Sorry, there was an error submitting your request. Please try again or call us directly.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    updateField,
    submitForm,
    isSubmitting
  };
};