import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
import { Loader2, Upload, X, AlertCircle } from 'lucide-react';
import { generateSlug } from '@/utils/stringUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Form schema
const formSchema = z.object({
  name: z.string().min(2, 'Professional name is required'),
  slug: z.string().min(2, 'Slug is required'),
  bio: z.string().min(10, 'Bio is required'),
  profile_image: z.string().url('Valid image URL is required').or(z.string().length(0)),
  specialties: z.string().optional(),
  languages: z.string().optional(),
  service_area: z.string().optional(),
  practice_name: z.string().optional(),
  credentials: z.string().optional(),
  hourly_rate: z.string().optional(),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  phone: z.string().optional(),
  accepting_new_patients: z.boolean().default(true),
  telehealth_enabled: z.boolean().default(false),
  verified: z.boolean().default(false),
  status: z.enum(['active', 'draft']).default('draft'),
});

type FormValues = z.infer<typeof formSchema>;

interface ProfessionalEditorProps {
  professional?: any;
  onSuccess: () => void;
}

const ProfessionalEditor: React.FC<ProfessionalEditorProps> = ({ professional, onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isEditing = !!professional;

  // Initialize form with default values or existing professional data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: professional?.name || '',
      slug: professional?.slug || '',
      bio: professional?.bio || '',
      profile_image: professional?.profile_image || '',
      specialties: professional?.specialties ? professional.specialties.join(', ') : '',
      languages: professional?.languages ? professional.languages.join(', ') : '',
      service_area: professional?.service_area || '',
      practice_name: professional?.practice_name || '',
      credentials: professional?.credentials || '',
      hourly_rate: professional?.hourly_rate || '',
      email: professional?.email || '',
      phone: professional?.phone || '',
      accepting_new_patients: professional ? professional.accepting_new_patients : true,
      telehealth_enabled: professional ? professional.telehealth_enabled : false,
      verified: professional ? professional.verified : false,
      status: professional?.status || 'draft',
    },
  });

  // Watch name field to auto-generate slug
  const name = form.watch('name');
  
  useEffect(() => {
    if (!isEditing && name && !form.getValues('slug')) {
      form.setValue('slug', generateSlug(name));
    }
  }, [name, form, isEditing]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setStorageError(null);
    setImageFile(file);
    
    try {
      // Check if the bucket exists, create it if it doesn't
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'partner_images');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('partner_images', {
          public: true
        });
      }
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `partner_images/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('partner_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data } = supabase.storage
        .from('partner_images')
        .getPublicUrl(filePath);

      // Set the URL in the form
      form.setValue('profile_image', data.publicUrl);
      
      toast({
        title: 'Image uploaded',
        description: 'The image has been uploaded successfully',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      let errorMessage = 'Failed to upload image';
      if (error.message?.includes('Bucket not found')) {
        errorMessage = 'Storage bucket not found. Please contact your administrator.';
        setStorageError('The "partner_images" storage bucket needs to be created in your Supabase project.');
      } else if (error.message?.includes('not allowed')) {
        errorMessage = 'File type not allowed. Please use JPG, PNG, or WebP images.';
      } else if (error.message?.includes('too large')) {
        errorMessage = 'File too large. Please use an image smaller than 5MB.';
      }
      
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      event.target.value = '';
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Convert comma-separated strings to arrays
      const specialtiesArray = values.specialties 
        ? values.specialties.split(',').map(item => item.trim()).filter(Boolean) 
        : [];
      
      const languagesArray = values.languages 
        ? values.languages.split(',').map(item => item.trim()).filter(Boolean) 
        : [];

      // Prepare data for Supabase
      const professionalData = {
        name: values.name,
        slug: values.slug,
        bio: values.bio,
        profile_image: values.profile_image,
        specialties: specialtiesArray,
        languages: languagesArray,
        service_area: values.service_area,
        practice_name: values.practice_name,
        credentials: values.credentials,
        hourly_rate: values.hourly_rate,
        email: values.email,
        phone: values.phone,
        accepting_new_patients: values.accepting_new_patients,
        telehealth_enabled: values.telehealth_enabled,
        verified: values.verified,
        status: values.status,
      };

      if (isEditing) {
        // Update existing professional
        const { error } = await supabase
          .from('partners')
          .update(professionalData)
          .eq('id', professional.id);

        if (error) throw error;

        toast({
          title: 'Professional updated',
          description: `The professional page has been ${values.status === 'active' ? 'published' : 'saved as draft'}`,
        });
      } else {
        // Create new professional
        const { error } = await supabase
          .from('partners')
          .insert(professionalData);

        if (error) throw error;

        toast({
          title: 'Professional created',
          description: `The professional page has been ${values.status === 'active' ? 'published' : 'saved as draft'}`,
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving professional:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save professional',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{isEditing ? 'Edit Professional Page' : 'Create New Professional Page'}</h2>
        <p className="text-sm text-muted-foreground">
          {isEditing 
            ? 'Update the professional information and SEO settings' 
            : 'Fill in the details to create a new professional page'}
        </p>
      </div>

      {storageError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {storageError}
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Name</FormLabel>
                <FormControl>
                  <Input placeholder="Dr. Jane Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL Slug</FormLabel>
                <FormControl>
                  <Input placeholder="dr-jane-smith" {...field} />
                </FormControl>
                <FormDescription>
                  This will be used in the URL: /professional/{field.value || 'example-slug'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="credentials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credentials</FormLabel>
                  <FormControl>
                    <Input placeholder="MD, FACP" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="practice_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Practice Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Smith Family Medicine" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="doctor@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>

          <FormField
            control={form.control}
            name="profile_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Image</FormLabel>
                <div className="space-y-4">
                  <FormControl>
                    <Input placeholder="Image URL (e.g., https://example.com/image.jpg)" {...field} />
                  </FormControl>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="file"
                        id="image-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {field.value && (
                      <div className="relative h-20 w-20 rounded-md overflow-hidden border">
                        <img 
                          src={field.value} 
                          alt="Preview" 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.svg';
                          }}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-0 right-0 h-6 w-6 rounded-full"
                          onClick={() => form.setValue('profile_image', '')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {storageError && (
                    <FormDescription className="text-orange-600">
                      Note: File upload is currently unavailable. Please use a direct image URL instead.
                    </FormDescription>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Detailed description of the professional's background and expertise" 
                    className="min-h-[200px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  This content will be displayed on the professional's page and used for SEO.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="specialties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialties</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Cardiology, Family Medicine, Geriatrics" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter specialties separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="languages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Languages</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="English, Spanish, Mandarin" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter languages separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="service_area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Area</FormLabel>
                  <FormControl>
                    <Input placeholder="San Mateo County, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hourly_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hourly Rate</FormLabel>
                  <FormControl>
                    <Input placeholder="$200-250" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="accepting_new_patients"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Accepting New Patients
                    </FormLabel>
                    <FormDescription>
                      Is this professional accepting new patient appointments?
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
              name="telehealth_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Telehealth Enabled
                    </FormLabel>
                    <FormDescription>
                      Does this professional offer telehealth?
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
              name="verified"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Verified Provider
                    </FormLabel>
                    <FormDescription>
                      Is this professional verified?
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
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {field.value === 'active' ? 'Published' : 'Draft'}
                  </FormLabel>
                  <FormDescription>
                    {field.value === 'active' 
                      ? 'This page is live and visible to the public' 
                      : 'This page is a draft and only visible to admins'}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value === 'active'}
                    onCheckedChange={(checked) => field.onChange(checked ? 'active' : 'draft')}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Professional' : 'Create Professional'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfessionalEditor;