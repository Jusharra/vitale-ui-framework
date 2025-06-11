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
import { Loader2, Upload, X } from 'lucide-react';
import { generateSlug } from '@/utils/stringUtils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Form schema
const formSchema = z.object({
  name: z.string().min(2, 'Professional name is required'),
  slug: z.string().min(2, 'Slug is required'),
  credentials: z.string().min(2, 'Credentials are required'),
  bio: z.string().min(10, 'Bio is required'),
  profile_image: z.string().url('Valid image URL is required'),
  specialties: z.string().optional(),
  languages: z.string().optional(),
  specializations: z.string().optional(),
  service_area: z.string().min(2, 'Service area is required'),
  hourly_rate: z.string().optional(),
  practice_name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  accepting_new_patients: z.boolean().default(true),
  telehealth_enabled: z.boolean().default(false),
  verified: z.boolean().default(false),
  is_published: z.boolean().default(false),
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
  const isEditing = !!professional;

  // Initialize form with default values or existing professional data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: professional?.name || '',
      slug: professional?.slug || '',
      credentials: professional?.credentials || '',
      bio: professional?.bio || '',
      profile_image: professional?.profile_image || '',
      specialties: professional?.specialties ? professional.specialties.join(', ') : '',
      languages: professional?.languages ? professional.languages.join(', ') : '',
      specializations: professional?.specializations ? professional.specializations.join(', ') : '',
      service_area: professional?.service_area || '',
      hourly_rate: professional?.hourly_rate || '',
      practice_name: professional?.practice_name || '',
      phone: professional?.phone || '',
      email: professional?.email || '',
      accepting_new_patients: professional ? professional.accepting_new_patients : true,
      telehealth_enabled: professional ? professional.telehealth_enabled : false,
      verified: professional ? professional.verified : false,
      is_published: professional ? professional.status === 'active' : false,
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
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `professional_images/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('professional_media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('professional_media')
        .getPublicUrl(filePath);

      // Set the URL in the form
      form.setValue('profile_image', publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "The image has been uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
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
        
      const specializationsArray = values.specializations
        ? values.specializations.split(',').map(item => item.trim()).filter(Boolean)
        : [];

      // Prepare data for Supabase
      const professionalData = {
        name: values.name,
        slug: values.slug,
        credentials: values.credentials,
        bio: values.bio,
        profile_image: values.profile_image,
        specialties: specialtiesArray,
        languages: languagesArray,
        specializations: specializationsArray,
        service_area: values.service_area,
        hourly_rate: values.hourly_rate,
        practice_name: values.practice_name,
        phone: values.phone,
        email: values.email,
        accepting_new_patients: values.accepting_new_patients,
        telehealth_enabled: values.telehealth_enabled,
        verified: values.verified,
        status: values.is_published ? 'active' : 'draft',
      };

      if (isEditing) {
        // Update existing professional
        const { error } = await supabase
          .from('partners')
          .update(professionalData)
          .eq('id', professional.id);

        if (error) throw error;

        toast({
          title: "Professional updated",
          description: `The professional profile has been ${values.is_published ? 'published' : 'saved as draft'}`,
        });
      } else {
        // Create new professional
        const { error } = await supabase
          .from('partners')
          .insert(professionalData);

        if (error) throw error;

        toast({
          title: "Professional created",
          description: `The professional profile has been ${values.is_published ? 'published' : 'saved as draft'}`,
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving professional:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to save professional',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{isEditing ? 'Edit Professional Profile' : 'Create New Professional Profile'}</h2>
        <p className="text-sm text-muted-foreground">
          {isEditing 
            ? 'Update the professional information and SEO settings' 
            : 'Fill in the details to create a new professional profile'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Dr. Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="credentials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credentials</FormLabel>
                  <FormControl>
                    <Input placeholder="MD, Cardiology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="practice_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Practice Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Heart Health Specialists" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <Input placeholder="Image URL" {...field} />
                  </FormControl>
                  
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        className="hidden"
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
                    placeholder="Detailed description of the professional's background, expertise, and approach to care" 
                    className="min-h-[200px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  This content will be displayed on the professional's profile page and used for SEO.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="specialties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialties</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Cardiology, Internal Medicine" 
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
                      placeholder="English, Spanish" 
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

            <FormField
              control={form.control}
              name="specializations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specializations</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Heart Failure, Preventive Cardiology" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter specializations separated by commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="hourly_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate / Fee Range</FormLabel>
                <FormControl>
                  <Input placeholder="$250-350/hour" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      Is this professional currently accepting new patients?
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
                      Telehealth Available
                    </FormLabel>
                    <FormDescription>
                      Does this professional offer telehealth services?
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
                      Verified Professional
                    </FormLabel>
                    <FormDescription>
                      Has this professional been verified by Vitale?
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
            name="is_published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {field.value ? 'Published' : 'Draft'}
                  </FormLabel>
                  <FormDescription>
                    {field.value 
                      ? 'This profile is live and visible to the public' 
                      : 'This profile is a draft and only visible to admins'}
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