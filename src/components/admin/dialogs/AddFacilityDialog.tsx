import React, { useState } from 'react';
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
import { Upload, X, Plus, Image, FileVideo, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description is required'),
  location: z.string().min(2, 'Location is required'),
  care_type: z.string().min(2, 'Care type is required'),
  price_range: z.string().min(2, 'Price range is required'),
  spots_available: z.coerce.number().min(0, 'Spots available must be a positive number'),
  amenities: z.string().optional(),
  media: z.array(z.object({
    file: z.instanceof(File).optional(),
    url: z.string().optional(),
    type: z.enum(['image', 'video']),
    isUploading: z.boolean().default(false),
    isUploaded: z.boolean().default(false),
    path: z.string().optional(),
  })).default([]),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
      media: [],
      featured: false,
    },
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newMedia = Array.from(files).map(file => ({
      file,
      type,
      isUploading: false,
      isUploaded: false,
    }));

    const currentMedia = form.getValues('media') || [];
    form.setValue('media', [...currentMedia, ...newMedia]);
    
    // Reset the input value so the same file can be selected again if needed
    event.target.value = '';
  };

  const removeMedia = (index: number) => {
    const currentMedia = [...form.getValues('media')];
    currentMedia.splice(index, 1);
    form.setValue('media', currentMedia);
  };

  const uploadMediaToStorage = async (file: File, facilityId: string, index: number): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${facilityId}/${Date.now()}.${fileExt}`;
    const filePath = `facilities/${fileName}`;
    
    // Update the media item to show it's uploading
    const currentMedia = [...form.getValues('media')];
    currentMedia[index] = {
      ...currentMedia[index],
      isUploading: true,
    };
    form.setValue('media', currentMedia);

    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('facility_media')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('facility_media')
      .getPublicUrl(filePath);

    // Update the media item to show it's uploaded
    currentMedia[index] = {
      ...currentMedia[index],
      isUploading: false,
      isUploaded: true,
      path: filePath,
      url: publicUrl,
    };
    form.setValue('media', currentMedia);

    return publicUrl;
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
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
                images text[],
                videos text[],
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

      // Insert the new facility to get its ID
      const { data: facilityData, error: insertError } = await supabase
        .from('care_facilities')
        .insert({
          name: values.name,
          description: values.description,
          location: values.location,
          care_type: values.care_type,
          price_range: values.price_range,
          spots_available: values.spots_available,
          amenities: amenitiesArray,
          images: [],
          videos: [],
          status: 'active',
          featured: values.featured,
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      
      const facilityId = facilityData.id;
      
      // Upload all media files
      const imageUrls: string[] = [];
      const videoUrls: string[] = [];
      
      for (let i = 0; i < values.media.length; i++) {
        const mediaItem = values.media[i];
        if (mediaItem.file) {
          try {
            const publicUrl = await uploadMediaToStorage(mediaItem.file, facilityId, i);
            if (mediaItem.type === 'image') {
              imageUrls.push(publicUrl);
            } else {
              videoUrls.push(publicUrl);
            }
          } catch (error) {
            console.error(`Error uploading media ${i}:`, error);
            toast({
              title: 'Upload Error',
              description: `Failed to upload ${mediaItem.type} ${i + 1}`,
              variant: 'destructive',
            });
          }
        }
      }
      
      // Update the facility with the media URLs
      if (imageUrls.length > 0 || videoUrls.length > 0) {
        const { error: updateError } = await supabase
          .from('care_facilities')
          .update({
            images: imageUrls,
            videos: videoUrls,
            image_url: imageUrls.length > 0 ? imageUrls[0] : null, // For backward compatibility
          })
          .eq('id', facilityId);
          
        if (updateError) {
          console.error("Error updating facility with media:", updateError);
          // Continue anyway since the facility was created
        }
      }

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
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
              name="media"
              render={() => (
                <FormItem>
                  <FormLabel>Facility Media</FormLabel>
                  <FormDescription>
                    Upload photos and videos of the facility
                  </FormDescription>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Image className="h-4 w-4" />
                        <span className="text-sm font-medium">Photos</span>
                      </div>
                      <div className="border border-dashed rounded-lg p-4 text-center">
                        <input
                          type="file"
                          id="image-upload"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'image')}
                        />
                        <label 
                          htmlFor="image-upload" 
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload photos
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            JPG, PNG, WEBP up to 10MB
                          </p>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileVideo className="h-4 w-4" />
                        <span className="text-sm font-medium">Videos</span>
                      </div>
                      <div className="border border-dashed rounded-lg p-4 text-center">
                        <input
                          type="file"
                          id="video-upload"
                          multiple
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleFileChange(e, 'video')}
                        />
                        <label 
                          htmlFor="video-upload" 
                          className="flex flex-col items-center justify-center cursor-pointer"
                        >
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload videos
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            MP4, MOV up to 50MB
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview of uploaded media */}
                  {form.watch('media').length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Uploaded Media</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {form.watch('media').map((media, index) => (
                          <div key={index} className="relative group">
                            <div className="border rounded-md p-2 h-24 flex items-center justify-center overflow-hidden">
                              {media.file && media.type === 'image' && (
                                <img 
                                  src={URL.createObjectURL(media.file)} 
                                  alt={`Preview ${index}`}
                                  className="max-h-full max-w-full object-contain"
                                />
                              )}
                              {media.file && media.type === 'video' && (
                                <video 
                                  src={URL.createObjectURL(media.file)} 
                                  className="max-h-full max-w-full object-contain"
                                />
                              )}
                              {media.isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => removeMedia(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <p className="text-xs truncate mt-1">
                              {media.file?.name || 'Uploaded file'}
                            </p>
                          </div>
                        ))}
                        
                        {/* Add more button */}
                        <div className="border rounded-md p-2 h-24 flex flex-col items-center justify-center">
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="h-full w-full flex flex-col items-center justify-center"
                            onClick={() => document.getElementById('image-upload')?.click()}
                          >
                            <Plus className="h-6 w-6 mb-1" />
                            <span className="text-xs">Add More</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : 'Create Facility'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFacilityDialog;