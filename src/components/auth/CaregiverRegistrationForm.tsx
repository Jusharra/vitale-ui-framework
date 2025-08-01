import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const caregiverFormSchema = z.object({
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
  hourly_rate: z.number().min(1, 'Hourly rate must be greater than 0'),
  years_experience: z.number().min(0, 'Years of experience cannot be negative'),
  certifications: z.array(z.string()).min(1, 'At least one certification is required'),
  availability: z.object({
    days: z.array(z.string()).min(1, 'At least one day must be selected'),
    hours: z.string().min(1, 'Preferred hours are required')
  }),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
});

type CaregiverFormData = z.infer<typeof caregiverFormSchema>;

interface CaregiverRegistrationFormProps {
  userId: string;
  onComplete: () => void;
}

const COMMON_SPECIALTIES = [
  'Elderly Care', 'Dementia Care', 'Alzheimer\'s Care', 'Post-Surgery Care',
  'Chronic Illness Management', 'Hospice Care', 'Physical Therapy Support',
  'Medication Management', 'Companionship', 'Personal Care', 'Meal Preparation',
  'Transportation', 'Light Housekeeping', 'Pet Care'
];

const COMMON_CERTIFICATIONS = [
  'CNA (Certified Nursing Assistant)', 'HHA (Home Health Aide)',
  'CPR Certified', 'First Aid Certified', 'CMA (Certified Medical Assistant)',
  'Alzheimer\'s Care Training', 'Hospice Care Training', 'Physical Therapy Assistant',
  'Medication Aide Certification', 'Background Check Cleared'
];

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function CaregiverRegistrationForm({ userId, onComplete }: CaregiverRegistrationFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const form = useForm<CaregiverFormData>({
    resolver: zodResolver(caregiverFormSchema),
    defaultValues: {
      specialties: [],
      hourly_rate: 25,
      years_experience: 0,
      certifications: [],
      availability: {
        days: [],
        hours: ''
      },
      bio: '',
    },
  });

  const watchedSpecialties = form.watch('specialties');
  const watchedCertifications = form.watch('certifications');
  const watchedDays = form.watch('availability.days');

  const addSpecialty = (specialty: string) => {
    if (specialty && !watchedSpecialties.includes(specialty)) {
      form.setValue('specialties', [...watchedSpecialties, specialty]);
    }
    setNewSpecialty('');
  };

  const removeSpecialty = (specialty: string) => {
    form.setValue('specialties', watchedSpecialties.filter(s => s !== specialty));
  };

  const addCertification = (certification: string) => {
    if (certification && !watchedCertifications.includes(certification)) {
      form.setValue('certifications', [...watchedCertifications, certification]);
    }
    setNewCertification('');
  };

  const removeCertification = (certification: string) => {
    form.setValue('certifications', watchedCertifications.filter(c => c !== certification));
  };

  const toggleDay = (day: string) => {
    const currentDays = watchedDays;
    if (currentDays.includes(day)) {
      form.setValue('availability.days', currentDays.filter(d => d !== day));
    } else {
      form.setValue('availability.days', [...currentDays, day]);
    }
  };

  const onSubmit = async (data: CaregiverFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          role: 'caregiver',
          specialties: data.specialties,
          hourly_rate: data.hourly_rate,
          years_experience: data.years_experience,
          certifications: data.certifications,
          availability: data.availability,
          bio: data.bio,
          vetting_status: 'pending',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Your caregiver application has been submitted for review. You'll be notified once it's approved.",
      });

      onComplete();
    } catch (error) {
      console.error('Error submitting caregiver application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Caregiver Profile</CardTitle>
        <p className="text-muted-foreground">
          Provide your professional details to join our caregiver directory. Your application will be reviewed by our team.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Specialties */}
            <FormField
              control={form.control}
              name="specialties"
              render={() => (
                <FormItem>
                  <FormLabel>Specialties</FormLabel>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {COMMON_SPECIALTIES.map((specialty) => (
                        <Button
                          key={specialty}
                          type="button"
                          variant={watchedSpecialties.includes(specialty) ? "default" : "outline"}
                          size="sm"
                          onClick={() => addSpecialty(specialty)}
                        >
                          {specialty}
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom specialty..."
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty(newSpecialty))}
                      />
                      <Button type="button" size="sm" onClick={() => addSpecialty(newSpecialty)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {watchedSpecialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                          {specialty}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => removeSpecialty(specialty)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experience and Rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="years_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
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
                    <FormLabel>Hourly Rate ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Certifications */}
            <FormField
              control={form.control}
              name="certifications"
              render={() => (
                <FormItem>
                  <FormLabel>Certifications</FormLabel>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {COMMON_CERTIFICATIONS.map((cert) => (
                        <Button
                          key={cert}
                          type="button"
                          variant={watchedCertifications.includes(cert) ? "default" : "outline"}
                          size="sm"
                          onClick={() => addCertification(cert)}
                        >
                          {cert}
                        </Button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add custom certification..."
                        value={newCertification}
                        onChange={(e) => setNewCertification(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification(newCertification))}
                      />
                      <Button type="button" size="sm" onClick={() => addCertification(newCertification)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {watchedCertifications.map((cert) => (
                        <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                          {cert}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => removeCertification(cert)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Availability */}
            <FormField
              control={form.control}
              name="availability"
              render={() => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-2">Available Days</p>
                      <div className="flex flex-wrap gap-2">
                        {DAYS_OF_WEEK.map((day) => (
                          <Button
                            key={day}
                            type="button"
                            variant={watchedDays.includes(day) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleDay(day)}
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="availability.hours"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Hours</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 9:00 AM - 5:00 PM, Flexible, Weekends only" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell families about your experience, approach to care, and what makes you a great caregiver..."
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    {field.value?.length || 0}/50 characters minimum
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting Application...' : 'Submit for Review'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}