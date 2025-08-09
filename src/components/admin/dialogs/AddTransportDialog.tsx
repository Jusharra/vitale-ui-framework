
import React from 'react';
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
import MediaUploader from '@/components/common/MediaUploader';
interface AddTransportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
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
  profile_image?: string;
}

const AddTransportDialog = ({ open, onOpenChange, onSuccess }: AddTransportDialogProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<TransportFormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      service_area: '',
      services: '',
      available_24_7: false,
      wheelchair_accessible: true,
      insurance_accepted: '',
      profile_image: '',
    }
  });

  const onSubmit = async (data: TransportFormValues) => {
    try {
      const { error } = await supabase.from('transports').insert({
        ...data,
        profile_image: data.profile_image || null,
        status: 'active',
      });
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Transport provider added successfully',
      });
      
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error adding transport provider:', error);
      toast({
        title: 'Error',
        description: 'Failed to add transport provider',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Transport Provider</DialogTitle>
            <DialogDescription>
              Add a new medical transport service provider to the system.
            </DialogDescription>
          </DialogHeader>
          
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
              <Label className="text-right">
                Available 24/7
              </Label>
              <div className="flex items-center space-x-2">
                <Switch id="available_24_7" {...register('available_24_7')} />
                <Label htmlFor="available_24_7">Service available 24 hours</Label>
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Wheelchair
              </Label>
              <div className="flex items-center space-x-2">
                <Switch id="wheelchair_accessible" {...register('wheelchair_accessible')} defaultChecked />
                <Label htmlFor="wheelchair_accessible">Wheelchair accessible</Label>
              </div>
            </div>
            </div>
            
            <div className="grid gap-2 py-2">
              <Label>Feature Image</Label>
              <MediaUploader
                currentUrl={watch('profile_image') || ''}
                onUpload={(url) => setValue('profile_image', url, { shouldDirty: true })}
                onRemove={() => setValue('profile_image', '', { shouldDirty: true })}
                folder="transports"
              />
            </div>
            
            <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Provider'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransportDialog;
