
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

// Extend the jsPDF types to include autoTable without redefining existing properties
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

// Types for the health data
interface VitalSign {
  id: number;
  name: string;
  value: string;
  status: string;
  date: string;
}

interface WeightRecord {
  id: number;
  date: string;
  weight: string;
}

interface Allergy {
  id: number;
  name: string;
  severity: string;
  symptoms: string;
}

interface MentalHealthRecord {
  id: number;
  date: string;
  assessment: string;
  score: string;
  interpretation: string;
}

interface TreatmentPlan {
  id: number;
  condition: string;
  provider: string;
  lastUpdated: string;
  recommendations: string[];
}

interface HealthData {
  vitalSigns: VitalSign[];
  weightData: WeightRecord[];
  allergyData: Allergy[];
  mentalHealthData: MentalHealthRecord[];
  treatmentPlans: TreatmentPlan[];
}

export const generateHealthInsightsPDF = (healthData: HealthData): jsPDF => {
  // Initialize PDF document
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const textColor = '#333333';
  const headerColor = '#2563eb';
  const currentDate = format(new Date(), 'MMMM d, yyyy');
  
  // Add header
  doc.setFontSize(22);
  doc.setTextColor(headerColor);
  doc.text('Health Insights Report', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(textColor);
  doc.text(`Generated on ${currentDate}`, pageWidth / 2, 28, { align: 'center' });
  
  // Add section divider
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 32, pageWidth - 14, 32);
  
  let yPosition = 40;
  
  // Vital Signs Section
  if (healthData.vitalSigns.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(headerColor);
    doc.text('Vital Signs', 14, yPosition);
    yPosition += 8;
    
    doc.autoTable({
      startY: yPosition,
      head: [['Measurement', 'Value', 'Status', 'Date']],
      body: healthData.vitalSigns.map(vital => [
        vital.name,
        vital.value,
        vital.status.charAt(0).toUpperCase() + vital.status.slice(1),
        vital.date
      ]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Weight Management Section
  if (healthData.weightData.length > 0) {
    doc.setFontSize(14);
    doc.setTextColor(headerColor);
    doc.text('Weight Management', 14, yPosition);
    yPosition += 8;
    
    doc.autoTable({
      startY: yPosition,
      head: [['Date', 'Weight']],
      body: healthData.weightData.map(record => [
        record.date,
        record.weight
      ]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Allergies Section
  if (healthData.allergyData.length > 0) {
    // Check if we need to add a new page
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(headerColor);
    doc.text('Allergies', 14, yPosition);
    yPosition += 8;
    
    doc.autoTable({
      startY: yPosition,
      head: [['Allergy', 'Severity', 'Symptoms']],
      body: healthData.allergyData.map(allergy => [
        allergy.name,
        allergy.severity,
        allergy.symptoms
      ]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Mental Health Section
  if (healthData.mentalHealthData.length > 0) {
    // Check if we need to add a new page
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(headerColor);
    doc.text('Mental Health', 14, yPosition);
    yPosition += 8;
    
    doc.autoTable({
      startY: yPosition,
      head: [['Date', 'Assessment', 'Score', 'Interpretation']],
      body: healthData.mentalHealthData.map(record => [
        record.date,
        record.assessment,
        record.score,
        record.interpretation
      ]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235], textColor: 255 },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 }
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }
  
  // Treatment Plans Section
  if (healthData.treatmentPlans.length > 0) {
    // Check if we need to add a new page
    if (yPosition > 180) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(headerColor);
    doc.text('Treatment Plans', 14, yPosition);
    yPosition += 8;
    
    healthData.treatmentPlans.forEach((plan, index) => {
      doc.setFontSize(11);
      doc.setTextColor(textColor);
      doc.text(`${plan.condition}`, 14, yPosition);
      yPosition += 5;
      
      doc.setFontSize(9);
      doc.text(`Provider: ${plan.provider}`, 14, yPosition);
      yPosition += 4;
      
      doc.text(`Last Updated: ${plan.lastUpdated}`, 14, yPosition);
      yPosition += 8;
      
      doc.text('Recommendations:', 14, yPosition);
      yPosition += 5;
      
      plan.recommendations.forEach(rec => {
        doc.text(`• ${rec}`, 18, yPosition);
        yPosition += 5;
      });
      
      // Add space between plans
      if (index < healthData.treatmentPlans.length - 1) {
        yPosition += 5;
        doc.setDrawColor(200, 200, 200);
        doc.line(14, yPosition - 2, pageWidth - 14, yPosition - 2);
        yPosition += 5;
        
        // Check if we need a new page
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
      }
    });
  }
  
  // Add footer with page numbers
  const pageCount = doc.internal.pages.length - 1;
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }
  
  return doc;
};

export const downloadHealthInsightsPDF = (healthData: HealthData, fileName: string = 'health-insights-report'): void => {
  const doc = generateHealthInsightsPDF(healthData);
  doc.save(`${fileName}.pdf`);
};
