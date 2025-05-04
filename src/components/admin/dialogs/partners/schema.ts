
import { z } from 'zod';

// Partner form schema definition
export const partnerFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  practice_name: z.string().optional(),
  // Fix the specialties preprocessing to correctly handle the type transformation
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

// Export the type for the form values
export type PartnerFormValues = z.infer<typeof partnerFormSchema>;

// Default form values
export const defaultPartnerFormValues: Partial<PartnerFormValues> = {
  name: '',
  email: '',
  phone: '',
  practice_name: '',
  specialties: '', // This should be a string input that will be processed by the schema
  bio: '',
  accepting_new_patients: true,
  telehealth_enabled: false,
};

// Export a specific type for the form's internal use
export type PartnerFormSpecialties = string;

