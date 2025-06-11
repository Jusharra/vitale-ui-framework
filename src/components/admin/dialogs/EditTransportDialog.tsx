import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface EditTransportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  transportId: string | null;
}

interface TransportFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  service_area: string;
  services: string;
  available_24_7: boolean;
  wheelchair_accessible: boolean;
  insurance_accepted: string;
  status: string;
}

const EditTransportDialog = ({ open, onOpenChange, onSuccess, transportId }: EditTransportDialogProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<TransportFormValues>();

  useEffect(() => {
    const fetchTransportData = async () => {
      if (!transportId || !open) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('transports')
          .select('*')
          .eq('id', transportId)
          .single();
          
        if (error) throw error;
        
        // Set form values
        reset({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          service_area: data.service_area || '',
          services: data.services || '',
          available_24_7: data.available_24_7 || false,
          wheelchair_accessible: data.wheelchair_accessible !== false, // Default to true if undefined
          insurance_accepted: data.insurance_accepted || '',
          status: data.status || 'active',
        });
      } catch (error) {
        console.error('Error fetching transport data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load transport provider data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransportData();
  }, [transportId, open, reset, toast]);

  const onSubmit = async (data: TransportFormValues) => {
    if (!transportId) return;
    
    try {
      const { error } = await supabase
        .from('transports')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          service_area: data.service_area,
          services: data.services,
          available_24_7: data.available_24_7,
          wheelchair_accessible: data.wheelchair_accessible,
          insurance_accepted: data.insurance_accepted,
          status: data.status,
        })
        .eq('id', transportId);
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Transport provider updated successfully',
      });
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating transport provider:', error);
      toast({
        title: 'Error',
        description: 'Failed to update transport provider',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Transport Provider</DialogTitle>
          <DialogDescription>
            Update the transport provider's information
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading transport data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name *
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && <p className="col-span-3 col-start-2 text-sm text-red-500">{errors.name.message}</p>}
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-3"
                  {...register('email')}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  className="col-span-3"
                  {...register('phone')}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  className="col-span-3"
                  {...register('address')}
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="service_area" className="text-right">
                  Service Area
                </Label>
                <Input
                  id="service_area"
                  className="col-span-3"
                  {...register('service_area')}
                  placeholder="e.g., Downtown, 5 mile radius"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="services" className="text-right">
                  Services
                </Label>
                <Textarea
                  id="services"
                  className="col-span-3"
                  {...register('services')}
                  placeholder="e.g., Emergency transport, Non-emergency, Senior transport"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="insurance_accepted" className="text-right">
                  Insurance
                </Label>
                <Input
                  id="insurance_accepted"
                  className="col-span-3"
                  {...register('insurance_accepted')}
                  placeholder="e.g., Medicare, Blue Cross"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <select
                  id="status"
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  {...register('status')}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Available 24/7
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="available_24_7" 
                    {...register('available_24_7')}
                    onCheckedChange={(checked) => setValue('available_24_7', checked)}
                  />
                  <Label htmlFor="available_24_7">Service available 24 hours</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Wheelchair
                </Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="wheelchair_accessible" 
                    {...register('wheelchair_accessible')}
                    onCheckedChange={(checked) => setValue('wheelchair_accessible', checked)}
                  />
                  <Label htmlFor="wheelchair_accessible">Wheelchair accessible</Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : 'Update Provider'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditTransportDialog;