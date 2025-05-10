
import { jsPDF } from 'jspdf';

export const addPageHeader = (
  doc: jsPDF, 
  title: string, 
  date: string, 
  headerColor: string,
  textColor: string
): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add header
  doc.setFontSize(22);
  doc.setTextColor(headerColor);
  doc.text(title, pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(textColor);
  doc.text(`Generated on ${date}`, pageWidth / 2, 28, { align: 'center' });
  
  // Add section divider
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 32, pageWidth - 14, 32);
};

export const addPageFooters = (doc: jsPDF): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageCount = doc.internal.pages.length - 1;
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
      `Page ${i} of ${pageCount}`, 
      pageWidth / 2, 
      doc.internal.pageSize.getHeight() - 10, 
      { align: 'center' }
    );
  }
};
