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

// Form schema
const formSchema = z.object({
  name: z.string().min(2, 'Facility name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().min(10, 'Description is required'),
  featured_image: z.string().url('Valid image URL is required'),
  seo_keywords: z.string().optional(),
  is_published: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface FacilityEditorProps {
  facility?: any;
  onSuccess: () => void;
}

const FacilityEditor: React.FC<FacilityEditorProps> = ({ facility, onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const isEditing = !!facility;

  // Initialize form with default values or existing facility data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: facility?.name || '',
      slug: facility?.slug || '',
      description: facility?.description || '',
      featured_image: facility?.featured_image || facility?.image_url || '',
      seo_keywords: facility?.seo_keywords ? facility.seo_keywords.join(', ') : '',
      is_published: facility ? facility.is_published : false,
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
      const filePath = `facility_images/${fileName}`;

      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('facility_media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('facility_media')
        .getPublicUrl(filePath);

      // Set the URL in the form
      form.setValue('featured_image', publicUrl);
      
      toast({
        title: 'Image uploaded',
        description: 'The image has been uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Convert comma-separated keywords to array
      const keywordsArray = values.seo_keywords
        ? values.seo_keywords.split(',').map(keyword => keyword.trim()).filter(Boolean)
        : [];

      // Prepare data for Supabase
      const facilityData = {
        name: values.name,
        slug: values.slug,
        description: values.description,
        image_url: values.featured_image,
        seo_keywords: keywordsArray,
        status: values.is_published ? 'active' : 'draft',
      };

      if (isEditing) {
        // Update existing facility
        const { error } = await supabase
          .from('care_facilities')
          .update(facilityData)
          .eq('id', facility.id);

        if (error) throw error;

        toast({
          title: 'Facility updated',
          description: `The facility page has been ${values.is_published ? 'published' : 'saved as draft'}`,
        });
      } else {
        // Create new facility
        const { error } = await supabase
          .from('care_facilities')
          .insert(facilityData);

        if (error) throw error;

        toast({
          title: 'Facility created',
          description: `The facility page has been ${values.is_published ? 'published' : 'saved as draft'}`,
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving facility:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save facility',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{isEditing ? 'Edit Facility Page' : 'Create New Facility Page'}</h2>
        <p className="text-sm text-muted-foreground">
          {isEditing 
            ? 'Update the facility information and SEO settings' 
            : 'Fill in the details to create a new facility page'}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Facility Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter facility name" {...field} />
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
                  <Input placeholder="seo-friendly-url" {...field} />
                </FormControl>
                <FormDescription>
                  This will be used in the URL: /care/{field.value || 'example-slug'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured_image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Featured Image</FormLabel>
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
                          onClick={() => form.setValue('featured_image', '')}
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description / About</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Detailed description of the facility" 
                    className="min-h-[200px]" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  This content will be displayed on the facility page and used for SEO.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="seo_keywords"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SEO Keywords</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="memory care, senior living, assisted living" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Enter keywords separated by commas. These will be used in the page metadata.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      ? 'This page is live and visible to the public' 
                      : 'This page is a draft and only visible to admins'}
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
                isEditing ? 'Update Facility' : 'Create Facility'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FacilityEditor;