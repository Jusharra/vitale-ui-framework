
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { HealthData } from './types';
import { 
  renderVitalSigns, 
  renderWeightData, 
  renderAllergies, 
  renderMentalHealth, 
  renderTreatmentPlans 
} from './sectionRenderers';
import { addPageHeader, addPageFooters } from './pdfUtils';

const generateHealthInsightsPDF = (healthData: HealthData): jsPDF => {
  // Initialize PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const textColor = '#333333';
  const headerColor = '#2563eb';
  const currentDate = format(new Date(), 'MMMM d, yyyy');
  
  // Add header
  addPageHeader(doc, 'Health Insights Report', currentDate, headerColor, textColor);
  
  // Initial Y position for content
  let yPosition = 40;
  
  // Render each section
  yPosition = renderVitalSigns(doc, healthData.vitalSigns, yPosition, headerColor, textColor);
  yPosition = renderWeightData(doc, healthData.weightData, yPosition, headerColor, textColor);
  yPosition = renderAllergies(doc, healthData.allergyData, yPosition, headerColor, textColor);
  yPosition = renderMentalHealth(doc, healthData.mentalHealthData, yPosition, headerColor, textColor);
  yPosition = renderTreatmentPlans(doc, healthData.treatmentPlans, yPosition, headerColor, textColor, pageWidth);
  
  // Add page numbers
  addPageFooters(doc);
  
  return doc;
};

export const downloadHealthInsightsPDF = (healthData: HealthData, fileName: string = 'health-insights-report'): void => {
  const doc = generateHealthInsightsPDF(healthData);
  doc.save(`${fileName}.pdf`);
};

// Re-export types
export * from './types';
