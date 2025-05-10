
// PDF data type definitions
export interface VitalSign {
  id: number;
  name: string;
  value: string;
  status: string;
  date: string;
}

export interface WeightRecord {
  id: number;
  date: string;
  weight: string;
}

export interface Allergy {
  id: number;
  name: string;
  severity: string;
  symptoms: string;
}

export interface MentalHealthRecord {
  id: number;
  date: string;
  assessment: string;
  score: string;
  interpretation: string;
}

export interface TreatmentPlan {
  id: number;
  condition: string;
  provider: string;
  lastUpdated: string;
  recommendations: string[];
}

export interface HealthData {
  vitalSigns: VitalSign[];
  weightData: WeightRecord[];
  allergyData: Allergy[];
  mentalHealthData: MentalHealthRecord[];
  treatmentPlans: TreatmentPlan[];
}

// For jsPDF type extensions
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}
