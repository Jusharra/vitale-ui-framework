
import { VitalSign, WeightRecord, Allergy, MentalHealthRecord, TreatmentPlan } from '@/utils/pdf/types';

// Mock data for health insights
export const vitalSigns: VitalSign[] = [
  { id: 1, name: "Blood Pressure", value: "120/80 mmHg", status: "normal", date: "April 28, 2025" },
  { id: 2, name: "Heart Rate", value: "72 bpm", status: "normal", date: "April 28, 2025" },
  { id: 3, name: "Blood Glucose", value: "98 mg/dL", status: "normal", date: "April 25, 2025" },
  { id: 4, name: "Oxygen Saturation", value: "98%", status: "normal", date: "April 28, 2025" },
];

export const weightData: WeightRecord[] = [
  { id: 1, date: "April 28, 2025", weight: "175 lbs" },
  { id: 2, date: "March 28, 2025", weight: "178 lbs" },
  { id: 3, date: "February 28, 2025", weight: "180 lbs" },
];

export const allergyData: Allergy[] = [
  { id: 1, name: "Peanuts", severity: "High", symptoms: "Anaphylaxis" },
  { id: 2, name: "Dust", severity: "Medium", symptoms: "Sneezing, Itchy eyes" },
  { id: 3, name: "Penicillin", severity: "Medium", symptoms: "Rash" },
];

export const mentalHealthData: MentalHealthRecord[] = [
  { id: 1, date: "April 15, 2025", assessment: "Depression Screening", score: "3/27", interpretation: "Minimal symptoms" },
  { id: 2, date: "April 15, 2025", assessment: "Anxiety Screening", score: "5/21", interpretation: "Mild anxiety" },
];

export const treatmentPlans: TreatmentPlan[] = [
  { 
    id: 1, 
    condition: "Hypertension Management", 
    provider: "Dr. Sarah Johnson",
    lastUpdated: "April 10, 2025",
    recommendations: [
      "Maintain blood pressure below 130/80 mmHg",
      "Daily 30-minute moderate exercise",
      "DASH diet with reduced sodium intake"
    ]
  },
  { 
    id: 2, 
    condition: "Seasonal Allergies", 
    provider: "Dr. Michael Chen",
    lastUpdated: "March 15, 2025",
    recommendations: [
      "Daily antihistamine during spring months",
      "HEPA air purifier in bedroom",
      "Weekly cleaning to reduce dust accumulation"
    ]
  },
];

export interface Assessment {
  id: number;
  name: string;
  duration: string;
  completed: boolean;
}

export const assessments: Assessment[] = [
  { id: 1, name: "General Wellness Assessment", duration: "5 min", completed: true },
  { id: 2, name: "Mental Health Screening", duration: "10 min", completed: true },
  { id: 3, name: "Heart Health Risk Assessment", duration: "8 min", completed: false },
  { id: 4, name: "Sleep Quality Assessment", duration: "6 min", completed: false }
];
