import React from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description is required'),
  location: z.string().min(2, 'Location is required'),
  care_type: z.string().min(2, 'Care type is required'),
  price_range: z.string().min(2, 'Price range is required'),
  spots_available: z.coerce.number().min(0, 'Spots available must be a positive number'),
  amenities: z.string().optional(),
  image_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface AddFacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddFacilityDialog = ({ open, onOpenChange, onSuccess }: AddFacilityDialogProps) => {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      care_type: '',
      price_range: '',
      spots_available: 0,
      amenities: '',
      image_url: '',
      featured: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      // Convert amenities string to array
      const amenitiesArray = values.amenities 
        ? values.amenities.split(',').map(item => item.trim()).filter(Boolean) 
        : [];

      // Check if the care_facilities table exists
      const { error: tableCheckError } = await supabase
        .from('care_facilities')
        .select('id')
        .limit(1);

      // If the table doesn't exist, create it
      if (tableCheckError) {
        console.log("Creating care_facilities table");
        
        // Create the table
        const { error: createTableError } = await supabase.rpc('create_care_facilities_table');
        
        if (createTableError) {
          // If the RPC function doesn't exist, we'll try to create the table directly
          const { error: directCreateError } = await supabase.rpc('execute_sql', {
            sql_query: `
              CREATE TABLE IF NOT EXISTS care_facilities (
                id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
                name text NOT NULL,
                description text,
                location text NOT NULL,
                care_type text NOT NULL,
                price_range text NOT NULL,
                spots_available integer DEFAULT 0,
                amenities text[],
                image_url text,
                status text DEFAULT 'active',
                featured boolean DEFAULT false,
                created_at timestamptz DEFAULT now(),
                updated_at timestamptz DEFAULT now()
              );
              
              ALTER TABLE care_facilities ENABLE ROW LEVEL SECURITY;
              
              CREATE POLICY "Admins can manage care facilities"
                ON care_facilities
                FOR ALL
                TO authenticated
                USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
                WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
              
              CREATE POLICY "Public can view active care facilities"
                ON care_facilities
                FOR SELECT
                TO public
                USING (status = 'active');
            `
          });
          
          if (directCreateError) {
            console.error("Error creating table:", directCreateError);
            throw new Error("Failed to create care facilities table");
          }
        }
      }

      // Insert the new facility
      const { error } = await supabase
        .from('care_facilities')
        .insert({
          name: values.name,
          description: values.description,
          location: values.location,
          care_type: values.care_type,
          price_range: values.price_range,
          spots_available: values.spots_available,
          amenities: amenitiesArray,
          image_url: values.image_url || null,
          status: 'active',
          featured: values.featured,
        });

      if (error) throw error;

      toast({
        title: 'Facility created',
        description: 'New care facility has been added successfully',
      });
      
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating facility:', error);
      toast({
        title: 'Error',
        description: 'Failed to create care facility',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Care Facility</DialogTitle>
          <DialogDescription>
            Create a new care facility for your placement services
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facility Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Sunset Gardens Memory Care" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the facility and its services" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="San Mateo County, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="care_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Care Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select care type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Memory Care">Memory Care</SelectItem>
                        <SelectItem value="Hospice Support">Hospice Support</SelectItem>
                        <SelectItem value="Respite / Short-Term">Respite / Short-Term</SelectItem>
                        <SelectItem value="Long-Term Board & Care">Long-Term Board & Care</SelectItem>
                        <SelectItem value="Assisted Living">Assisted Living</SelectItem>
                        <SelectItem value="Independent Living">Independent Living</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price_range"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Range</FormLabel>
                    <FormControl>
                      <Input placeholder="$4,500/month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="spots_available"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Spots</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities</FormLabel>
                  <FormControl>
                    <Input placeholder="24/7 Care, Secure Environment, Memory Programs" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter amenities separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured Facility</FormLabel>
                    <FormDescription>
                      Featured facilities appear prominently on the placements page
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
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Facility</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFacilityDialog;