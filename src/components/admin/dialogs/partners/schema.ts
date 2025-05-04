
import { z } from 'zod';

// Partner form schema definition
export const partnerFormSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  practice_name: z.string().optional(),
  // Using preprocess to ensure we always work with a string in the form
  specialties: z.preprocess(
    // This ensures the input is treated as a string in the form
    (val) => (typeof val === 'string' ? val : ''),
    // And then we transform it to an array when submitting
    z.string().transform(val => val.split(',').map(s => s.trim()))
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
  specialties: '', // String input that will be processed by the schema
  bio: '',
  accepting_new_patients: true,
  telehealth_enabled: false,
};
