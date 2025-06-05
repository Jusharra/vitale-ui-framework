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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, X, Plus, Image, FileVideo, Loader2, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description is required'),
  location: z.string().min(2, 'Location is required'),
  care_type: z.string().min(2, 'Care type is required'),
  price_range: z.string().min(2, 'Price range is required'),
  spots_available: z.coerce.number().min(0, 'Spots available must be a positive number'),
  amenities: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  hours: z.string().optional(),
  virtual_tour_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  media: z.array(z.object({
    file: z.instanceof(File).optional(),
    url: z.string().optional(),
    type: z.enum(['image', 'video']),
    isUploading: z.boolean().default(false),
    isUploaded: z.boolean().default(false),
    path: z.string().optional(),
    isExisting: z.boolean().optional(),
  })).default([]),
  featured: z.boolean().default(false),
  status: z.enum(['active', 'draft']).default('draft'),
});

type FormValues = z.infer<typeof formSchema>;

interface EditFacilityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  facilityId: string | null;
}

const EditFacilityDialog = ({ open, onOpenChange, onSuccess, facilityId }: EditFacilityDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
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
      phone: '',
      email: '',
      website: '',
      hours: '',
      virtual_tour_url: '',
      media: [],
      featured: false,
      status: 'draft',
    },
  });

  useEffect(() => {
    const fetchFacility = async () => {
      if (!facilityId || !open) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('care_facilities')
          .select('*')
          .eq('id', facilityId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          const amenitiesString = data.amenities ? data.amenities.join(', ') : '';
          
          const existingMedia = [
            ...(data.images || []).map(url => ({
              url,
              type: 'image' as const,
              isUploaded: true,
              isExisting: true,
            })),
            ...(data.videos || []).map(url => ({
              url,
              type: 'video' as const,
              isUploaded: true,
              isExisting: true,
            }))
          ];
          
          form.reset({
            name: data.name,
            description: data.description || '',
            location: data.location,
            care_type: data.care_type,
            price_range: data.price_range,
            spots_available: data.spots_available || 0,
            amenities: amenitiesString,
            phone: data.phone || '',
            email: data.email || '',
            website: data.website || '',
            hours: data.hours || '',
            virtual_tour_url: data.virtual_tour_url || '',
            media: existingMedia,
            featured: data.featured || false,
            status: data.status as 'active' | 'draft' || 'draft',
          });
        }
      } catch (error) {
        console.error('Error fetching facility:', error);
        toast({
          title: 'Error',
          description: 'Failed to load facility data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFacility();
  }, [facilityId, open, form, toast]);

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
    
    const currentMedia = [...form.getValues('media')];
    currentMedia[index] = {
      ...currentMedia[index],
      isUploading: true,
    };
    form.setValue('media', currentMedia);

    const { error: uploadError } = await supabase.storage
      .from('facility_media')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('facility_media')
      .getPublicUrl(filePath);

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
    if (!facilityId) return;
    
    try {
      setIsSubmitting(true);
      
      const amenitiesArray = values.amenities 
        ? values.amenities.split(',').map(item => item.trim()).filter(Boolean) 
        : [];
      
      const existingImageUrls: string[] = [];
      const existingVideoUrls: string[] = [];
      const newImageUrls: string[] = [];
      const newVideoUrls: string[] = [];
      
      values.media.forEach(mediaItem => {
        if (mediaItem.isExisting && mediaItem.url) {
          if (mediaItem.type === 'image') {
            existingImageUrls.push(mediaItem.url);
          } else {
            existingVideoUrls.push(mediaItem.url);
          }
        }
      });
      
      for (let i = 0; i < values.media.length; i++) {
        const mediaItem = values.media[i];
        if (mediaItem.file && !mediaItem.isExisting) {
          try {
            const publicUrl = await uploadMediaToStorage(mediaItem.file, facilityId, i);
            if (mediaItem.type === 'image') {
              newImageUrls.push(publicUrl);
            } else {
              newVideoUrls.push(publicUrl);
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
      
      const allImageUrls = [...existingImageUrls, ...newImageUrls];
      const allVideoUrls = [...existingVideoUrls, ...newVideoUrls];
      
      const { error } = await supabase
        .from('care_facilities')
        .update({
          name: values.name,
          description: values.description,
          location: values.location,
          care_type: values.care_type,
          price_range: values.price_range,
          spots_available: values.spots_available,
          amenities: amenitiesArray,
          phone: values.phone,
          email: values.email,
          website: values.website,
          hours: values.hours,
          virtual_tour_url: values.virtual_tour_url,
          images: allImageUrls,
          videos: allVideoUrls,
          image_url: allImageUrls.length > 0 ? allImageUrls[0] : null,
          status: values.status,
          featured: values.featured,
          updated_at: new Date().toISOString(),
        })
        .eq('id', facilityId);

      if (error) throw error;

      toast({
        title: 'Facility updated',
        description: `Care facility has been updated and is now ${values.status === 'active' ? 'published' : 'saved as draft'}`,
      });
      
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating facility:', error);
      toast({
        title: 'Error',
        description: 'Failed to update care facility',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFacility = async () => {
    if (!facilityId) return;
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('care_facilities')
        .delete()
        .eq('id', facilityId);

      if (error) throw error;

      toast({
        title: 'Facility deleted',
        description: 'Care facility has been deleted successfully',
      });
      
      setIsDeleteDialogOpen(false);
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error deleting facility:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete care facility',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading facility data...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the care facility
                and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteFacility}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>Edit Care Facility</DialogTitle>
              <DialogDescription>
                Update care facility information
              </DialogDescription>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isSubmitting}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
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
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@facility.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.facility.com" {...field} />
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
                      <Input placeholder="Mon-Fri 9am-5pm, Sat-Sun 10am-4pm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="virtual_tour_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Virtual Tour URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.youtube.com/watch?v=example" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a URL to a virtual tour video or 360° tour of the facility
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                  
                  {form.watch('media').length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Media Files</h4>
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
                              {media.url && media.type === 'image' && !media.file && (
                                <img 
                                  src={media.url} 
                                  alt={`Image ${index}`}
                                  className="max-h-full max-w-full object-contain"
                                />
                              )}
                              {media.url && media.type === 'video' && !media.file && (
                                <video 
                                  src={media.url}
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
                              {media.file?.name || (media.isExisting ? (media.type === 'image' ? 'Existing Image' : 'Existing Video') : 'Uploaded file')}
                            </p>
                          </div>
                        ))}
                        
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Publication Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft (Not visible on Placements page)</SelectItem>
                      <SelectItem value="active">Active (Visible on Placements page)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Draft facilities are only visible to admins until published
                  </FormDescription>
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
                    Updating...
                  </>
                ) : 'Update Facility'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFacilityDialog;