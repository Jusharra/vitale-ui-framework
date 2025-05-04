
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  refills_remaining: number;
  last_filled?: string;
  is_controlled: boolean;
}

export interface RefillRequest {
  id: string;
  medication_id: string;
  status: 'pending' | 'approved' | 'denied' | string;
  request_date: string;
  delivery_type: 'mail' | 'pickup' | 'drone' | string;
  notes?: string;
  approved_by?: string;
  patient_id?: string;
  updated_at?: string;
}

export interface RefillRequestFormValues {
  medication_id: string;
  delivery_type: string;
  notes?: string;
}
