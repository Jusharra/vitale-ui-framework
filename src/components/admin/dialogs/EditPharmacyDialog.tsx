import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import MediaUploader from '@/components/common/MediaUploader';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  services: z.string().optional(),
  hours: z.string().optional(),
  delivery_available: z.boolean().default(false),
  insurance_accepted: z.string().optional(),
  status: z.string().default('active'),
  profile_image: z.string().url().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface EditPharmacyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  pharmacyId: string | null;
}

const EditPharmacyDialog = ({ open, onOpenChange, onSuccess, pharmacyId }: EditPharmacyDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      services: '',
      hours: '',
      delivery_available: false,
      insurance_accepted: '',
      status: 'active',
      profile_image: '',
    },
  });

  useEffect(() => {
    const fetchPharmacy = async () => {
      if (!pharmacyId || !open) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('pharmacies')
          .select('*')
          .eq('id', pharmacyId)
          .single();
          
        if (error) throw error;
        
        form.reset({
          name: data.name || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          services: data.services || '',
          hours: data.hours || '',
          delivery_available: data.delivery_available || false,
          insurance_accepted: data.insurance_accepted || '',
          status: data.status || 'active',
          profile_image: data.profile_image || '',
        });
      } catch (error) {
        console.error('Error fetching pharmacy:', error);
        toast({
          title: 'Error',
          description: 'Failed to load pharmacy data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPharmacy();
  }, [pharmacyId, open, form, toast]);

  const onSubmit = async (values: FormValues) => {
    if (!pharmacyId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('pharmacies')
        .update({
          name: values.name,
          address: values.address,
          phone: values.phone,
          email: values.email,
          services: values.services,
          hours: values.hours,
          delivery_available: values.delivery_available,
          insurance_accepted: values.insurance_accepted,
          status: values.status,
          profile_image: values.profile_image || null,
        })
        .eq('id', pharmacyId);

      if (error) throw error;

      toast({
        title: 'Pharmacy updated',
        description: 'Pharmacy has been updated successfully',
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating pharmacy:', error);
      toast({
        title: 'Error',
        description: 'Failed to update pharmacy',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Pharmacy</DialogTitle>
          <DialogDescription>
            Update pharmacy information
          </DialogDescription>
        </DialogHeader>
        
        {isLoading && !form.formState.isSubmitting ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading pharmacy data...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pharmacy Name</FormLabel>
                      <FormControl>
                        <Input placeholder="City Health Pharmacy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City, State, ZIP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="pharmacy@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="services"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Services</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Prescription filling, Medication counseling, Immunizations, etc." 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operating Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="Mon-Fri 9am-7pm, Sat 10am-5pm, Sun Closed" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="delivery_available"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Delivery Available</FormLabel>
                        <FormDescription>
                          Pharmacy offers delivery services for medications
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="insurance_accepted"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Plans Accepted</FormLabel>
                      <FormControl>
                        <Input placeholder="Medicare, Aetna, Blue Cross, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <FormLabel>Feature Image</FormLabel>
                <MediaUploader
                  currentUrl={form.watch('profile_image') || undefined}
                  onUpload={(url) => form.setValue('profile_image', url)}
                  onRemove={() => form.setValue('profile_image', '')}
                  folder="pharmacies"
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={form.formState.isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : 'Update Pharmacy'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditPharmacyDialog;