// src/utils/pdfGenerator.js
import jsPDF from 'jspdf';

export const generatePDF = (data) => {
  const doc = new jsPDF();
  // eslint-disable-next-line no-unused-vars
  let yPos = 20;

  // Same as original generatePDF function
  // ... implementation ...
  doc.save(`${data.personalInfo.firstName || 'resume'}_${data.personalInfo.lastName || ''}_resume.pdf`);
};