
import { z } from 'zod';

// Partner form schema definition
export const partnerFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  practice_name: z.string().optional(),
  // Fix the specialties field to properly handle the transformation
  specialties: z.preprocess(
    // This ensures the input is treated as a string in the form
    (val) => (typeof val === 'string' ? val : Array.isArray(val) ? val.join(',') : ''),
    // And then we transform it to an array when submitting
    z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean))
  ),
  bio: z.string().optional(),
  accepting_new_patients: z.boolean().default(true),
  telehealth_enabled: z.boolean().default(false),
});

// Export the type for the form values - this ensures the form values match what the schema expects
export type PartnerFormValues = z.infer<typeof partnerFormSchema>;

// Default form values - specialties is a string here for the form input
export const defaultPartnerFormValues: Partial<PartnerFormValues> = {
  name: '',
  email: '',
  phone: '',
  practice_name: '',
  specialties: '', // String for the form input
  bio: '',
  accepting_new_patients: true,
  telehealth_enabled: false,
};

// Define a specific type for the specialties form field to make it clear it's a string in the form
export type PartnerFormSpecialtiesField = string;
