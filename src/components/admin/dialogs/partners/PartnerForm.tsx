import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PartnerFormValues, partnerFormSchema } from './schema';
import { generateSlug } from '@/utils/stringUtils';

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
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2, Upload } from 'lucide-react';
import { Label } from "@/components/ui/label";

interface PartnerFormProps {
  defaultValues: Partial<PartnerFormValues>;
  onSubmit: (values: PartnerFormValues) => Promise<void>;
  onCancel: () => void;
  isEditing?: boolean;
}

const PartnerForm = ({ defaultValues, onSubmit, onCancel, isEditing = false }: PartnerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerFormSchema),
    defaultValues,
  });

  // Auto-generate slug from name for new partners
  useEffect(() => {
    if (!isEditing) {
      const subscription = form.watch((value, { name }) => {
        if (name === 'name' && value.name) {
          const slug = generateSlug(value.name);
          form.setValue('slug', slug);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [form, isEditing]);

  const handleFormSubmit = async (values: PartnerFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex flex-col md:flex-row gap-4 items-start">
            <div className="w-full md:w-auto">
              <div className="mb-2">
                <Label>Profile Image</Label>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-32 h-32 border-2 border-dashed rounded-md flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">Upload image</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('profile-image')?.click()}
                >
                  Select Image
                </Button>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                      <Input placeholder="RN, CNA, MD, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
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
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile URL Slug</FormLabel>
              <FormControl>
                <Input placeholder="dr-jane-smith" {...field} />
              </FormControl>
              <FormDescription>
                This will be used in the URL: /professional/{field.value || 'dr-jane-smith'}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="practice_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Practice Name</FormLabel>
                <FormControl>
                  <Input placeholder="City Health Clinic" {...field} />
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
                  <Input placeholder="City, County, or Zip radius" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hourly_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Rate / Package Range</FormLabel>
                <FormControl>
                  <Input placeholder="$50/hr or $200-500/package" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="languages"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Languages Spoken</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="English, Spanish, Mandarin, etc." 
                    value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                    onChange={(e) => {
                      const languagesArray = e.target.value
                        .split(',')
                        .map(item => item.trim())
                        .filter(Boolean);
                      field.onChange(languagesArray);
                    }}
                  />
                </FormControl>
                <FormDescription>Enter languages separated by commas</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="specialties"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialties</FormLabel>
              <FormControl>
                <Input 
                  placeholder="General Practice, Cardiology, Pediatrics" 
                  value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                  onChange={(e) => {
                    const specialtiesArray = e.target.value
                      .split(',')
                      .map(item => item.trim())
                      .filter(Boolean);
                    field.onChange(specialtiesArray);
                  }}
                />
              </FormControl>
              <FormDescription>Enter specialties separated by commas</FormDescription>
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
                  placeholder="Dementia, Hospice, Palliative Care, etc." 
                  value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                  onChange={(e) => {
                    const specializationsArray = e.target.value
                      .split(',')
                      .map(item => item.trim())
                      .filter(Boolean);
                    field.onChange(specializationsArray);
                  }}
                />
              </FormControl>
              <FormDescription>Enter specializations separated by commas</FormDescription>
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
                  placeholder="Brief professional biography and background" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    Partner is currently accepting new patient appointments
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
                  <FormLabel className="text-base">Telehealth Enabled</FormLabel>
                  <FormDescription>
                    Partner can conduct virtual appointments
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
                  <FormLabel className="text-base">Verified by Vitale</FormLabel>
                  <FormDescription>
                    Provider has been verified by Vitale Concierge
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
                    ? 'This profile is live and visible to the public' 
                    : 'This profile is a draft and only visible to admins'}
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
        
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Availability Calendar</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The availability calendar will be implemented in a future update. For now, please note any availability restrictions in the bio field.
          </p>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update Partner' : 'Create Partner'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default PartnerForm;