export const renderVitalSigns = (
  doc: any, 
  vitalSigns: any[], 
  yPosition: number, 
  headerColor: string,
  textColor: string
): number => {
  if (!vitalSigns || vitalSigns.length === 0) return yPosition;
  
  doc.setFontSize(14);
  doc.setTextColor(headerColor);
  doc.text('Vital Signs', 14, yPosition);
  yPosition += 8;
  
  doc.autoTable({
    startY: yPosition,
    head: [['Measurement', 'Value', 'Status', 'Date']],
    body: vitalSigns.map((vital: any) => [
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
  
  return doc.lastAutoTable.finalY + 15;
};

export const renderWeightData = (
  doc: any, 
  weightData: any[], 
  yPosition: number, 
  headerColor: string,
  textColor: string
): number => {
  if (!weightData || weightData.length === 0) return yPosition;
  
  doc.setFontSize(14);
  doc.setTextColor(headerColor);
  doc.text('Weight Management', 14, yPosition);
  yPosition += 8;
  
  doc.autoTable({
    startY: yPosition,
    head: [['Date', 'Weight']],
    body: weightData.map((record: any) => [
      record.date,
      record.weight
    ]),
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    styles: { fontSize: 9 },
    margin: { left: 14, right: 14 }
  });
  
  return doc.lastAutoTable.finalY + 15;
};

export const renderAllergies = (
  doc: any, 
  allergyData: any[], 
  yPosition: number, 
  headerColor: string,
  textColor: string
): number => {
  if (!allergyData || allergyData.length === 0) return yPosition;
  
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
    body: allergyData.map((allergy: any) => [
      allergy.name,
      allergy.severity,
      allergy.symptoms
    ]),
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    styles: { fontSize: 9 },
    margin: { left: 14, right: 14 }
  });
  
  return doc.lastAutoTable.finalY + 15;
};

export const renderMentalHealth = (
  doc: any, 
  mentalHealthData: any[], 
  yPosition: number, 
  headerColor: string,
  textColor: string
): number => {
  if (!mentalHealthData || mentalHealthData.length === 0) return yPosition;
  
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
    body: mentalHealthData.map((record: any) => [
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
  
  return doc.lastAutoTable.finalY + 15;
};

export const renderTreatmentPlans = (
  doc: any, 
  treatmentPlans: any[], 
  yPosition: number, 
  headerColor: string,
  textColor: string,
  pageWidth: number
): number => {
  if (!treatmentPlans || treatmentPlans.length === 0) return yPosition;
  
  // Check if we need to add a new page
  if (yPosition > 180) {
    doc.addPage();
    yPosition = 20;
  }
  
  doc.setFontSize(14);
  doc.setTextColor(headerColor);
  doc.text('Treatment Plans', 14, yPosition);
  yPosition += 8;
  
  treatmentPlans.forEach((plan: any, index: number) => {
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
    
    plan.recommendations.forEach((rec: string) => {
      doc.text(`• ${rec}`, 18, yPosition);
      yPosition += 5;
    });
    
    // Add space between plans
    if (index < treatmentPlans.length - 1) {
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
  
  return yPosition;
};