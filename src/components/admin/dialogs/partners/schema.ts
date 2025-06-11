import { z } from 'zod';

// Partner form schema definition
export const partnerFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  first_name: z.string().min(1, 'First name is required'),
  credentials: z.string().optional(),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  practice_name: z.string().optional(),
  slug: z.string().optional(),
  // Fix the specialties field to properly handle the transformation
  specialties: z.union([
    // Accept string input from form
    z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
    // Also accept array input which might come from database
    z.array(z.string())
  ]),
  languages: z.union([
    z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
    z.array(z.string())
  ]),
  specializations: z.union([
    z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
    z.array(z.string())
  ]),
  service_area: z.string().optional(),
  hourly_rate: z.string().optional(),
  bio: z.string().optional(),
  accepting_new_patients: z.boolean().default(true),
  telehealth_enabled: z.boolean().default(false),
  verified: z.boolean().default(false),
  status: z.enum(['active', 'draft']).default('active'),
});

// Export the type for the form values - this ensures the form values match what the schema expects
export type PartnerFormValues = z.infer<typeof partnerFormSchema>;

// Default form values - specialties is a string here for the form input
export const defaultPartnerFormValues: Partial<PartnerFormValues> = {
  name: '',
  first_name: '',
  credentials: '',
  email: '',
  phone: '',
  practice_name: '',
  slug: '',
  specialties: [], // Fix: Initialize as an empty array instead of an empty string
  languages: [],
  specializations: [],
  service_area: '',
  hourly_rate: '',
  bio: '',
  accepting_new_patients: true,
  telehealth_enabled: false,
  verified: false,
  status: 'active',
};

// Define a specific type for the specialties form field to make it clear it's a string in the form
type PartnerFormSpecialtiesField = string;