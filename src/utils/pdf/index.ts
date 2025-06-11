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

export const generateHealthInsightsPDF = (healthData: HealthData, jsPDF: any): any => {
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

export const downloadHealthInsightsPDF = async (healthData: HealthData, fileName: string = 'health-insights-report'): Promise<void> => {
  try {
    // Dynamically import jsPDF and jspdf-autotable
    const jsPDFModule = await import('jspdf');
    await import('jspdf-autotable'); // This modifies jsPDF prototype

    // Generate the PDF with the dynamically imported jsPDF
    const doc = generateHealthInsightsPDF(healthData, jsPDFModule.jsPDF);
    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Re-export types
export * from './types';